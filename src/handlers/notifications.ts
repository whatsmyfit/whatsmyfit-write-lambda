import { Callback, Context, Handler } from 'aws-lambda';
import * as HttpStatus from 'http-status-codes';
import { INotification, INotificationResponse, INotificationStorage } from '../types';
import { NotificationStorage } from '../utils/notificationstorage';

console.log('Loading function');

const create: Handler = (event: any, context: Context, callback: Callback) => {
    const response: INotificationResponse = {
        statusCode: HttpStatus.NO_CONTENT
    };

    const notifications: INotification[] = JSON.parse(event.body) as INotification[];
    const notificationStorage: INotificationStorage = new NotificationStorage();

    notificationStorage.saveToDynamoDb(notifications)
        .then((data) => {
            console.debug(`Notifications saved successfully to DynamoDB: ${JSON.stringify(data)}`);
            callback(undefined, response);
        })
        .catch((error) => {
            console.error(`Error while saving Notifications to DynamoDB: ${error}`);
            callback(undefined, response);
        });
};

export { create };
