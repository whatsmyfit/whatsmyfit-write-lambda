import { create } from '../../src/handlers/notifications';
import { INotification } from '../../src/types';

describe('notifications handler', () => {
    const AWSMock = require('aws-sdk-mock');
    const spyConsoleError = jest.spyOn(global.console, 'error');
    const spyConsoleDebug = jest.spyOn(global.console, 'debug');

    beforeAll(() => {
        const AWS = require('aws-sdk');
        AWSMock.setSDKInstance(AWS);

        const mock = {
            handleCallback: (callback: any) => {
                callback(null, 'test');
            }
        };

        AWSMock.mock('DynamoDB.DocumentClient', 'batchWrite', (params: any, callback: any) => {
            mock.handleCallback(callback);
        });
    });

    beforeEach(() => {
        spyConsoleError.mockReset();
        spyConsoleDebug.mockReset();
    });

    test('should return 204 if saved successfully to db', () => {
        const notifications: INotification[] = [
            {
                collectionType: 'foods',
                date: '2010-03-01',
                ownerId: '228S74',
                ownerType: 'user',
                subscriptionId: '1234'
            },
            {
                collectionType: 'foods',
                date: '2010-03-01',
                ownerId: '228S74',
                ownerType: 'user',
                subscriptionId: '1234'
            },
            {
                collectionType: 'activities',
                date: '2010-03-01',
                ownerId: '184X36',
                ownerType: 'user',
                subscriptionId: '2345'
            }
        ];

        // @ts-ignore
        create({body: JSON.stringify(notifications)}, null, (error: any, response: any) => {
            expect(response.statusCode).toEqual(204);
            expect(spyConsoleDebug).toHaveBeenCalledTimes(1);
            expect(spyConsoleError).toHaveBeenCalledTimes(0);
        });
    });

    test('should return 204 if error while saving to db', () => {
        const notifications: INotification[] = [];

        // @ts-ignore
        create({body: JSON.stringify(notifications)}, null, (error: any, response: any) => {
            expect(response.statusCode).toEqual(204);
            expect(spyConsoleDebug).toHaveBeenCalledTimes(0);
            expect(spyConsoleError).toHaveBeenCalledTimes(1);
        });
    });
});
