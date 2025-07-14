export class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        // Menjaga stack trace agar tetap benar
        Error.captureStackTrace(this, this.constructor);
    }
}