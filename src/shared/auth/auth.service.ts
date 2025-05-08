import { prisma } from "../config/db"
import { TUser } from "../utils/types"


const register = async (payload: TUser) => {

    const result = await prisma.user.create({
        data: {
            ...payload    
        }
    })
    return result

}
const getAllUsers = async () => {

    const result = await prisma.user.findMany()
    return result

}

const getSingleUser = async (id: string) => {

    const result = await prisma.user.findUnique({
        where: {id}
    })
    return result

}


export const AuthService = {
    register,
    getAllUsers, 
    getSingleUser
}