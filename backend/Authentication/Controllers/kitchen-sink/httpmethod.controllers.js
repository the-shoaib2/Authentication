import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/**
 * @description Constructs a payload containing request method details.
 * @param {import("express").Request} req - The request object.
 * @returns {{method: string, headers: object, origin: string, url: string}} The request method payload.
 */
const getRequestMethodPayload = (req) => {
  return {
    method: req.method,
    headers: req.headers,
    origin: req.socket.localAddress,
    url: req.protocol + "://" + req.headers.host + req.originalUrl,
  };
};

/**
 * @description Handles GET requests and returns the request method details.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves to void.
 */
const getRequest = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, getRequestMethodPayload(req), "GET"));
});

/**
 * @description Handles POST requests and returns the request method details.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves to void.
 */
const postRequest = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, getRequestMethodPayload(req), "POST"));
});

/**
 * @description Handles PUT requests and returns the request method details.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves to void.
 */
const putRequest = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, getRequestMethodPayload(req), "PUT"));
});

/**
 * @description Handles PATCH requests and returns the request method details.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves to void.
 */
const patchRequest = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, getRequestMethodPayload(req), "PATCH"));
});

/**
 * @description Handles DELETE requests and returns the request method details.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves to void.
 */
const deleteRequest = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, getRequestMethodPayload(req), "DELETE"));
});

export { getRequest, postRequest, putRequest, patchRequest, deleteRequest };
