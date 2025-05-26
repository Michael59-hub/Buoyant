import bcrypt from "bcryptjs";

export async function isValidPassword(password: string, hashedPassword: string): Promise<boolean> {
    if (!password || !hashedPassword) return false;
    console.log(await passwordHasher(password));
    return await passwordHasher(password) === hashedPassword
    // Use a library like bcrypt to compare the password with the hashed password

}

async function passwordHasher(password: string): Promise<string>{
    const arrayBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(password))
    return Buffer.from(arrayBuffer).toString("base64");
}