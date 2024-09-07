// backend/utils/ApiError.js

class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static badRequest(message = "Bad Request", errors = []) {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message = "Unauthorized", errors = []) {
        return new ApiError(401, message, errors);
    }

    static forbidden(message = "Forbidden", errors = []) {
        return new ApiError(403, message, errors);
    }

    static notFound(message = "Not Found", errors = []) {
        return new ApiError(404, message, errors);
    }

    static internalError(message = "Internal Server Error", errors = []) {
        return new ApiError(500, message, errors);
    }
}

module.exports = ApiError;