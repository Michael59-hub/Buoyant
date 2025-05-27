import { prisma } from "@/db/db"
// import { Product } from "../../../generated/prisma"
import ProductsCard from "@/components/ProductsCard"

export default async function HomePage(){
    const popularProducts = await getMostPopularProducts()
    const newestProducts = await getNewestProducts()
    return<>
        <h2>Most popular products</h2>
        <div className="flex justify-evenly flex-wrap gap-4">
            {popularProducts.map(product =>{
                return(
                    <ProductsCard key={product.id} product={product} />
                )
            })}
        </div>
        <h2>Newest Products</h2>
        <div className="flex justify-evenly flex-wrap gap-4">
            {newestProducts.map(product =>{
                return(
                    <ProductsCard key={product.id} product={product} />
                )
            })}
        </div>
    </>
}

function getMostPopularProducts(){
    return prisma.product.findMany({
        where : {isAvailableForPurchase : true},
        orderBy: { orders: { _count: "desc" } },
        take: 5,
    })
}

function getNewestProducts(){
    return prisma.product.findMany({
        where : {isAvailableForPurchase : true},
        orderBy: { createdAt: "desc"},
        take: 5,
    })

    
}    
// type productsGridSectionProps = {
//     title: string,
//     productsFetcher: ()=> Promise<Product[]>
// }

// function ProductGridSection({productsFetcher, title}: productsGridSectionProps){
//     return(
//         <div className="space-y-4">
//             <div className="flex gap-4">
//                 <h2 className="text-3xl font-bold">
//                     <Button asChild variant="outline">
//                         <Link href="/products">View all</Link>
//                     </Button>
//                 </h2>
//             </div>
//         </div>
//     )
// }