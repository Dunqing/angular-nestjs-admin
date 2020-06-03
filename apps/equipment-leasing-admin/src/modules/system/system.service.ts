import { Injectable } from '@nestjs/common';
import { exec } from 'child-process-promise'
import * as path from 'path'


@Injectable()
export class SystemService {
  
  // 备份mongo数据
  backupMongodb() {
    const host = '127.0.0.1'
    const dbName = 'equipment-leasing'
    const dictionaryPath = path.join(__dirname, '/mongo_backup')
    const cmd = `mongodump -h ${host} -d ${dbName} -o ${dictionaryPath}`
    console.log(cmd)
    return exec(cmd).then((result) => {
      const stdout = result.stdout;
      const stderr = result.stderr;
      console.log('stdout: ', stdout);
      console.log('stderr: ', stderr);
      return result
    }).catch(function (err) {
      console.error('ERROR: ', err);
    });
  }

  // 还原mongo数据
  restoreMongodb() {
    const host = '127.0.0.1'
    const dbName = 'equipment-leasing'
    const dictionaryPath = path.join(__dirname, `/mongo_backup/${dbName}`)
    const cmd = `mongorestore -h ${host} -d ${dbName} --dir ${dictionaryPath}`
    return exec(cmd).then((result) => {
      const stdout = result.stdout;
      const stderr = result.stderr;
      console.log('stdout: ', stdout);
      console.log('stderr: ', stderr);
      return result
    }).catch(function (err) {
      console.error('ERROR: ', err);
    });
  }
}
