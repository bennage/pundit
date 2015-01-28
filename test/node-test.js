require(['chai', "/base/app/modules/node.js"], function(chai, node) {
    console.log('loaded');
  var assert = chai.assert;
  describe('Array', function(){

    describe('#indexOf()', function(){

      it('should return -1 when the value is not present', function(){
        assert.equal(-1, [1,2,3].indexOf(5));
        assert.equal(-1, [1,2,3].indexOf(0));
      });

      it('should fail', function() {
          assert.equal(0, 1);
      });
    });
  });
});;
