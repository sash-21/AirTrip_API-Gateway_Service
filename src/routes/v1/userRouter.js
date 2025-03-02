const express = require('express');

const { UserController } = require('../../controllers/index');
const { AuthMiddleware } = require('../../middlewares/index');

const userRouter = express.Router();

userRouter.post('/signup', AuthMiddleware.validateAuthRequest, UserController.signUp);

userRouter.post('/login', AuthMiddleware.validateAuthRequest, UserController.logIn);

userRouter.post('/role', AuthMiddleware.checkAuth, AuthMiddleware.isAdmin, UserController.addRoletoUser);

module.exports = userRouter;