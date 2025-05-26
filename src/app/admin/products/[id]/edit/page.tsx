import PageHeader from "@/app/admin/_components/pageHeader";
import ProductForm from "../../_components/productForm";
import { prisma } from "@/db/db";


export default async function EditProductPage({params}: {params : Promise<{id: string}>}){
    const {id} = await params;
    const product = await prisma.product.findUnique({where: {id}})
    return <>
        <PageHeader>Edit Product</PageHeader>
        <ProductForm product = {product}/>
    </>
}