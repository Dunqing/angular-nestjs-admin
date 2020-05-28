import { UserService } from './user.service';
import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRedis } from '@svtslv/nestjs-ioredis';
import { Redis } from 'ioredis';
import { Types } from 'mongoose';
import { REDIS_USER_TOKEN } from '../../constants/system.constant';
import { SUPER_ADMIN_ID } from '../../constants/meta.constant';

@Injectable()
export class UserRedisService {
  constructor(
    private userService: UserService,
    @InjectRedis() private readonly redisModel: Redis,
  ) {}
  async tokenToUser(token: string) {
    if (!(await this.redisModel.hexists(REDIS_USER_TOKEN, token))) {
      return null;
    }
    return this.redisModel.hget(REDIS_USER_TOKEN, token).then(value => {
      const user = JSON.parse(value);
      user._id = new Types.ObjectId(user._id);
      return user;
    });
  }

  async setTokenUser(token: string, userId: string) {
    const user = (await this.userService.getUserById(userId))[0];
    console.log(userId, SUPER_ADMIN_ID, typeof userId)
    user['superAdmin'] = userId.toString() === SUPER_ADMIN_ID;
    user['token'] = token;
    const seconds = parseInt(process.env.EXPIRES_TIME);
    return this.redisModel
      .multi()
      .hset(REDIS_USER_TOKEN, token, JSON.stringify(user))
      .expire(REDIS_USER_TOKEN, seconds)
      .exec();
  }

  delToken(token: string | string[]) {
    if (Array.isArray(token)) {
      return this.redisModel.hdel(REDIS_USER_TOKEN, ...token);
    } else {
      return this.redisModel.hdel(REDIS_USER_TOKEN, token);
    }
  }

  getTokenAll() {
    return this.redisModel.hgetall(REDIS_USER_TOKEN).then(users => {
      const showKeys = ['nickname', '_id', 'avatar', 'lastLoginTime', 'phoneNumber', 'lastLoginIp'];
      return Object.keys(users).map(token => {
        const user = JSON.parse(users[token]);
        const result = {
          token,
        };
        showKeys.forEach(key => {
          result[key] = user[key];
        });
        return result;
      });
    });
  }
}
