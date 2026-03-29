
export interface LoginRes {
    status: number;
    message: string;
    data: Data;
}

interface Data {
    existUser: ExistUser;
    accessToken: string;
}

interface ExistUser {
    _id: string;
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
    __v: number;
}