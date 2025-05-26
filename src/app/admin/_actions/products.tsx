"use server"

import { prisma } from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";


const fileSchema = z.instanceof(File, {message :  "File is required"})
const imageSchema = fileSchema.refine(file=> file.size === 0 || file.type.startsWith("image/"))

const addSchema = z.object({
    name: z.string().min(1),
    price: z.coerce.number().int().min(1),
    description: z.string().min(1),
    file: fileSchema.refine(file=> file.size > 0, {message: "File is required"}),
    image: imageSchema.refine(file=> file.size > 0, {message: "Image is required"})
})


export async function addProduct(prevState: unknown, formData: FormData){
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
    if(result.success == false){
       return result.error.formErrors.fieldErrors
    }
    const data  = result.data;
    const uuid = crypto.randomUUID();
    const filePath = `products/${uuid}-${data.file.name}`
    const imagePath = `products/${uuid}-${data.image.name}`
    await fs.mkdir("products", {recursive: true})
    
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

    await fs.mkdir("public/products", {recursive: true})
    
    await fs.writeFile(`public/${imagePath}`, Buffer.from(await data.image.arrayBuffer()))

    await prisma.product.create({data: {
        name: data.name,
        description: data.description,
        price: data.price,
        filePath,
        imagePath,
        isAvailableForPurchase: true
    }})
    // try{
    //     await fs.mkdir("products", {recursive: true})
    
    //     await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

    //     await fs.mkdir("public/products", {recursive: true})
        
    //     await fs.writeFile(`public/${imagePath}`, Buffer.from(await data.image.arrayBuffer()))

    //     await prisma.product.create({data: {
    //         name: data.name,
    //         description: data.description,
    //         price: data.price,
    //         filePath,
    //         imagePath,
    //         isAvailableForPurchase: true
    //     }})
    // }catch(err){
    //     console.error(err);
    //     return{general : "Something went wrong while adding the product"}
    // }
    
    redirect("/admin/products");
}


export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean){
    await prisma.product.update({
        where: {id},
        data: {isAvailableForPurchase}
    })

}
//  disabled: boolean
export async function deleteProduct(id: string){
    // const product = await prisma.product.findUnique({
    //     where: {id},
    //     select: {
    //         filePath: true,
    //         imagePath: true
    //     }
    // })
    // if(!product) return;
    // await fs.unlink(product.filePath)
    // await fs.unlink(product.imagePath)
    const product = await prisma.product.delete({where: {id}})
    if(product == null) return notFound()
    try{  
        await fs.unlink(product.filePath)
        await fs.unlink(`public/${product.imagePath}`)
    }catch(err){
        console.error(err);
        return {general : "File or image path does not match"}
    }
    
}

const editSchema = addSchema.extend({
    file: fileSchema.optional(),
    image: imageSchema.optional()
})

export async function updateProduct(id: string , prevState: unknown, formData: FormData){
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
    if(result.success == false){
       return result.error.formErrors.fieldErrors
    }

    const data  = result.data;
    const product = await prisma.product.findUnique({where: {id}})
    if(product == null){
        return notFound()
    }
    let filePath = product.filePath
    let imagePath = product.imagePath
    if(data.file != null && data.file.size > 0){
        await fs.unlink(product.filePath)
        filePath = `products/${crypto.randomUUID()}-${data.file.name} `
        await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
    }
    if(data.image != null && data.image.size > 0){
        await fs.unlink(`public/${product.imagePath}`)
        imagePath = `products/${crypto.randomUUID()}-${data.image.name} `
        await fs.writeFile(`public/${imagePath}`, Buffer.from(await data.image.arrayBuffer()))
    }
    await prisma.product.update({
        where: {id},
        data:  {
            name: data.name,
            description: data.description,
            price: data.price,
            filePath,
            imagePath,
        },
    })
    redirect("/admin/products");
}

    
    

