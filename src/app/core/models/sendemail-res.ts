

export interface SendemailRes {
    status: number;
    message: string;
    data: Data;
}

interface Data {
    _id: string;
}