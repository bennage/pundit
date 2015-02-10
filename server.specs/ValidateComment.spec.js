import { expect } from 'chai';
import { ValidateComment } from '../server/ValidateComment';

describe('When validating', () => {

    var valid_comment = {
        author: 'github_username',
        body: 'blah blah blah'
    };

    it('a valid comment returns true', () => {
        var result = ValidateComment(valid_comment);
        expect(result).to.be.true();
    });

    describe('a comment without an author', () => {

        var comment = Object.assign({}, valid_comment);
        delete comment.author;

        it('should throw', () => {
            expect(() => {
                ValidateComment(comment);
            }).to.throw('The comment does not have an author.');
        });
    });

    describe('a comment without a body', () => {

        var comment = Object.assign({}, valid_comment);
        delete comment.body;

        it('should throw', () => {
            expect(() => {
                ValidateComment(comment);
            }).to.throw('The comment does not have a body.');
        });
    });
});
