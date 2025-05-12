/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "./db"

export const seeds = async () => {
   const name = "Shamim Reza" 
   const email = "shamimrezabd67@gmail.com"
   const password = "123456789" // ideally hashed
    const role: any = "SUPER_ADMIN"; // Ensure type compatibility

await prisma.user.upsert({
  where: { email },
  // if found, do nothing (or update other fields)
  update: {},
  create: {
    name,
    email,
    password,  // ideally hashed
    role,
  },
});
  await prisma.$disconnect();
}