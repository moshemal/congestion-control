'use strict';

const defaultOps = {
    initialWindowSize: 5,
    retries: 3,
    maximumWindowSize: Infinity,
};

class CongestionControl {
  constructor(options){
      const ops = Object.assign({}, defaultOps, options);
      this._currentPending    = 0;
      this._windowSize        = ops.initialWindowSize > ops.maximumWindowSize ? ops.maximumWindowSize : ops.initialWindowSize;
      this._nSuccess          = 0;
      this._errorMap          = new Map();
      this._q                 = [];
      this.retries            = ops.retries;
      this.maximumWindowSize  = ops.maximumWindowSize;
  }
  addTask(func){
      const promise = new Promise((resolve, reject)=>{
          this._q.push({func, resolve, reject});
      });
      this.pull();
      return promise;
  }
  pull(){
      while(this._currentPending < this._windowSize && this._q.length){
          const task = this._q.shift();
          this._currentPending++;
          task.func()
              .then( r => {
                  this._currentPending--;
                  this._nSuccess++;
                  if(this._nSuccess === this._windowSize){
                      this.increase();
                  }
                  task.resolve(r);
                  this.pull();
              })
              .catch( e => {
                  this._currentPending--;
                  this.decrease();
                  let n = (this._errorMap.get(task.func) || 0) + 1;
                  if (n > this.retries) {
                      this._errorMap.delete(task);
                      task.reject(e);
                  } else {
                      this._errorMap.set(task.func, n);
                      this._q.unshift(task);
                  }
                  this.pull();
              })
      }
  }
  increase(){
      this._nSuccess = 0;
      this._windowSize < this.maximumWindowSize && this._windowSize++;
  }

  decrease(){
      this._nSuccess = -this._currentPending;
      if(this._windowSize > 1) this._windowSize--;
  }
}

module.exports = CongestionControl;