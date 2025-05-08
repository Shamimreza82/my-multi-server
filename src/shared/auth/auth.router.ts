import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/register",  AuthController.register);
router.get("/users",  AuthController.getAllUsers);
router.get("/users/:id",  AuthController.getSingleUser);




export const Authrouter = router;