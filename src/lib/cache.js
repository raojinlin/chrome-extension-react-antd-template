import { Logger } from './logger';

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

/**
 * 双向链表
 */
class DoubleLinkedList {
  constructor() {
    this.init();
  }

  /**
   * @protected
   */
  init() {
    // 头结点
    this.head = new Node("#head", "head");
    // 尾节点
    this.rear = new Node("#rear", "rear");
    // 节点数量
    this.size = 0;

    this.head.next = this.rear;
    this.rear.prev = this.head;
  }

  /**
   * @param node {Node}
   */
  moveToFirst(node) {
    this.remove(node);
    this.insert(node);
  }

  /**
   * @param node {Node}
   * @return {Node}
   */
  remove(node) {
    const { next, prev } = node;

    prev.next = next;
    next.prev = prev;

    this.size--;
    return node;
  }

  /**
   * @return {Node}
   */
  pop() {
    return this.remove(this.rear.prev);
  }

  /**
   * 头插
   * @param node {Node}
   */
  insert(node) {
    const prev = this.head.next;

    this.head.next = node;
    node.prev = this.head;

    if (prev !== null) {
      node.next = prev;
      prev.prev = node;
    }

    this.size++;
  }

  toJSON() {
    const tmpArray = [];
    let currentNode = this.rear.prev;
    while(currentNode.prev !== null) {
      const { key, value } = currentNode;
      tmpArray.push({ key, value });
      currentNode = currentNode.prev;
    }
    return tmpArray;
  }
}

export default class LruCache {
  /**
   *
   * @param {number} capacity 最大容量
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = {};
    this.list = new DoubleLinkedList();
  }

  /**
   * 已存储的数量
   *
   * @readonly
   */
  get length() {
    return this.list.size;
  }

  /**
   * 获取某个 key 对应的值
   *
   * @param {*} key
   */
  get(key) {
    if (!this.has(key)) {
      return undefined;
    }

    this.list.moveToFirst(this.cache[key]);
    return this.cache[key].value;
  }

  /**
   * 设置键值对
   *
   * @param {any} key
   * @param {any} val
   */
  set(key, val) {
    if (typeof key === "undefined" || typeof val === "undefined") {
      return;
    }

    if (this.has(key)) {
      this.cache[key].value = val;
      this.list.moveToFirst(this.cache[key]);
      return;
    }

    this.cache[key] = new Node(key, val);
    this.list.insert(this.cache[key]);

    if (this.length > this.capacity) {
      delete this.cache[this.list.pop().key];
    }
  }

  /**
   * 删除某个 key
   *
   * @param {any} key
   */
  del(key) {
    this.list.remove(this.cache[key]);

    delete this.cache[key];
  }

  /**
   * 判断某个 key 是否存在
   *
   * @param {any} key
   */
  has(key) {
    return key in this.cache;
  }

  /**
   * 清空所有的内容
   */
  reset() {
    this.cache = {};
    this.list = new DoubleLinkedList();
  }
};


export class LruCacheWithExpire {
  constructor(capacity, evictInterval) {
    this.cache = new LruCache(capacity);
    this.evictTimer = null;
    this.cachekeys = new Set();
    this.evictInterval = evictInterval || (24 * 60 * 60) * 1000;
    this.logger = Logger.createLogger('LruCacheWithExpire');
  }

  _createAt() {
    return Date.now() / 1000;
  }

  _isExpired(obj) {
    if (!obj) {
      return false;
    }

    const now = Date.now() / 1000;
    return now - obj.createAt >= obj.ttl;
  }

  set(key, content, expire) {
    this.cache.set(key, {
      ttl: expire,
      content,
      createAt: this._createAt()
    });
    this.cachekeys.add(key);
  }

  get(key) {
    const obj = this.cache.get(key);
    if (obj && this._isExpired(obj)) {
      this.logger.debug(`key: "${key}" expired, ttl: ${obj.ttl}, createAt: ${new Date(obj.createAt*1000)}`);
      this.del(key);
      return null;
    }

    return obj ? obj.content : null;
  }

  del(key) {
    this.cachekeys.delete(key);
    try {
      this.cache.del(key);
      return true;
    } catch (e) {
      this.logger.debug(`ERROR, del "${key}": "${e.message}"`);
      return false;
    }
  }

  has(key) {
    return !!this.get(key);
  }

  startEvictExpiredKeys() {
    if (this.evictTimer) {
      clearInterval(this.evictTimer);
    }
    this.cachekeys.forEach(key => this.get(key));
    this.evictTimer = setInterval(_ => {
      this.cachekeys.forEach(key => this.get(key));
    }, this.evictInterval);
  }
}

export class LruCacheWithExpireWithSerialization extends LruCacheWithExpire {
  constructor(cacheKey, capacity, evictInterval) {
    super(capacity, evictInterval)
    this.isLoaded = false;
    this.cacheKey = cacheKey;
  }

  async set(key, content, expire) {
    await this.restoreDataFromStorage();
    super.set(key, content, expire);
    await this.storeDataToStorage();
  }

  async get(key) {
    await this.restoreDataFromStorage();
    const item = super.get(key);
    await this.storeDataToStorage();
    return item
  }

  async del(key) {
    await this.restoreDataFromStorage();
    const result = super.del(key);
    await this.storeDataToStorage();
    return result
  }

  async has(key) {
    await this.restoreDataFromStorage();
    const result = !!this.get(key);
    await this.storeDataToStorage();
    return result;
  }

  toJSON() {
    return {
      cacheItems: this.cache.list,
      cachekeys: [...this.cachekeys],
      evictInterval: this.evictInterval
    }
  }

  async restoreDataFromStorage() {
    if (this.isLoaded) return;
    if (!this.pendingPromise) {
      this.pendingPromise = chrome.storage.local.get(this.cacheKey);
    }
    const jsonCache = (await this.pendingPromise)[this.cacheKey];
    if (this.isLoaded) return;
    if (!jsonCache) return;
    const cachedItem = JSON.parse(jsonCache);
    const { cacheItems, cachekeys, evictInterval } = cachedItem;
    cacheItems.forEach(item => {
      this.cache.set(item.key, item.value);
    })
    this.cachekeys = new Set(cachekeys);
    this.evictInterval = evictInterval;
    this.isLoaded = true;
    this.pendingPromise = null;
  }

  async storeDataToStorage() {
    if (this.timerID) clearTimeout(this.timerID);
    this.timerID = setTimeout(async () => {
      await chrome.storage.local.set({ [this.cacheKey]: JSON.stringify(this) })
      this.timerID = 0;
    }, 0)
  }
}