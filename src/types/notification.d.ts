import { EventStatus } from '../enums/notificationeventstatus';

export interface INotificationEvent {
    id: string;
    createdAt: number;
    status: EventStatus;
    collectionType: string;
    date: string;
    ownerId: string;
    ownerType: string;
    subscriptionId: string;
}
