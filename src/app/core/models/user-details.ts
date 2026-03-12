

interface UserDetails {
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
    __v: number;
}