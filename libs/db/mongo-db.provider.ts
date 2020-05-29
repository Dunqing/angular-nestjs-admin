import { MONGO_DB_TOKEN } from '../constatns/system.constant';
import { mongoose } from '@typegoose/typegoose';

export const mongoProvider = {
  provide: MONGO_DB_TOKEN,
  async useFactory() {
    let reConnectionTask = null;
    const RECONNET_INTERVAL = 6000;

    const connection = () => {
      const url = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/equipment-leasing`
      return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        promiseLibrary: global.Promise,
      });
    };

    mongoose.connection.on('connecting', () => {
      console.log('数据库连接中...');
    });

    mongoose.connection.on('open', () => {
      console.info('数据库连接成功！');
      clearTimeout(reConnectionTask);
      reConnectionTask = null;
    });

    mongoose.connection.on('disconnected', () => {
      console.error(`数据库失去连接！尝试 ${RECONNET_INTERVAL / 1000}s 后重连`);
      reConnectionTask = setTimeout(connection, RECONNET_INTERVAL);
    });

    mongoose.connection.on('error', error => {
      console.error('数据库发生异常！', error);
      mongoose.disconnect();
    });
    return await connection();
  },
};
