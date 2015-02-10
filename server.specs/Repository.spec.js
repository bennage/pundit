import { expect } from 'chai';
import { Repository } from '../server/Repository';

class DocumentClientStub {

}

describe('A repository', () => {

    it('can persist a comment', done => {

        var client = new DocumentClientStub();
        var repo = new Repository(client);

        var blobSha = 'something';
        var comment = {};

        repo
            .persistComment(blobSha, comment)
            .then(response => {
                expect(response).to.be.true();
                done();
            });

    });
});
