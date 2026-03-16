

export interface RegisterRes {
    status: number;
    message: string;
    data: Data;
}

interface Data {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    provider: string;
    role: string;
    shareProfileName: string;
    _id: string;
    __v: number;
}