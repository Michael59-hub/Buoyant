import { PrismaClient as PostgresClient } from "../../generated/prisma/client";
import { PrismaClient as SqliteClient } from "../../generated/prisma/sqliteClient";
// import { createClient, SupabaseClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.PROJECT_URL!;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// declare global {
//   // eslint-disable-next-line no-var
//   var supabase: SupabaseClient | undefined;
// }

type GlobalPrisma = {
  prisma: PostgresClient | SqliteClient;
};

// const globalWithSupabase = global as typeof global & {
//   supabase?: SupabaseClient;
// };

// export const supabase =
//   globalWithSupabase.supabase ?? createClient(supabaseUrl, supabaseAnonKey);

// if (process.env.NODE_ENV !== 'production') {
//   globalWithSupabase.supabase = supabase;
// }
const isSQLite = process.env.DATABASE_URL?.startsWith('file:');

const globalForPrisma = globalThis as typeof globalThis & GlobalPrisma;

let client: PostgresClient | SqliteClient;

if (!globalForPrisma.prisma) {
  client = isSQLite ? new SqliteClient() : new PostgresClient();

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }
} else {
  client = globalForPrisma.prisma;
}

export const prisma = client;
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