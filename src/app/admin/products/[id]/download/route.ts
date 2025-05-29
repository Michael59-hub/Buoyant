
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { prisma } from "@/db/db";

export async function GET(req: NextRequest,{params} : {params: Promise<{id: string}>}){
    const {id} = await params;
    const product = await prisma.product.findUnique({ where: {id}, select: {filePath: true, name: true} })
    if(!product) return new Response("Product not found", {status: 404})
    
    const {size} = await fs.stat(product.filePath)
    const file = await fs.readFile(product.filePath)
    const extension = product.filePath.split(".").pop()

    return new NextResponse(file, {headers: {
        "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
        "Content-Length": size.toString(),
    }})
}