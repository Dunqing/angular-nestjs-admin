import { Injectable } from '@nestjs/common';
import { Role, AssigningRoles } from './role.model';
import { InjectModel } from 'nestjs-typegoose';
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { User } from '../user/user.model';
import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { RoleMenu, AssigningMenus } from '../model/role-menu.model';
import { MenuService } from '../menu/menu.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role) private readonly roleModel: MongooseModel<Role>,
    @InjectModel(User) private readonly userModel: MongooseModel<User>,
    @InjectModel(RoleMenu)
    private readonly roleMenuModel: MongooseModel<RoleMenu>,
    private readonly menuService: MenuService,
  ) {}

  createRole(data: Role): Promise<Role> {
    return this.roleModel.create(data);
  }

  updateRole(id: number, data: Role): Promise<Role> {
    return this.roleModel.findOneAndUpdate({ id }, data, { new: true }).exec();
  }

  async roleList(): Promise<any> {
    const roles = await this.roleModel.aggregate([
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
    for (const role of roles) {
      role.menus = await this.menuService.getMergeMenu(null, role.menus);
    }
    return roles;
  }

  async assigningRoles(data: AssigningRoles): Promise<any> {
    const roles: any[] = await this.roleModel
      .find({ id: { $in: data.roleId } })
      .exec();
    const rolesId: any[] = roles.map(item => new Types.ObjectId(item._id));
    return this.userModel.findOneAndUpdate(
      { id: data.userId },
      { roles: rolesId },
      { new: true },
    );
  }

  async assigningMenus(data: AssigningMenus): Promise<any> {
    const insertList = data.menuId.map(_id => {
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
