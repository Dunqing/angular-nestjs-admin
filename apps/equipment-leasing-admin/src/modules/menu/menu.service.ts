import { Injectable } from '@nestjs/common';
import { InjectModel } from '../../transformers/model.transoformer';
import { Menu } from './menu.model';
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { Types, Model } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import { RoleMenu } from '../model/role-menu.model';
import { SUPER_ROLE_ID } from '../../constants/meta.constant';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu) private readonly menuModel: MongooseModel<Menu>,
    @InjectModel(RoleMenu)
    private readonly roleMenuModel: MongooseModel<RoleMenu>,
  ) {}

  async updateMenu(id: Types.ObjectId, data: Menu): Promise<Menu> {
    return this.menuModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteMenu(menuIds: Types.ObjectId[]): Promise<any> {
    menuIds = menuIds.map((id: any) => Types.ObjectId(id));
    const menus = await this.menuModel.aggregate([
      {
        $match: {
          _id: { $in: menuIds },
        },
      },
      {
        $graphLookup: {
          from: 'menus',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'pid',
          as: 'children',
        },
      },
      {
        $project: {
          menus: '$children._id',
        },
      },
    ]);
    const delIds = [...menuIds, ...menus[0].menus];
    return Promise.all([
      this.roleMenuModel.deleteMany({
        menuId: { $in: delIds },
      }),
      this.menuModel.deleteMany({
        _id: { $in: delIds },
      }),
    ]);
    // return menus
  }

  createMenu(creatorId: Types.ObjectId, data: Menu): Promise<Menu> {
    return this.menuModel
      .create({ ...data, creatorId: creatorId })
      .then((menu: Menu) => {
        if (menu._id) {
          this.roleMenuModel.create({
            roleId: SUPER_ROLE_ID,
            menuId: menu._id,
          });
        }
        return menu;
      });
  }

  async getList(menuIds = []): Promise<Menu[]> {
    return this.menuModel.find({ _id: { $in: menuIds } }).exec();
  }

  async getMergeMenu(
    _id?: Types.ObjectId | string | null,
    someMenus?: Array<DocumentType<Menu>>,
  ): Promise<Menu[]> {
    const result = [];
    let menus: Array<DocumentType<Menu>> = [];
    if (someMenus) {
      menus = someMenus;
    } else {
      menus = await this.menuModel
        .find()
        .sort({ sort: 1 })
        .exec();
    }

    async function findAllChild(menu: DocumentType<Menu>) {
      const result = [];
      let menuIndex = 0;
      while (menuIndex < menus.length) {
        const menuItem: DocumentType<Menu> = menus[menuIndex];
        // console.log(menuItem.meta.title, menuIndex, menus.length)
        if (!menu._id.equals(menuItem.pid)) {
          menuIndex++;
          continue;
        }
        // console.log(menuItem.meta.title, menuIndex, menus.length, '开始')
        menus.splice(menuIndex, 1);
        // console.log(menu.meta.title, menuIndex, menus.length)
        const child = await findAllChild(menuItem);
        menuIndex = 0;
        result.push(child);
      }
      return { ...(menu.toObject ? menu.toObject() : menu), children: result };
    }

    // 便利一遍数据拿顶层的
    let menuIndex: any = 0;
    while (menuIndex < menus.length) {
      const menu = menus[menuIndex];
      if (
        (!_id && !menu.pid) ||
        (_id === undefined && !menu.pid) ||
        menu.id === Number(_id)
      ) {
        menus.splice(menuIndex, 1);
        const mergeMenu = await findAllChild(menu);
        menuIndex = 0
        result.push(mergeMenu);
        if (_id) {
          break;
        }
      } else {
        menuIndex++;
      }
    }
    return result;
  }
}
