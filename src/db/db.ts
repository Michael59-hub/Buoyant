import { PrismaClient } from "../../generated/prisma/client";

// lib/prisma.ts
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// import { PrismaClient } from "@prisma/client"



// const prismaClientSingleton = () =>{
//     return new PrismaClient();
// }

// declare global{
//     var prisma: undefined | ReturnType<typeof prismaClientSingleton>
// }


// const db = globalThis.prisma || prismaClientSingleton()

// export default db

// if (process.env.NODE_ENV !== "production"){
//     globalThis.prisma = db
// }
// This is a singleton pattern for the Prisma Client. 
// It ensures that only one instance of the Prisma Client is created and used throughout the application.
//  This is important for performance and to avoid connection issues with the database.