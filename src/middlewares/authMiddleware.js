const { StatusCodes } = require('http-status-codes');

const { Logger } = require('../config/index');
const { BadRequestError, UnauthorizedError } = require('../errors/index');
const { UserService } = require('../services/index');
const { UserRepository, RoleRepository } = require('../repositories/index');

const userService = new UserService(new UserRepository(), new RoleRepository());

function validateAuthRequest(req, res, next) {
    if(!req.body.username) {
        Logger.error("Bad request made while authenticating user");
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "User not logged in",
            error: new BadRequestError("username", "Username not present in the incoming request."),
            data: {}
        });
    }

    if(!req.body.email) {
        Logger.error("Bad request made while authenticating user");
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "User not logged in",
            error: new BadRequestError("email", "Email not present in the incoming request."),
            data: {}
        });
    }

    if(!req.body.password) {
        Logger.error("Bad request made while authenticating user");
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "User not logged in",
            error: new BadRequestError("password", "Password not present in the incoming request."),
            data: {}
        });
    }
    next();
} 

async function checkAuth(req, res, next) {
    try {
        const response = await userService.isAuthenticated(req.headers['x-access-token']);
        if(response) {
            req.user = response;
            next();
        } 
    } catch (error) {
        Logger.error('Error occured while authenticating the JWT token')
        return res.status(error.statusCode).json({
            success: false,
            message: 'User not authenticated',
            error: error,
            data: {}
        });
    }
}

async function isAdmin(req, res, next) {
    const response = await userService.isAdmin(req.user);

    if(!response) {
        Logger.error("User not authorized for this action");
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'User is not authorized to perform this action',
            error: new UnauthorizedError("The user doesn't have admin role for performing this action"),
            data: {}
        });
    }
    next();
}

module.exports = {
    validateAuthRequest,
    checkAuth,
    isAdmin
}