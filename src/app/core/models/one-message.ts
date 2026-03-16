

export interface OneMessage {
    status: number;
    message: string;
    data: Data;
}

interface Data {
    _id: string;
    message: string;
    receverId: string;
    __v: number;
}