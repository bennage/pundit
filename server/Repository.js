export class Repository {

    constructor (documentClient) {
        this.documentClient = documentClient;
    }

    persistComment () {
        return new Promise(resolve => { resolve(true); });
    }
}
