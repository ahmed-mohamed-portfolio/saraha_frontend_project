

export interface Messages {
    status: number;
    message: string;
    data: Datum[];
}

interface Datum {
    _id: string;
    message: string;
    image?: string;
}