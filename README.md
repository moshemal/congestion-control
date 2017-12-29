# congestion-control
control the number of concurrent running tasks


## usage
```js
const {addTask} = require('congestion-control');
const aTask = () => {
    return Promise.resolve('aTask is finished');
}
addTask(aTask).then( result => {
    console.log(result);  //aTask is finished
});
```
