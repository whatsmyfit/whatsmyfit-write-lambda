export interface INotificationResponse {
    statusCode: number;
}

export interface INotificationRequest {
    notifications: INotification[];
}

interface INotification {
    collectionType: string;
    date: string;
    ownerId: string;
    ownerType: string;
    subscriptionId: string;
}
