const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

describe('It is a default test', () => {

    it('should always pass', () => {
        let success = true;
        expect(success).to.equal(true);
    });

});
