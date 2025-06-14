import bcryptjs from "bcryptjs";
// MODELS
import { User } from "../models/user.model.js";
// UTILS
import {
    validateResetUserPasswordInfo,
} from "../utils/user.utils.js";
import { sendRes } from "../utils/responseHelper.js";
import { authMessages, generateTokenAndSetCookie, handleExistedUserSignUp, validateLoginUserInfo, validateSignUpUserInfo, validateVerifyEmailInfo } from "../utils/auth.utils.js";
import { getExpiryTime, generateVerificationCode, logError, demoAccounts, validateEmailFormat, } from "../utils/comman.utils.js";
import { sendEmailResetPassLink, sendEmailVerificationCode } from "../utils/emails/sendEmails.js";

// LOGIN USER
export const loginUser = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        // VALIDATE RECIEVED INFORMATION
        const result = validateLoginUserInfo(userEmail, userPassword);
        if (!result.isvalid) return sendRes(res, 422, result.message);

        // IS USER EXISTS
        const user = await User.findOne({ userEmail })
            .select("-isUserVerified -emailVerificationCode -verificationCodeExpiresAt -resetPassToken -resetPassTokenExpiresAt");
        if (!user) return sendRes(res, 400, "No account is associated with the provided email address.");

        // CHECK PASSWORD
        const isMatched = await user.comparePassword(userPassword);
        if (!isMatched) return sendRes(res, 400, "The password entered is incorrect.");

        // GENERATE JWT AND SET IN COOKIES
        generateTokenAndSetCookie(res, user._id);

        // EXCLUDE PASSWORD BEFORE SENDING TO FRONTEND
        const userObject = user.toObject();
        delete userObject.userPassword;

        // SEND SUCCESS RESPONSE WITH USER DETAILS
        return sendRes(res, 200, "Login successful. Welcome back!", userObject);
    }
    catch (error) {
        logError("loginUser", error); // LOG ERROR
        return sendRes(res, 500, "Something went wrong on our side. Please try again later."); //SEND ERROR RESPONSE
    }
}

// FOR TESTING AND DUMMAY DATA PURPOSE
export const signupUser2 = async (req, res) => {
    try {
        const { userEmail, userPassword, userConfirmPassword } = req.body;
        const emailVerificationCode = generateVerificationCode();
        await User.create({
            userEmail,
            userPassword,
            emailVerificationCode,
            isUserVerified: true,
            verificationCodeExpiresAt: getExpiryTime(30),
        })
        return sendRes(res, 200, "User Created");
    }
    catch (error) {
        logError("signupUser2", error);
        return sendRes(res, 500, "Something went wrong on our side. Please! try again.");
    }
}

// SIGNUP NEW USER
export const signupUser = async (req, res) => {
    try {
        const { userEmail, userPassword, userConfirmPassword } = req.body;

        // VALIDATE RECIEVED INFORMATION
        const result = validateSignUpUserInfo(userEmail, userPassword, userConfirmPassword);
        if (!result.isvalid) return sendRes(res, 422, result.message);

        // DOES USER ALREADY EXISTS
        const existedUser = await User.findOne({ userEmail });

        if (existedUser) { // HANDLE CASE IF USER ALREADY EXIST
            const isEmailVerified = await handleExistedUserSignUp(existedUser, userPassword);
            if (isEmailVerified) return sendRes(res, 400, "An account with this email already exists.");
            return sendRes(res, 202, "Verification code has been sent to your email.");
        }

        const emailVerificationCode = generateVerificationCode(); // GENERATE VERIFICATION CODE
        await User.create({ // CREATE NEW USER
            userEmail,
            userPassword,
            emailVerificationCode,
            verificationCodeExpiresAt: getExpiryTime(30), // GET EXPIRY TIME
        })

        await sendEmailVerificationCode(userEmail, emailVerificationCode); // SEND EMAIL WITH VERIFICATION CODE
        return sendRes(res, 200, "Registration is almost complete. Please verify your email to proceed."); // SEND SUCCESS RESPONSE
    }
    catch (error) {
        logError("signupUser (auth controllers)", error); // LOG ERROR
        return sendRes(res, 500, "Something went wrong on our side. Please try again later."); // SEND ERROR RESPONSE
    }
}

// VERIFY USER EMAIL
export const verifyUserEmail = async (req, res) => {
    try {
        const { userEmail, emailVerificationCode } = req.body;

        const result = validateVerifyEmailInfo(userEmail, emailVerificationCode); // VALIDATE INFORMATION
        if (!result.isvalid) return sendRes(res, 422, result.message);

        let user = await User.findOne({ userEmail }); // FIND USER
        if (!user) return sendRes(res, 400, "No account is associated with the provided email address.");

        if (Date.now() > user.verificationCodeExpiresAt) // CHECK FOR EXPIRED VERIFICATION CODE
            return sendRes(res, 400, "Verification code has been sent to your email. Try Signingup Again.");

        const isMatched = await user.compareVerificationCode(emailVerificationCode); // COMPARE VERFICATION CODES
        if (!isMatched) return sendRes(res, 400, "The verification code entered is incorrect. Please try again.");

        user = await User.findOneAndUpdate( // UPDATE `isUserVerified` 
            { userEmail },
            { isUserVerified: true },
            { new: true, select: "-userPassword -isUserVerified -emailVerificationCode -verificationCodeExpiresAt -resetPassToken -resetPassTokenExpiresAt" } // REMOVE RISKY & UNWANTED FIELDS
        );

        generateTokenAndSetCookie(res, user._id); // SET JWT 
        return sendRes(res, 200, authMessages.EmailVerfied, user); // SEND SUCCESS RESPONSE WITH NEW CREATED USER
    }
    catch (error) {
        logError("verifyUserEmail", error); // LOG ERROR
        return sendRes(res, 500, "Something went wrong on our side. Please try again later."); // SEND ERROR RESPONSE
    }
}

// SEND RESET PASSWORD LINK
export const sendResetPassLink = async (req, res) => {
    try {
        const { userEmail } = req.body;

        if (!userEmail) return sendRes(res, 422, "User email is required."); // IS EMPTY EMAIL
        if (!validateEmailFormat(userEmail)) return sendRes(res, 422, "Invalid email format."); // IS EMAIL VALID

        if (demoAccounts.includes(userEmail)) // CHECK FOR DEMO ACCOUNTS
            return sendRes(res, 404, "This is a Demo account you can not reset its password.");

        const user = await User.findOne({ userEmail }); // CHECK IF ACCOUNT EXISTS
        if (!user) return sendRes(res, 400, "No account is associated with the provided email address.");

        const token = await bcryptjs.hash(userEmail, 10);
        const resetPassLink = `${process.env.FRONTEND_LINK}/reset-password?token=${token}`;

        sendEmailResetPassLink(userEmail, resetPassLink); // SEND EMAIL

        user.resetPassToken = token;
        user.resetPassTokenExpiresAt = getExpiryTime(60);
        await user.save();

        return sendRes(res, 200, "The link has been sent successfully. Kindly follow the provided link to reset your password."); // RETURN SUCCESS RESPONSE
    }
    catch (error) {
        logError("sendResetPassLink", error); // LOG ERROR
        return sendRes(res, 500, "Something went wrong on our side. Please try again later."); // RETURN ERROR RESPONSE
    }
}

export const resetUserPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmNewPassword } = req.body;

        const validationResult = validateResetUserPasswordInfo(token, newPassword, confirmNewPassword);
        if (!validationResult.isvalid) return sendRes(res, 422, validationResult.message);

        const user = await User.findOne({ resetPassToken: token });
        if (!user) return sendRes(res, 400, authMessages.UserNotFound);

        if (user.resetPassTokenExpiresAt < Date.now())
            return sendRes(res, 400, "Error! The link is expired.");

        user.userPassword = newPassword
        user.resetPassTokenExpiresAt = user.resetPassTokenExpiresAt - 61 * 60 * 1000;
        await user.save();

        return sendRes(res, 200, "Password reset successful.");
    }
    catch (error) {
        logError("resetUserPassword", error);
        return sendRes(res, 500, "Something went wrong on our side. Please try again later.");
    }
}

// LOGOUT USER
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token"); // CLEAR COOKIE
        return sendRes(res, 200, "Logout Successful."); // SEND SUCCESS RESPONSE
    }
    catch (error) {
        logError("logoutUser", error); // LOG ERROR
        return sendRes(res, 500, "Something went wrong on our side. Please try again later."); // SEND ERROR RESPONSE
    }
}

export const checkAuth = async (req, res) => {
    try {
        const { user } = req;
        return sendRes(res, 200, "User found.", user);
    }
    catch (error) {
        logError("checkAuth", error);
        return sendRes(res, 500, "Internal Server Error.");
    }
}

export const deleteUserById = async (req, res) => {
    try {
        const { _id: userId, userEmail } = req.user;

        const isDemoAccount = demoAccounts.includes(userEmail);
        if (isDemoAccount) return sendRes(res, 404, "This is a Demo account you can not delete it.");

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) return sendRes(res, 400, "No user found.");

        return sendRes(res, 200, "Account Deleted Successfully.");
    }
    catch (error) {
        logError("deleteUserById", error);
        return sendRes(res, 500, "Internal Server Error.")
    }
}