import dotenv from 'dotenv';
dotenv.config();

class ApiResponse {
    constructor(statusCode, data, message = process.env.DEFAULT_SUCCESS_MESSAGE || "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export default ApiResponse;