import { AWSError } from 'aws-sdk';
import { BatchWriteItemOutput } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { INotificationEvent } from './notification';
import { INotification } from './notificationevent';

interface INotificationStorage {
    saveToDynamoDb(notifications: INotification[]): Promise<PromiseResult<BatchWriteItemOutput, AWSError>>;
}

export interface INotificationStorageRequest {
    RequestItems: IRequestItems;
}

interface IRequestItems {
    [tableName: string]: IPutRequest[] | [];
}

interface IPutRequest {
    Item: INotificationEvent;
}
