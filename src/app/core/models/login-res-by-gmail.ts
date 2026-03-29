


interface LoginResByGmail {
    status: number;
    message: string;
    data: Data;
}

interface Data {
    user: User;
    accessToken: string;
}

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    provider: string;
    role: string;
    profilePicture: string;
    confireEmail: string;
    __v: number;
}