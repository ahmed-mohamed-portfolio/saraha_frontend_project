

export interface PassChangedRes {
    status: number;
    message: string;
    data: Data;
}

interface Data {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    provider: string;
    role: string;
    shareProfileName: string;
    profilePicture: string;
    isVerfied: boolean;
    credentialsUpdatedAt: string;
    __v: number;
}