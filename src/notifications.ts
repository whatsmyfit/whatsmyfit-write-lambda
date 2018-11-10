import { Callback, Context, Handler } from 'aws-lambda';

interface INotificationResponse {
    statusCode: number;
}

interface INotificationRequest {
    notifications: INotification[];
}

interface INotification {
    collectionType: string;
    date: string;
    ownerId: string;
    ownerType: string;
    subscriptionId: string;

}

const create: Handler = (event: any, context: Context, callback: Callback) => {
    const response: INotificationResponse = {
        statusCode: 204
    };

    const notificationArray: INotificationRequest = event.body as INotificationRequest;
    console.log(notificationArray);

    callback(undefined, response);
};

export { create };
