import { InjectModel } from '../../transformers/model.transoformer';
import { Injectable } from '@nestjs/common';
import { User, UserLogin, ChangePassword } from './user.model';
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { TokenResult } from '../../interfaces/http.interface';
import { MenuService } from '../menu/menu.service';
import { RoleMenu } from '../model/role-menu.model';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: MongooseModel<User>,
    @InjectModel(RoleMenu) private readonly roleMenu: MongooseModel<RoleMenu>,
    // @InjectRedis() private readonly redisModel: Redis,

    private readonly jwtService: JwtService,
    private readonly menuService: MenuService,
  ) {}

  async createUser(creatorId: Types.ObjectId, user: User): Promise<User> {
    const hasUser = await this.userModel.findOne({
      username: user.username,
    });

    if (!hasUser) {
      return this.userModel.create({
        ...user,
        creatorId,
      });
    } else {
      // console.log(hasUser);
      return Promise.reject('用户已存在！');
    }
  }

  async DelUsers(
    canDelIds: Types.ObjectId[],
    userIds: Types.ObjectId[],
  ): Promise<any> {
    return this.userModel
      .find({
        $and: [
          {
            creatorId: {
              $in: canDelIds,
            },
          },
          {
            _id: {
              $in: userIds,
            },
          },
        ],
      })
      .exec()
      .then(users => {
        if (users.length === userIds.length) {
          return this.userModel.deleteMany({ _id: { $in: userIds } });
        } else {
          return Promise.reject('无权删除');
        }
      });
  }

  async getUserById(_id: string): Promise<any> {
    return await this.userModel.aggregate([
      {
        $match: {
          _id: { $eq: Types.ObjectId(_id) },
        },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'roles',
          foreignField: '_id',
          as: 'roles',
        },
      },
      {
        $lookup: {
          from: 'rolemenus', //关联查询表2
          localField: 'roles._id', //关联表1的商品编号ID
          foreignField: 'roleId', //匹配表2中的ID与关联表1商品编号ID对应
          as: 'menus', //满足 localField与foreignField的信息加入orderlists集合
        },
      },
      {
        $lookup: {
          from: 'menus', //关联查询表2
          // localField: 'menus.menuId', //关联表1的商品编号ID
          // foreignField: '_id',
          let: { menus: '$menus' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $ne: ['$permissionIdentifier', ''],
                    },
                    // {
                    //   $eq: ['$type', 1],
                    // },
                    {
                      $in: ['$_id', '$$menus.menuId'],
                    },
                  ],
                },
              },
            },
            {
              $sort: {
                sort: 1,
              },
            },
          ],
          as: 'menus', //满足 localField与foreignField的信息加入orderlists集合
        },
      },
      {
        $addFields: {
          permissionIdentifierList: '$menus.permissionIdentifier',
        },
      },
      {
        $project: {
          menus: 0,
        },
      },
    ]);
  }

  getUserChildrenId(currentUserId: Types.ObjectId, includeMe = true) {
    return this.userModel
      .aggregate([
        {
          $match: {
            _id: { $eq: currentUserId },
          },
        },
        {
          $graphLookup: {
            from: 'users',
            startWith: '$_id',
            connectFromField: '_id',
            connectToField: 'creatorId',
            as: 'users',
          },
        },
        {
          $addFields: {
            userIds: '$users._id',
          },
        },
      ])
      .then(userList => {
        if (!userList.length) {
          return [];
        }
        return includeMe
          ? [...userList[0].userIds, userList[0]._id]
          : userList[0]?.userIds;
      });
  }

  async adminLogin(ip: string, userData: UserLogin): Promise<any> {
    const user = await this.userModel
      .findOne({
        username: userData.username,
      })
      .select('+password');
    if (!user) {
      return Promise.reject('账号不存在');
    } else if (!compareSync(userData.password, user.password)) {
      return Promise.reject('密码错误');
    } else {
      user.lastLoginIp = ip;
      user.lastLoginTime = new Date();
      user.save();
    }
    return Promise.resolve({
      userId: user._id,
      token: this.createToken((user as any)._id),
    });
  }

  updateUser(id: Types.ObjectId, data: User): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .then(user => {
        return user || Promise.reject('无权修改');
      });
  }

  getCurrentUserMenus(user: User) {
    const roles = user.roles.map(item => {
      return new Types.ObjectId((item as any)._id);
    });
    return this.roleMenu
      .aggregate([
        {
          $match: {
            roleId: {
              $in: roles,
            },
          },
        },
        {
          $group: {
            _id: null,
            menus: {
              $addToSet: '$menuId',
            },
          },
        },
        {
          $lookup: {
            from: 'menus', //关联查询表2
            let: { menus: '$menus' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$_id', '$$menus'],
                  },
                },
              },
              {
                $sort: {
                  sort: 1,
                },
              },
            ],
            as: 'menus', //满足 localField与foreignField的信息加入orderlists集合
          },
        },
      ]).then((menus) => {
        if (!menus || (menus && !menus.length)) {
          return [];
        }
        return menus[0].menus
      })
  }

  async currentUserMenu(user: User): Promise<any> {
    return this.getCurrentUserMenus(user)
      .then(menus => {
        return this.menuService.getMergeMenu(null, menus);
      });
    // console.log(menus[0].menus)
  }

  changePassword(id: Types.ObjectId, data: ChangePassword) {
    if (data.password == data.newPassword1) {
      return Promise.reject('新密码不能和原密码一样');
    } else if (data.newPassword1 != data.newPassword2) {
      return Promise.reject('两次新密码不一样');
    }
    return this.userModel
      .findById(id)
      .select('+password')
      .then(user => {
        if (user) {
          if (compareSync(data.password, user.password)) {
            user.password = data.newPassword1;
            user.save();
            // TODO: 需要执行退登
            return Promise.resolve();
          } else {
            return Promise.reject('密码不正确！');
          }
        }
        return Promise.reject('禁止修改，查不到此用户');
      });
  }

  createToken(_id: string): TokenResult {
    const accessToken = this.jwtService.sign({
      _id,
    });
    return {
      accessToken: accessToken,
      expiresTime: Number(process.env.EXPIRES_TIME),
    };
  }

  getPaginateList(querys?: any, options?: any): Promise<any> {
    return this.userModel.paginate(querys, { populate: 'roles', ...options });
  }

  // Redis Function
}
