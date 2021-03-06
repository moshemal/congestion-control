const assert = require('assert');
const CongestionControl = require('./CongestionControl');


describe('CongestionControl class', function(){

    it('should create an instance', function(){
        const instance = new CongestionControl();
        assert.ok(instance);
        ['addTask', 'pull', 'increase', 'decrease'].forEach( fName => {
            assert.equal(typeof instance[fName], 'function');
        });
    });
    
    it('should initiate default props', function(){
        const instance = new CongestionControl();
        const instance2 = new CongestionControl({
            initialWindowSize: 7,
            retries: 2,
            maximumWindowSize: 20,
        });
        assert.equal(instance._windowSize, 5);
        assert.equal(instance.retries, 3);
        assert.equal(instance.maximumWindowSize, Number.POSITIVE_INFINITY);
        assert.equal(instance2._windowSize, 7);
        assert.equal(instance2.retries, 2);
        assert.equal(instance2.maximumWindowSize, 20);
    });
    //TODO: window size is adjusting, no starving,
});

describe('CongestionControl with window size 1', function() {
    beforeEach(function() {
       this.cc = new CongestionControl({
           initialWindowSize: 1
       });
    });

    it('should return true', function() {
        return this.cc.addTask(()=>{return Promise.resolve(true)}).then( result => {
            assert.equal(result, true);
        })
    });

    it('should throw an error after 3 retries', function() {
        let count = 0;
        return this.cc.addTask(()=>{
            count++;
            return Promise.reject('rejected')
        }).then( () => {
            assert.fail();
        }).catch( e => {
            assert.equal(count, 4);
            assert.equal(e, 'rejected');
        })
    });
    it('should success after 2 retries', function() {
        let count = 0;
        return this.cc.addTask(()=>{
            count++;
            if (count < 3) return Promise.reject('rejected');
            return Promise.resolve('success');
        }).then( (r) => {
            assert.equal(r, 'success');
            assert.equal(count, 3);
        }).catch( e => {
            assert.fail(e);
        })
    });
    it('should run the second task only after the first is finished', function(){
        let first = 0, second = 0;
        this.cc.addTask(()=>{
            return new Promise((resolve, reject)=>{
                setTimeout(()=>{
                    first++;
                    reject('first task');
                }, 100)
            });
        }).catch((e)=>{
            assert.equal(e, 'first task');
            assert.equal(first, 4);
            assert.equal(second, 0);
        });
        return this.cc.addTask(()=>{
            return Promise.resolve('success');
        }).then(r=>{
            second++;
            assert.equal(r, 'success');
            assert.equal(first, 4);
        }).catch( e => {
            assert.fail(e);
        })
    });

});
