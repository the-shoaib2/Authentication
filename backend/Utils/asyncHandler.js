// backend / utils / asyncHandler.js

/**
 * A higher-order function that wraps an asynchronous request handler.
 * This function catches any errors that occur during the execution of the request handler
 * and passes them to the next middleware in the stack.
 *
 * @param {Function} requestHandler - The asynchronous request handler function to wrap.
 * @returns {Function} - A new function that takes req, res, and next as parameters.
 */
export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export default asyncHandler;
