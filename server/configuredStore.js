import { Store } from './Store';
import { DocumentClientWrapper } from 'documentdb-q-promises';
import logger from 'winston';
import Q from 'q';

const host = process.env.PUNDIT_DOCDB_ENDPOINT;
const masterKey = process.env.PUNDIT_DOCDB_KEY;

if(!host) {
    throw 'process.env.PUNDIT_DOCDB_ENDPOINT is not defined';
}

if(!masterKey) {
    throw 'process.env.PUNDIT_DOCDB_KEY is not defined';
}

logger.info(`PUNDIT_DOCDB_ENDPOINT : ${host}`);
logger.info(`PUNDIT_DOCDB_KEY : ${masterKey}`);

var client = new DocumentClientWrapper(host, { masterKey: masterKey });

export default new Store(client);
