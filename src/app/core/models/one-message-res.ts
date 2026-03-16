

export interface OneMessageRes {

    status: number;
    message: string;
    data: Data;
}

interface Data {
    message: string;
    image: string;
    receverId: string;
    _id: string;
    __v: number;
}