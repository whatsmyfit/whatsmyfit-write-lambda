import { Callback, Context, Handler } from 'aws-lambda';
import { INotificationRequest, INotificationResponse, INotificationStorage } from '../types';
import { NotificationStorage } from '../utils/notificationstorage';

console.log('Loading function');

const create: Handler = (event: any, context: Context, callback: Callback) => {
    const response: INotificationResponse = {
        statusCode: 204
    };

    const requestBody: INotificationRequest = event.body as INotificationRequest;
    const notificationStorage: INotificationStorage = new NotificationStorage();
    notificationStorage.saveToDynamoDb(requestBody.notifications)
        .catch((error) => {
            console.error(`Error while saving Notifications to DynamoDB: ${error}`);
            callback(undefined, response);
        })
        .then((data) => {
            console.debug(`Notifications saved successfully to DynamoDB: ${data}`);
            callback(undefined, response);
        });
};

export { create };
