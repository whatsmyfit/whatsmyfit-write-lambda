// use serverless-stack-output to find service endpoint
const stackOutput = require('../../../.stackoutput/stack.json');
const url = stackOutput.ServiceEndpoint;
const request = require('supertest')(url);
const apiPath = '/notifications';
import * as HttpStatus from 'http-status-codes';

describe('notifications api', () => {
    beforeAll(() => {
        console.log(`Integration tests of ServiceEndpoint: ${url}`);
    });

    test('POST notifications should return 204 given valid request', async () => {
        await request
            .post(apiPath)
            .send('[{"collectionType":"activities","date":"2018-12-19","ownerId":"3G44RX","ownerType":"user","subscriptionId":"3"}]')
            .set('Accept', 'application/json')
            .expect(HttpStatus.NO_CONTENT)
            .then((res: any) => {
                expect(res).toBeDefined();
                expect(res.body).toBeDefined();
                expect(res.body).toEqual('');
            });
    });

    test('POST notifications should return 204 given missing body data', async () => {
        await request
            .post(apiPath)
            .set('Accept', 'application/json')
            .expect(HttpStatus.NO_CONTENT)
            .then((res: any) => {
                expect(res).toBeDefined();
                expect(res.body).toBeDefined();
                expect(res.body).toEqual('');
            });
    });

    test('GET notifications should return 204 given validation code is valid', async () => {
        await request
            .get(apiPath)
            .query({verify: 'mysecretsubscriberverificationcode'})
            .set('Accept', 'application/json')
            .expect(HttpStatus.NO_CONTENT)
            .then((res: any) => {
                expect(res).toBeDefined();
                expect(res.body).toBeDefined();
                expect(res.body).toEqual('');
            });
    });

    test('GET notifications should return 404 given validation codes not equal', async () => {
        await request
            .get(apiPath)
            .query({verify: '12345678'})
            .set('Accept', 'application/json')
            .expect(HttpStatus.NOT_FOUND)
            .then((res: any) => {
                expect(res).toBeDefined();
                expect(res.body).toBeDefined();
                expect(res.body).toEqual('');
            });
    });

    test('GET notifications should return 404 given validation code not sent in querystring parameters', async () => {
        await request
            .get(apiPath)
            .set('Accept', 'application/json')
            .expect(HttpStatus.NOT_FOUND)
            .then((res: any) => {
                expect(res).toBeDefined();
                expect(res.body).toBeDefined();
                expect(res.body).toEqual('');
            });
    });

});
