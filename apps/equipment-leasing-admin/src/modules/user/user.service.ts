import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Injectable } from '@nestjs/common';
import { User, UserLogin } from './user.model';
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { TokenResult } from '../../interfaces/http.interface';
import { MenuService } from '../menu/menu.service';
import { RoleMenu } from '../model/role-menu.model';
import { Types } from 'mongoose';
import { SUPER_ADMIN_ID } from '../../constants/meta.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: MongooseModel<User>,
    @InjectModel(RoleMenu) private readonly roleMenu: MongooseModel<RoleMenu>,
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
      console.log(hasUser);
      return Promise.reject('用户已存在！');
    }
  }

  async getUserById(_id: string): Promise<User> {
    return this.userModel
      .findById(_id)
      .populate('roles')
      .exec();
  }

  /**
   * 
   * @param currentId {
  "username": "string",
"nickname": "woaini1",
"password": "123456",
"phoneNumber": "15917033340"
}
   */
  async getUserChildrenId(currentId: Types.ObjectId) {
    const userList = await this.userModel.aggregate([
      {
        $match: {
          _id: { $eq: currentId },
        },
      },
      {
        $graphLookup: {
          from: 'users',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'creatorId',
          as: 'userId',
        },
      },
      {
        $group: {
          _id: '$userId',
          users: {
            $addToSet: '$userId._id',
          },
        },
      },
      {
        $project: {
          _id: 0,
          users: 1,
        },
      },
      {
        $unwind: {
          path: '$users',
        },
      },
    ]);
    console.log(userList[0]?.users);
    return userList[0]?.users;
  }

  async adminLogin(userData: UserLogin): Promise<any> {
    const user = await this.userModel
      .findOne({
        username: userData.username,
      })
      .select('+password');
    if (!user) {
      return Promise.reject('账号不存在');
    }
    if (!compareSync(userData.password, user.password)) {
      return Promise.reject('密码错误');
    }
    return Promise.resolve(this.createToken((user as any)._id));
  }

  async currentUserMenu(user: any): Promise<any> {
    if (user.superAdmin) {
      return this.menuService.getMergeMenu()
    }
    const roles = user.roles.map(item => {
      return item._id;
    });
    const menusObject = await this.roleMenu.aggregate([
      {
        $match: {
          roleId: {
            $in: roles,
          },
        },
      },
      {
        $group: {
          _id: '$menuId',
          menuId: {
            $first: '$menuId',
          },
        },
      },
      {
        $lookup: {
          from: 'menus', //关联查询表2
          localField: 'menuId', //关联表1的商品编号ID
          foreignField: '_id', //匹配表2中的ID与关联表1商品编号ID对应
          as: 'menus', //满足 localField与foreignField的信息加入orderlists集合
        },
      },
      {
        $sort: {
          sort: 1
        }
      }
    ]);
    const menus = menusObject.map(item => {
      return item.menus[0];
    });
    return this.menuService.getMergeMenu(null, menus);
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
}
