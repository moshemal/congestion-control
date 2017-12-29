# congestion-control
control the number of concurrent running tasks


##usage
'''js
const {addTask} = require('congestion-control');
function task(){
    return Promise.resolve();
}
addTask(task);
'''