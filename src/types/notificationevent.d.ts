export interface INotificationResponse {
    statusCode: number;
}

interface INotification {
    collectionType: string;
    date: string;
    ownerId: string;
    ownerType: string;
    subscriptionId: string;
}
