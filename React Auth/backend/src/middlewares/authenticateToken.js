import jwt from "jsonwebtoken";
import { sendRes } from "../utils/responseHelpers.js";
import { User } from "../models/user.model.js";
import { consoleError } from "../utils/comman.utils.js";

/**
 * Middleware to authenticate a JSON Web Token (JWT) from cookies.
 * If the token is valid, attaches the decoded user information to the `req` object and proceeds to the next middleware. Otherwise, sends an appropriate error response.
 *
 * @function authenticateToken
 *
 * @returns {void} Sends a response with an error if the token is missing or invalid, or calls `next()` on success.
 */
export const authenticateToken = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) return sendRes(res, 202, "Unaurthorized - No token provided."); // Unauthorized

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, userInfo) => {
            if (err) return sendRes(res, 403, "Unaurthorized - Invalid token."); // Forbidden

            const { userId } = userInfo;

            const user = await User.findById(userId);

            if (!user) return sendRes(res, 400, "No user found.");
            req.user = user;

            next();
        })
    } catch (error) {
        consoleError("authenticateToken (authenticateToken.js)", error);

        return sendRes(res, 500, "Something went wrong on our side. Please try again later.")
    }
}