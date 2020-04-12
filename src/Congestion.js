const CongestionControl = require('./CongestionControl');

function Congestion(ops = {}){
    const cc = new CongestionControl(ops);
    return function addTask(func){
        return cc.addTask(func);
    }
}

module.exports = Congestion;