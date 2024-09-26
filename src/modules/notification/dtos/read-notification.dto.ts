import { Expose } from "class-transformer";

export class ReadNotificationDto {
    @Expose()
    user_id: number;

    @Expose()
    message: string;

    @Expose()
    read: boolean;
    
    @Expose()
    record_id: number;
}