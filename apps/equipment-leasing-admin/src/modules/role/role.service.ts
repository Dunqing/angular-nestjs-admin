import { Injectable } from '@nestjs/common';
import { Role, AssigningRoles } from './role.model';
import { InjectModel } from 'nestjs-typegoose';
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { User } from '../user/user.model';
import { Types } from 'mongoose';
import { RoleMenu, AssigningMenus } from '../model/role-menu.model';
import { MenuService } from '../menu/menu.service';
import { MenuType } from '../menu/menu.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role) private readonly roleModel: MongooseModel<Role>,
    @InjectModel(User) private readonly userModel: MongooseModel<User>,
    @InjectModel(RoleMenu)
    private readonly roleMenuModel: MongooseModel<RoleMenu>,
    private readonly menuService: MenuService,
  ) {}
  
  createRole(_id: Types.ObjectId, data: Role): Promise<Role> {
    return this.roleModel.create({
      ...data,
      creatorId: _id
    });
  }
  
  delRole(roleIds: Types.ObjectId[]): any {
    return this.roleModel.deleteMany({
      _id: { $in: roleIds }
    })
  }

  updateRole(id: Types.ObjectId, data: Role): Promise<Role> {
    return this.roleModel.findOneAndUpdate({ id }, data, { new: true }).exec();
  }

  async roleList(childrenIds): Promise<any> {
    if (childrenIds) {
      return this.roleModel.find({ creatorId: { $in: childrenIds } })
    }
    return this.roleModel.find()
  }


  async paginateList(querys: any, options: any): Promise<any> {
    const roles = this.roleModel.aggregate([
      ...querys,
      {
        $lookup: {
          from: 'rolemenus', //关联查询表2
          localField: '_id', //关联表1的商品编号ID
          foreignField: 'roleId', //匹配表2中的ID与关联表1商品编号ID对应
          as: 'menus', //满足 localField与foreignField的信息加入orderlists集合
        },
      },
      {
        $lookup: {
          from: 'menus', //关联查询表2
          localField: 'menus.menuId', //关联表1的商品编号ID
          foreignField: '_id', //匹配表2中的ID与关联表1商品编号ID对应
          as: 'menus', //满足 localField与foreignField的信息加入orderlists集合
        },
      },
    ]);
    const paginate = await (this.roleModel as any).aggregatePaginate(roles, options)
    for (const role of paginate.docs) {
      role.menus = await this.menuService.getMergeMenu(null, role.menus);
    }
    return paginate
  }

  async assigningRoles(data: AssigningRoles): Promise<any> {
    // const rolesId: any[] = data.roleIds.map(id => new Types.ObjectId(id));
    return this.userModel.findByIdAndUpdate(
      data.userId,
      { roles: data.roleIds },
      { new: true },
    );
  }

  async assigningMenus(data: AssigningMenus): Promise<any> {
    const insertList = data.menuIds.map((_id) => {
      return {
        roleId: data.roleId,
        menuId: _id,
      };
    });
    await this.roleMenuModel.deleteMany({
      roleId: Types.ObjectId(data.roleId),
    });
    return this.roleMenuModel.insertMany(insertList);
  }
}
