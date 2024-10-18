import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/**
 * @description Retrieves all cookies from the request and returns them in the response.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves to void.
 */
const getCookies = asyncHandler(async (req, res) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, { cookies: req.cookies }, "Cookies returned"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to retrieve cookies"));
  }
});

/**
 * @description Sets cookies based on the provided cookie object in the request body.
 * @param {import("express").Request} req - The request object containing the cookie data.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves to void.
 */
const setCookie = asyncHandler(async (req, res) => {
  try {
    const cookieObject = req.body;

    if (!cookieObject || typeof cookieObject !== 'object') {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid cookie data provided"));
    }

    Object.entries(cookieObject).forEach(([key, value]) => {
      res.cookie(key, value);
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { cookies: { ...req.cookies, ...cookieObject } },
          "Cookies have been set"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to set cookies"));
  }
});

/**
 * @description Removes a cookie specified by the cookie key in the query parameters.
 * @param {import("express").Request} req - The request object containing the cookie key.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves to void.
 */
const removeCookie = asyncHandler(async (req, res) => {
  try {
    const { cookieKey } = req.query;

    if (!cookieKey) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Cookie key is required"));
    }

    res.clearCookie(cookieKey);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { cookies: { ...req.cookies, [cookieKey]: undefined } },
          "Cookie has been cleared"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to clear cookie"));
  }
});

export { getCookies, setCookie, removeCookie };
