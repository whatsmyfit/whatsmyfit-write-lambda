import { EventStatus } from '../../../src/enums/notificationeventstatus';
import { INotification, INotificationEvent, INotificationStorageRequest, IPutRequest } from '../../../src/types';
import { NotificationStorage } from '../../../src/utils/notificationstorage';

describe('saveToDynamoDb()', () => {
    let notificationStorage: NotificationStorage;
    let notifications: INotification[];
    const AWSMock = require('aws-sdk-mock');

    beforeAll(() => {
        notifications = [
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
        const AWS = require('aws-sdk');
        AWSMock.setSDKInstance(AWS);
        notificationStorage = new NotificationStorage();
    });

    test('should return call batchWrite and return resolve-promise given none empty array as input', () => {

        const mock = {
            handleCallback: (callback: any) => {
                callback(null, 'test');
            }
        };

        AWSMock.mock('DynamoDB.DocumentClient', 'batchWrite', (params: any, callback: any) => {
            mock.handleCallback(callback);
        });

        const spy = jest.spyOn(mock, 'handleCallback');

        expect(notificationStorage.saveToDynamoDb(notifications)).resolves.toBe('test');

        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);

        AWSMock.restore();
    });

    test('should not call batchWrite and return reject-promise given empty array as input', () => {
        const mock = {
            handleCallback: (callback: any) => {
                callback(null, 'test');
            }
        };

        AWSMock.mock('DynamoDB.DocumentClient', 'batchWrite', (params: any, callback: any) => {
            mock.handleCallback(callback);
        });

        const spy = jest.spyOn(mock, 'handleCallback');
        expect(notificationStorage.saveToDynamoDb([])).rejects.toBe('Array of notifications where empty');
        expect(spy).not.toHaveBeenCalled();

        AWSMock.restore();
    });
});

describe('createPutRequest()', () => {
    let notifications: INotification[];
    let tableName = 'notifications-test';
    let notificationStorage: NotificationStorage;

    beforeAll(() => {
        notifications = [
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
        tableName = 'notifications-test';
        notificationStorage = new NotificationStorage();
    });

    afterEach(() => {
        process.env.DYNAMODB_TABLE = '';
    });

    test('returns empty RequestItems given empty array of NotificationEvents in input', () => {
        const requestItems: INotificationStorageRequest = notificationStorage.createPutRequest([], tableName);

        expect(requestItems.RequestItems).toEqual({});
    });

    test('returns RequestsItems given array in input', () => {
        const requestItems: INotificationStorageRequest = notificationStorage.createPutRequest(notifications, tableName);

        expect(requestItems.RequestItems.hasOwnProperty(tableName)).toBeTruthy();
        expect(requestItems.RequestItems[tableName]).toHaveLength(3);
    });

    test('returns RequestsItems according to DynamoDB batchwrite format', () => {
        const requestItems: INotificationStorageRequest = notificationStorage.createPutRequest(notifications, tableName);
        expect(requestItems.RequestItems.hasOwnProperty(tableName)).toBeTruthy();

        const putRequests: IPutRequest[] = requestItems.RequestItems[tableName];
        const notification: INotification = notifications[0];
        const notificationEvent: INotificationEvent = putRequests[0].PutRequest.Item;

        expect(notificationEvent.collectionType).toEqual(notification.collectionType);
        expect(notificationEvent.subscriptionId).toEqual(notification.subscriptionId);
        expect(notificationEvent.ownerType).toEqual(notification.ownerType);
        expect(notificationEvent.ownerId).toEqual(notification.ownerId);
        expect(notificationEvent.date).toEqual(notification.date);
        expect(notificationEvent.createdAt).not.toBeNull();
        expect(notificationEvent.status).toEqual(EventStatus.CREATED);
    });

    test('uses env variable for table name given not sent as input param', () => {
        const envTableName = 'notifications-env-var';
        process.env.DYNAMODB_TABLE = envTableName;
        const requestItems = notificationStorage.createPutRequest(notifications);

        expect(requestItems.RequestItems.hasOwnProperty(envTableName)).toBeTruthy();
    });

    test('uses default table name given not sent as input param', () => {
        const defaultTableName = 'notifications';
        const requestItems = notificationStorage.createPutRequest(notifications);

        expect(requestItems.RequestItems.hasOwnProperty(defaultTableName)).toBeTruthy();
    });
});
