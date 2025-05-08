
import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AuthService } from "./auth.service";


const  register = catchAsync(async (req: Request, res: Response) => {

const result = await AuthService.register(req.body)

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: {
      user: result,
    },
})

})

const  getAllUsers = catchAsync(async (req: Request, res: Response) => {

const result = await AuthService.getAllUsers()

  res.status(201).json({
    status: "success",
    message: "get all users successfully",
    data: {
      user: result,
    },
})

})
const  getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

const result = await AuthService.getSingleUser(id)

  res.status(201).json({
    status: "success",
    message: "get single user successfully",
    data: {
      user: result,
    },
})

})

  export const AuthController = {
    register,
    getAllUsers, 
    getSingleUser
  }





