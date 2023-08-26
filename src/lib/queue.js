import { Logger } from './logger';

export default class Queue {
  constructor(capacity) {
    this.capacity = capacity;
    this.items = [];
  }

  enqueue(item) {
    if (this.items.length >= this.capacity) {
      return false;
    }

    this.items.push(item);
    return true;
  }

  dequeue() {
    if (this.items.length === 0) {
      return null;
    }

    return this.items.unshift();
  }
}

export class PromiseQueue {
  queue = [];

  workingOnPromise = false;

  concurrent = 1;

  constructor(concurrent=5) {
    this.concurrent = concurrent;
    this.penddingItems = 0;

    this.logger = Logger.createLogger(`PromiseQueue<concurrent:${concurrent}>`);
  }

  /**
   * enqueue
   * @param promise
   * @param status {boolean}
   * @param taskID {string}
   * @return {*}
   */
  enqueue(promise, status=true, taskID='') {
    return new Promise((resolve, reject) => {
      this.queue.push({
        promise,
        resolve,
        reject,
        status,
        taskID
      });
    });
  }

  cancelTask(taskID) {
    const taskPos = this.queue.indexOf(task => task.taskID === taskID);
    if (taskPos === -1) {
      return false;
    }

    this.queue[taskPos].reject(`task ${taskID} reject by cancel`);
    this.logger.debug('task', this.queue[taskPos].taskID, 'canceled');
    this.queue.splice(taskPos, 1);
    return true;
  }

  cancelTasks(taskIDs) {
    if (!taskIDs.length) {
      return false;
    }

    this.queue = this.queue.filter(task => {
      if (!taskIDs.includes(task.taskID)) {
        return true;
      }

      task.reject(`${task.taskID} rejected by cancel`);
      this.logger.debug('task', task.taskID, 'canceled');
      return false;
    });
    return true;
  }

  dequeue() {
    if (this.workingOnPromise) {
      return false;
    }

    const tasks = this.queue.splice(0, this.concurrent);

    if (tasks.length === 0) {
      return false;
    }

    this.workingOnPromise = true;
    Promise.all(tasks.map(task => {
      if (!task.status) {
        return false;
      }

      task.workStatus = 'pending';
      return task.promise()
        .then(value => {
          task.resolve(value);
          task.workStatus = 'fullfilled';
        }).catch(err => {
          task.reject(err);
          task.workStatus = 'failed';
        });
    })).then(() => {
      this.workingOnPromise = false;
    }).catch(err => {
      console.error(err);
    }).finally(_ => {
      this.dequeue();
    });

    return true;
  }

  inspect() {
    return this.queue;
  }
}
