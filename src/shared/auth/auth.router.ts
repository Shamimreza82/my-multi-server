import { auth } from '../middlewares/auth';
import { AuthController } from './auth.controller';
import express from "express";


const router = express.Router();

router.post("/register",  AuthController.register);
router.post("/login",  AuthController.login);
router.get("/users", auth('USER'),  AuthController.getAllUsers);
router.get("/users/:id",  AuthController.getSingleUser);




export const Authrouter = router;



