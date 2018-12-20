import { Callback, Context, Handler } from 'aws-lambda';
import { INotification, INotificationResponse, INotificationStorage } from '../types';
import { NotificationStorage } from '../utils/notificationstorage';

console.log('Loading function');

const create: Handler = (event: any, context: Context, callback: Callback) => {
    const response: INotificationResponse = {
        statusCode: 204
    };

    const notifications: INotification[] = JSON.parse(event.body) as INotification[];
    const notificationStorage: INotificationStorage = new NotificationStorage();

    notificationStorage.saveToDynamoDb(notifications)
        .catch((error) => {
            console.error(`Error while saving Notifications to DynamoDB: ${error}`);
            callback(undefined, response);
        })
        .then((data) => {
            console.debug(`Notifications saved successfully to DynamoDB: ${JSON.stringify(data)}`);
            callback(undefined, response);
        });
};

export { create };
