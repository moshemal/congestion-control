# congestion-control
Control the number of concurrent running tasks. When a task fails (return a rejected promise) the module retry to run it a configured number of times.


Inspired by TCP congestion control mechanism. The mechanism has a window of size n, which contains the current running tasks, and a queue which contains all the rest of the tasks. The window size increase or decrease itself by watching the number of success or fail responses.   


## Usage
```js
const {Congestion} = require('congestion-control');
const addTask = Congestion();
const aTask = () => {
    return Promise.resolve('aTask is finished');
};

addTask(aTask).then( result => {
    console.log(result);  //aTask is finished
});
```

## Configurations
### retries (default 3)
When the task fails by returning a rejected promise the module will retry to tun it *retries* times. 
```js
const {Congestion} = require('congestion-control');
const addTask = Congestion({
    retries: 3
});
```

### initialWindowSize (default 1)
The initial number of tasks the module will run concurrently. All the rest of the tasks will wait on a queue till one of the running tasks finishes.
The window size will adjust itself automatically to the optimal size. 
```js
const {Congestion} = require('congestion-control');
const addTask = Congestion({
    initialWindowSize: 10
});
```

### maximumWindowSize (default Infinity)
Maximum number of tasks the module will run concurrently.
Note that if initialWindowSize is bigger than maximumWindowSize then initialWindowSize will be equal to maximumWindowSize
```js
const {Congestion} = require('congestion-control');
const addTask = Congestion({
    maximumWindowSize: 9
});
```