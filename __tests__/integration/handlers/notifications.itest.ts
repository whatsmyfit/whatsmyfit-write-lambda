const {spawn} = require('child_process');

let slsOfflineProcess: any;
const timeout = 50000;
const offlineUrl = 'http://localhost:3000';
const request = require('supertest')(offlineUrl);
const apiPath = '/notifications';

describe('notifications api', () => {
    beforeAll((done) => {
        // increase mocha timeout for this hook to allow sls offline to start
        jest.setTimeout(timeout);

        console.log('[Tests Bootstrap] Start');

        startSlsOffline(() => {
            console.log('[Tests Bootstrap] Done');
            done();
        });
    });

    afterAll(() => {
        console.log('[Tests Teardown] Start');

        stopSlsOffline();

        console.log('[Tests Teardown] Done');
    });

    // Helper functions

    function startSlsOffline(done: any) {
        slsOfflineProcess = spawn('sls', ['offline', 'start', '--stage=cicd'], {detached: true});

        console.log(`Serverless Offline started with PID: ${slsOfflineProcess.pid}`);

        slsOfflineProcess.stdout.on('data', (data: any) => {
            if (data.includes('Offline listening on')) {
                console.log(data.toString().trim());
                done();
            }
        });
    }

    function stopSlsOffline() {
        // Since serverless offline is a child process that spawns its own child process, we need to make sure we kill all of these processes in order to exit tests, see more at
        // https://azimi.me/2014/12/31/kill-child_process-node-js.html
        process.kill(-slsOfflineProcess.pid);
    }

    test('POST notifications should return 204 given valid request', async () => {
        await request
            .post(apiPath)
            .send('[{"collectionType":"activities","date":"2018-12-19","ownerId":"3G44RX","ownerType":"user","subscriptionId":"3"}]')
            .set('Accept', 'application/json')
            .expect(204)
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
            .expect(204)
            .then((res: any) => {
                expect(res).toBeDefined();
                expect(res.body).toBeDefined();
                expect(res.body).toEqual('');
            });
    });

    test('GET notifications should return 204 given validation code is valid', async () => {
        await request
            .get(apiPath)
            .query({verify: 'mysecretsubscriberverificationcodeincicdstage'})
            .set('Accept', 'application/json')
            .expect(204)
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
            .expect(404)
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
            .expect(404)
            .then((res: any) => {
                expect(res).toBeDefined();
                expect(res.body).toBeDefined();
                expect(res.body).toEqual('');
            });
    });

});
