

export interface OneMessage {
    status: number;
    message: string;
    data: Data;
}

interface Data {
    _id: string;
    message: string;
    image: string;
    receverId: string;
    __v: number;
}