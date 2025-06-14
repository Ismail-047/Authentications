// MODELS
import { User } from "../models/user.model.js";
// UTILS
import { generateTokenAndSetCookie, generateVerificationCode, getExpiryTime } from "../utils/auth.utils.js";
import { consoleError } from "../utils/comman.utils.js";
import EmailService from "../services/email.service.js";
import { sendRes } from "../utils/responseHelpers.js";

export const checkAuth = async (req, res) => {
    try {
        const { user } = req;
        return sendRes(res, 200, "User found.", user);
    }
    catch (error) {
        consoleError("checkAuth (auth.controllers.js)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please try again later.");
    }
}

// SIGNUP NEW USER
export const signupUser = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword) return sendRes(res, 422, "All fields are required.");
        if (password !== confirmPassword) return sendRes(res, 422, "Passwords do not match.");

        const existedUser = await User.findOne({ email });

        if (existedUser) {
            if (existedUser.isVerified) return sendRes(res, 400, "An account with this email already exists.")
            else {
                const emailVerificationCode = generateVerificationCode();
                const updatedUser = await User.findOneAndUpdate(
                    { email },
                    { emailVerificationCode, verificationCodeExpiresAt: getExpiryTime(30) },
                    { new: true }
                );
                await EmailService.sendVerificationCode(email, emailVerificationCode);
                return sendRes(res, 200, "Verification code has been sent to your email.", updatedUser);
            }
        }

        const emailVerificationCode = generateVerificationCode();

        await User.create({
            email,
            password,
            emailVerificationCode,
            verificationCodeExpiresAt: getExpiryTime(30)
        });

        await EmailService.sendVerificationCode(email, emailVerificationCode);
        return sendRes(res, 200, "Registration is almost complete. Please verify your email to proceed.");
    }
    catch (error) {
        consoleError("signupUser (auth controllers)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please try again later.");
    }
}

// LOGIN USER
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.query;
        if (!email || !password) return sendRes(res, 422, "All fields are required.");

        const user = await User.findOne({ email })
            .select("-isUserVerified -emailVerificationCode -verificationCodeExpiresAt -resetPassToken -resetPassTokenExpiresAt");
        if (!user) return sendRes(res, 400, "No account is associated with the provided email address.");

        const isMatched = await user.comparePassword(password);
        if (!isMatched) return sendRes(res, 400, "The password entered is incorrect.");

        generateTokenAndSetCookie(res, user._id);

        const userObject = user.toObject();
        delete userObject.password;

        return sendRes(res, 200, "Login successful. Welcome back!", userObject);
    }
    catch (error) {
        consoleError("loginUser (auth controllers)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please try again later.");
    }
}

// // FOR TESTING AND DUMMAY DATA PURPOSE
// export const signupUser2 = async (req, res) => {
//     try {
//         const { userEmail, userPassword, userConfirmPassword } = req.body;
//         const emailVerificationCode = generateVerificationCode();
//         await User.create({
//             userEmail,
//             userPassword,
//             emailVerificationCode,
//             isUserVerified: true,
//             verificationCodeExpiresAt: getExpiryTime(30),
//         })
//         return sendRes(res, 200, "User Created");
//     }
//     catch (error) {
//         logError("signupUser2", error);
//         return sendRes(res, 500, "Something went wrong on our side. Please! try again.");
//     }
// }



// // VERIFY USER EMAIL
// export const verifyUserEmail = async (req, res) => {
//     try {
//         const { userEmail, emailVerificationCode } = req.body;

//         const result = validateVerifyEmailInfo(userEmail, emailVerificationCode); // VALIDATE INFORMATION
//         if (!result.isvalid) return sendRes(res, 422, result.message);

//         let user = await User.findOne({ userEmail }); // FIND USER
//         if (!user) return sendRes(res, 400, "No account is associated with the provided email address.");

//         if (Date.now() > user.verificationCodeExpiresAt) // CHECK FOR EXPIRED VERIFICATION CODE
//             return sendRes(res, 400, "Verification code has been sent to your email. Try Signingup Again.");

//         const isMatched = await user.compareVerificationCode(emailVerificationCode); // COMPARE VERFICATION CODES
//         if (!isMatched) return sendRes(res, 400, "The verification code entered is incorrect. Please try again.");

//         user = await User.findOneAndUpdate( // UPDATE `isUserVerified` 
//             { userEmail },
//             { isUserVerified: true },
//             { new: true, select: "-userPassword -isUserVerified -emailVerificationCode -verificationCodeExpiresAt -resetPassToken -resetPassTokenExpiresAt" } // REMOVE RISKY & UNWANTED FIELDS
//         );

//         generateTokenAndSetCookie(res, user._id); // SET JWT 
//         return sendRes(res, 200, authMessages.EmailVerfied, user); // SEND SUCCESS RESPONSE WITH NEW CREATED USER
//     }
//     catch (error) {
//         logError("verifyUserEmail", error); // LOG ERROR
//         return sendRes(res, 500, "Something went wrong on our side. Please try again later."); // SEND ERROR RESPONSE
//     }
// }

// // SEND RESET PASSWORD LINK
// export const sendResetPassLink = async (req, res) => {
//     try {
//         const { userEmail } = req.body;

//         if (!userEmail) return sendRes(res, 422, "User email is required."); // IS EMPTY EMAIL
//         if (!validateEmailFormat(userEmail)) return sendRes(res, 422, "Invalid email format."); // IS EMAIL VALID

//         if (demoAccounts.includes(userEmail)) // CHECK FOR DEMO ACCOUNTS
//             return sendRes(res, 404, "This is a Demo account you can not reset its password.");

//         const user = await User.findOne({ userEmail }); // CHECK IF ACCOUNT EXISTS
//         if (!user) return sendRes(res, 400, "No account is associated with the provided email address.");

//         const token = await bcryptjs.hash(userEmail, 10);
//         const resetPassLink = `${process.env.FRONTEND_LINK}/reset-password?token=${token}`;

//         sendEmailResetPassLink(userEmail, resetPassLink); // SEND EMAIL

//         user.resetPassToken = token;
//         user.resetPassTokenExpiresAt = getExpiryTime(60);
//         await user.save();

//         return sendRes(res, 200, "The link has been sent successfully. Kindly follow the provided link to reset your password."); // RETURN SUCCESS RESPONSE
//     }
//     catch (error) {
//         logError("sendResetPassLink", error); // LOG ERROR
//         return sendRes(res, 500, "Something went wrong on our side. Please try again later."); // RETURN ERROR RESPONSE
//     }
// }

// export const resetUserPassword = async (req, res) => {
//     try {
//         const { token, newPassword, confirmNewPassword } = req.body;

//         const validationResult = validateResetUserPasswordInfo(token, newPassword, confirmNewPassword);
//         if (!validationResult.isvalid) return sendRes(res, 422, validationResult.message);

//         const user = await User.findOne({ resetPassToken: token });
//         if (!user) return sendRes(res, 400, authMessages.UserNotFound);

//         if (user.resetPassTokenExpiresAt < Date.now())
//             return sendRes(res, 400, "Error! The link is expired.");

//         user.userPassword = newPassword
//         user.resetPassTokenExpiresAt = user.resetPassTokenExpiresAt - 61 * 60 * 1000;
//         await user.save();

//         return sendRes(res, 200, "Password reset successful.");
//     }
//     catch (error) {
//         logError("resetUserPassword", error);
//         return sendRes(res, 500, "Something went wrong on our side. Please try again later.");
//     }
// }



// export const deleteUserById = async (req, res) => {
//     try {
//         const { _id: userId, userEmail } = req.user;

//         const isDemoAccount = demoAccounts.includes(userEmail);
//         if (isDemoAccount) return sendRes(res, 404, "This is a Demo account you can not delete it.");

//         const deletedUser = await User.findByIdAndDelete(userId);
//         if (!deletedUser) return sendRes(res, 400, "No user found.");

//         return sendRes(res, 200, "Account Deleted Successfully.");
//     }
//     catch (error) {
//         logError("deleteUserById", error);
//         return sendRes(res, 500, "Internal Server Error.")
//     }
// }

export const loginWithGoogle = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return sendRes(res, 422, "Email is required.");

        const existedUser = await User.findOne({ email });
        if (!existedUser) return sendRes(res, 404, "No account found. Try Signing up.");

        generateTokenAndSetCookie(res, existedUser._id);
        return sendRes(res, 200, "Login Successfull.", existedUser);
    }
    catch (error) {
        consoleError("loginWithGoogle (auth.controllers.js)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please! try again.");
    }
}

export const signupWithGoogle = async (req, res) => {
    try {
        const { email, name, picture, phoneNumber } = req.body;
        if (!email) return sendRes(res, 422, "Email is required.");

        const existedUser = await User.findOne({ email });
        if (existedUser) return sendRes(res, 400, "An account with this email already exists.");

        const newUser = await User.create({
            email, name, picture, phoneNumber, isVerified: true,
        });

        generateTokenAndSetCookie(res, newUser._id);
        return sendRes(res, 200, "Signup Successfull.", newUser);
    }
    catch (error) {
        consoleError("signupWithGoogle (auth.controllers.js)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please! try again.");
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
        return sendRes(res, 200, "Logout Successful.");
    }
    catch (error) {
        consoleError("logoutUser (auth.controllers.js)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please try again later.");
    }
}