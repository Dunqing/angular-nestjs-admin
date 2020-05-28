export enum Identifier {
  EDIT = 'edit', // 编辑
  READ = 'read', // 查询
  DEL = 'del', // 删除
  ADD = 'add', // 增加
  ASSIGN_ROLE = 'assign_role', // 分配角色
  ASSIGN_MENU = 'assign_menu', // 分配菜单
  ONLINE_READ = 'online_read', // 在线用户阅读
  ONLINE_OUT = 'online_out' // 在线用户踢出
}

export enum NamePrefix {
  User = 'user',
  Menu = 'menu',
  Role = 'role',
  Logging = 'logging',
  Dictionary = 'dictionary',
  DictionaryType = 'dictionary_type'
}
