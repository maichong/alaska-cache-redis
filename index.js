/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

'use strict';

const redis = require('redis');

class RedisCacheDriver {
  constructor(options) {
    this._maxAge = options.maxAge || 86400 * 365 * 10 * 1000;
    this._driver = redis.createClient(options);
    this.type = 'redis';
    //标识已经是缓存对象实例
    this.isCacheDriver = true;
    //标识本驱动不会序列化数据
    this.noSerialization = false;
  }

  driver() {
    return this._driver;
  }

  set(key, value, lifetime) {
    return new Promise((resolve, reject)=> {
      lifetime = lifetime || this._maxAge;
      console.log('set', key, value, lifetime);
      this._driver.set(key, value, 'px', lifetime, function (error, res) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  get(key) {
    return new Promise((resolve, reject)=> {
      this._driver.get(key, function (error, res) {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      })
    });
  }

  del(key) {
    return new Promise((resolve, reject)=> {
      this._driver.del(key, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      })
    });
  }

  has(key) {
    return new Promise((resolve, reject)=> {
      this._driver.exists(key, function (error, exists) {
        if (error) {
          reject(error);
        } else {
          resolve(!!exists);
        }
      })
    });
  }

  size() {
    return new Promise((resolve, reject)=> {
      this._driver.dbsize(function (error, size) {
        if (error) {
          reject(error);
        } else {
          resolve(size);
        }
      });
    });
  }

  flush() {
    return new Promise((resolve, reject)=> {
      this._driver.flushdb(function (error, size) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

}

module.exports = RedisCacheDriver.default = RedisCacheDriver;
