


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
    shareProfileName: string;
    profilePicture: string;
    __v: number;
}