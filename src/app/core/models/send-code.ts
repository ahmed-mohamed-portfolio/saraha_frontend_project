
export interface SendCode {
    userId: string;
    code: Code;
}

interface Code {
    resetCode: string;
}