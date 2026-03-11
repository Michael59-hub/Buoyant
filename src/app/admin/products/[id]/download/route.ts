import { prisma, cloudinary } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest,{params} : {params: Promise<{id: string}>}){
    const {id} = await params;
    const product = await prisma.product.findUnique({ where: {id}, select: {filePath: true, name: true} });
    if (!product) return new Response("Product not found", {status: 404});

    // derive public id & extension from stored path
    const rawFilename = product.filePath.split('/').pop() || '';
    const extension = rawFilename.split('.').pop();
    const publicId = `products/files/${rawFilename.split('.')[0]}`;

    // build a Cloudinary URL and fetch it
    const url = cloudinary.url(publicId, { resource_type: 'raw', type: 'upload' });
    const cloudRes = await fetch(url);
    if (!cloudRes.ok) {
        return new Response("Failed to retrieve file", { status: 502 });
    }
    const arrayBuffer = await cloudRes.arrayBuffer();

    const headers = new Headers(cloudRes.headers);
    headers.set("Content-Disposition", `attachment; filename="${product.name}.${extension}"`);

    return new NextResponse(arrayBuffer, { headers });
}