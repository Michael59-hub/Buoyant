import { PrismaClient } from "../../generated/prisma/client";
// import { createClient, SupabaseClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.PROJECT_URL!;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// declare global {
//   // eslint-disable-next-line no-var
//   var supabase: SupabaseClient | undefined;
// }



// const globalWithSupabase = global as typeof global & {
//   supabase?: SupabaseClient;
// };

// export const supabase =
//   globalWithSupabase.supabase ?? createClient(supabaseUrl, supabaseAnonKey);

// if (process.env.NODE_ENV !== 'production') {
//   globalWithSupabase.supabase = supabase;
// }


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