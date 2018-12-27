const {spawn} = require('child_process');
import * as request from 'supertest';

let slsOfflineProcess: any;
const timeout = 50000;
const offlineUrl = 'http://localhost:3000';
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
        slsOfflineProcess = spawn('sls', ['offline', 'start'], {detached: true});

        console.log(`Serverless Offline started with PID: ${slsOfflineProcess.pid}`);

        slsOfflineProcess.stdout.on('data', (data: any) => {
            if (data.includes('Offline listening on')) {
                console.log(data.toString().trim());
                done();
            }
        });

        slsOfflineProcess.stderr.on('data', (errData: any) => {
            console.log(`Error message in stderr: \n${errData}`);
        });
    }

    function stopSlsOffline() {
        // Since serverless offline is a child process that spawns its own child process, we need to make sure we kill all of these processes in order to exit tests, see more at
        // https://azimi.me/2014/12/31/kill-child_process-node-js.html
        process.kill(-slsOfflineProcess.pid);
    }

    test('POST notifications returns 204 given valid request', async () => {
        const result = await request(offlineUrl)
            .post(apiPath)
            .send('[{"collectionType":"activities","date":"2018-12-19","ownerId":"3G44RX","ownerType":"user","subscriptionId":"3"}]')
            .set('Accept', 'application/json');

        expect(result.status).toEqual(204);
    });

    test('POST notifications returns 204 given invalid request', async () => {
        const result = await request(offlineUrl)
            .post(apiPath)
            .set('Accept', 'application/json');

        expect(result.status).toEqual(204);
    });

});
