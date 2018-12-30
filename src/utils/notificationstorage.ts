import { AWSError, DynamoDB } from 'aws-sdk';
import { BatchWriteItemOutput } from 'aws-sdk/clients/dynamodb';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { PromiseResult } from 'aws-sdk/lib/request';
import * as uuid from 'uuid';
import { EventStatus } from '../enums/notificationeventstatus';
import { INotification, INotificationEvent, INotificationStorage, INotificationStorageRequest, IPutRequest, IRequestItems } from '../types';
import BatchWriteItemInput = DocumentClient.BatchWriteItemInput;

class NotificationStorage implements INotificationStorage {

    public saveToDynamoDb(notifications: INotification[]): Promise<PromiseResult<BatchWriteItemOutput, AWSError>> {
        const putRequest: INotificationStorageRequest = this.createPutRequest(notifications);

        if (Object.keys(putRequest.RequestItems).length > 0) {
            const documentClient: AWS.DynamoDB.Types.DocumentClient = this.createDynamoDbClient();
            return documentClient.batchWrite(putRequest as BatchWriteItemInput).promise();
        } else {
            return Promise.reject('Array of notifications where empty');
        }
    }

    /**
     * Creates PutRequest JSON-object for storing array of INotificationEvent to DynamoDB.
     * If 'notifications' param is empty PutRequest.Item will be empty in response
     *
     * @param notifications array of INotification
     * @param tableName optional name of the table, defaults to env variable DYNAMODB_TABLE or 'notifications' if env variable not set
     */
    public createPutRequest(notifications: INotification[], tableName?: string): INotificationStorageRequest {
        if (!Array.isArray(notifications) || notifications.length === 0) {
            return {RequestItems: {}};
        }

        tableName = tableName || process.env.DYNAMODB_TABLE || 'notifications';
        const notificationEvents: INotificationEvent[] = this.convertToEvents(notifications);
        const putRequests: IPutRequest[] = [];

        for (const notificationEvent of notificationEvents) {
            const putRequest: IPutRequest = {
                PutRequest: {
                    Item: notificationEvent
                }
            };
            putRequests.push(putRequest);
        }

        const requestItem: IRequestItems = {};
        requestItem[tableName] = putRequests;

        return {
            RequestItems: requestItem
        };
    }

    /**
     * Converts INotification to INotificationEvent, return empty array if 'notifications' param is empty
     *
     * @param notifications array of INotification
     */
    public convertToEvents(notifications: INotification[]): INotificationEvent[] {
        const notificationEventArray: INotificationEvent[] = [];

        for (const notification of notifications) {
            const notificationEvent: INotificationEvent = {
                id: uuid.v1(),
                status: EventStatus.CREATED,
                createdAt: new Date().getTime(),
                collectionType: notification.collectionType,
                date: notification.date,
                ownerId: notification.ownerId,
                ownerType: notification.ownerType,
                subscriptionId: notification.subscriptionId
            };

            notificationEventArray.push(notificationEvent);
        }

        return notificationEventArray;
    }

    /**
     * Used to create DynamoDB client pointing to local db when running with serverless offline, and using online version otherwise
     */
    private createDynamoDbClient(): DynamoDB.DocumentClient {
        const dynamodbOfflineOptions = {
            region: 'localhost',
            endpoint: 'http://localhost:8000',
            accessKeyId: 'MOCK_ACCESS_KEY_ID',
            secretAccessKey: 'MOCK_SECRET_ACCESS_KEY'
        };

        // Env variable IS_OFFLINE is automatically set to TRUE by serverless-offline, otherwise it will be false
        const isOffline = () => process.env.IS_OFFLINE;

        return isOffline() ? new DynamoDB.DocumentClient(dynamodbOfflineOptions) : new DynamoDB.DocumentClient();
    }
}

export { NotificationStorage };
