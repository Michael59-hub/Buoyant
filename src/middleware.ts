import { NextRequest, NextResponse } from "next/server";
import { isValidPassword} from "./lib/isValidPassword";

export async function middleware(req: NextRequest) {
    if(await isAuthenticated(req) === false){
        return new NextResponse("Unauthorised", {
            status: 401,
            headers: {"WWW-Authenticate": "Basic"}
        })
    }
}

export async function isAuthenticated(req: NextRequest) {
    const auth = req.headers.get("Authorization") || req.headers.get("authorization")
    if (!auth) return false;

    const [username, password] = Buffer.from(auth.split(" ")[1], "base64").toString().split(":");
    console.log(username, password);
    return username === process.env.BASIC_AUTH_USERNAME && await isValidPassword(password, process.env.HASHED_ADMIN_PASSWORD as string);
}

export const config = {
    matcher: "/admin/:path*",
}