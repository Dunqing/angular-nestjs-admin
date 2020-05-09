import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Menu } from './menu.model';
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { Types, Model } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';

@Injectable()
export class MenuService {
  constructor(
  @InjectModel(Menu) private readonly menuModel: MongooseModel<Menu>,
  ) {}
    
  async updateMenu(data: Menu): Promise<Menu> {
    // return
    const id = data._id
    Reflect.deleteProperty(data, '_id')
    Reflect.deleteProperty(data, 'id')
    Reflect.deleteProperty(data, 'pid')
    Reflect.deleteProperty(data, '__v')
    console.log(id, data, 'top')
    const menu = await this.menuModel.findById(id)
    console.log(menu, 'menu')
    const a = await this.menuModel.findByIdAndUpdate(id, data, { new: true })  
    console.log(a, 123)
    return a
  }

  createMenu(creatorId: Types.ObjectId, data: Menu): Promise<Menu> {
    return this.menuModel.create({ ...data, creatorId: creatorId });
  }

  async getList(): Promise<Menu[]> {
    return this.menuModel.find().exec();
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
        .find({})
        .sort({ sort: -1 })
        .exec();
    }

    async function findAllChild(menu: DocumentType<Menu>) {
      const result = [];
      let menuIndex = 0;
      while (menuIndex < menus.length) {
        const menuItem: DocumentType<Menu> = menus[menuIndex];
        if (!menu._id.equals(menuItem.pid)) {
          // console.log(menu._id, menuItem.pid, typeof menu._id.toString(), menu._id.equals(menuItem.pid))
          menuIndex++;
          continue;
        }
        menus.splice(menuIndex as any, 1);
        const child = await findAllChild(menuItem);
        result.push(child);
      }

      return { ...(menu.toObject ? menu.toObject() : menu), children: result };
    }
    let menuIndex = 0;
    while (menuIndex < menus.length) {
      const menu = menus[menuIndex];
      if ((!_id && !menu.pid) || _id === undefined || menu.id === Number(_id)) {
        menus.splice(menuIndex as any, 1);
        const mergeMenu = await findAllChild(menu);
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
