const assert = require('assert');
const Congestion = require('./Congestion');


describe('Congestion with window size 1', function() {
    beforeEach(function(){
       this.addTask = Congestion({
           initialWindowSize: 1
       });
    });

    it('should return true', function() {
        return this.addTask(()=>{return Promise.resolve(true)}).then( result => {
            assert.equal(result, true);
        })
    });
    it('should throw an error after 3 retries', function() {
        let count = 0;
        return this.addTask(()=>{
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
        return this.addTask(()=>{
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
        this.addTask(()=>{
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
        return this.addTask(()=>{
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
