import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "@/shared/types/express.types.js";
import { authService } from "../services/auth.service.js";
import { cookieConfig } from "@/config/security/cookie.config.js";


class AuthController {

    // =================
    // REGISTER
    // =================

    /**
     * Register a new user and create a new session.
     * 
     * @param req Request containing the user's registration data.
     * @param res Sends the registered user and tokens in the response.
     * @param next Express next middleware function for error handling.
     */

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await authService.registerUser(
                req.body,
                { userAgent: req.get("user-agent"), ipAddress: req.ip }
            );

            // set cookie
            res.cookie("refreshToken", result.tokens.refreshToken, cookieConfig.refreshTokenCookieOptions);

            // register response
            res.status(201).json({
                success: true,
                message: "Registration successful",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };


    // =================
    // LOGIN
    // =================

    /**
     * Authenticate a user and create a new session.
     * 
     * @param req Request containing the user's login credentials.
     * @param res Sends the authenticated user and tokens in the response.
     * @param next Express next middleware function for error handling.
     */

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await authService.loginUser(
                req.body,
                {
                    userAgent: req.get("user-agent"),
                    ipAddress: req.ip,
                }
            );
            // set cookie
            res.cookie("refreshToken", result.tokens.refreshToken, cookieConfig.refreshTokenCookieOptions);

            // login response
            res.status(200).json({
                success: true,
                message: "Login successful",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    // ===================
    // REFRESH TOKEN
    //====================

    /**
     * Refresh the access token using the stored refresh token.
     * 
     * @param req Request containing the refresh token cookie.
     * @param res Sends the newly generated access and refresh tokens in the response.
     * @param next Express next middleware function for error handling.
     */

    refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                res.status(401).json({
                    success: false,
                    message: "Refresh token missing"
                });
                return;
            }


            const tokens = await authService.refreshToken({ refreshToken });

            // set cookie
            res.cookie("refreshToken", tokens.refreshToken, cookieConfig.refreshTokenCookieOptions);

            // refresh response
            res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                data: tokens,
            });
        } catch (error) {
            next(error);
        }
    };

    // ====================
    // LOGOUT THIS DEVICE
    // ====================

    /**
     * Logout the currently authenticated user from the current device.
     * 
     * @param req Authenticated request containing the JWT payload.
     * @param res Sends the logout confirmation in the response.
     * @param next Express next middleware function for error handling.
     */

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const sessionId = authReq.user.sessionId;
            const result = await authService.logout(sessionId);

            // clear cookie
            res.clearCookie("refreshToken", cookieConfig.clearCookieOptions);

            // logout response
            res.status(200).json({
                success: true,
                message: "Logged out successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };


    // =======================
    // LOGOUT ALL DEVICES
    // =======================

    /**
     * Logout the user from all active devices.
     * 
     * @param req Authenticated request containing the JWT payload.
     * @param res Sends the logout confirmation in the response.
     * @param next Express next middleware function for error handling.
     */

    logoutAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user.userId;
            const result = await authService.logoutAllDevices(userId);

            // clear all cookies
            res.clearCookie("refreshToken", cookieConfig.clearCookieOptions);

            // response for logout all devices
            res.status(200).json({
                success: true,
                message: "Logged out from all devices",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    // ====================
    // CURRENT USER
    // ====================

    /**
     * Retrieve the profile of the currently authenticated user.
     * 
     * @param req Authenticated request containing the JWT payload.
     * @param res Sends the current user's profile in the response.
     * @param next Express next middleware function for error handling.
     */

    getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user.userId;
            const user = await authService.getCurrentUser(userId);
            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    };

}

export const authController = new AuthController();