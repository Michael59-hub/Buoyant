import ProductsCard, { ProductCardSkeleton } from "@/components/ProductsCard";
import { Suspense } from "react";
import { Product } from "../../../../generated/prisma/sqliteClient";
import { prisma } from "@/db/db";
import { cache } from "@/lib/cache";

export default function CustomerProductsPage(){
    return<>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Suspense fallback={<>
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                </>}>
                <ProductSuspense productsFetcher={getAllProducts} />
            </Suspense>
            
        </div>
    </>
}

const getAllProducts= cache(() =>{
    return prisma.product.findMany({
        where: { isAvailableForPurchase: true},
        orderBy: { createdAt: "desc" },
    });
}, ["/products", "getAllProducts"], {revalidate: 60 * 60 * 24});

async function ProductSuspense({productsFetcher} : {productsFetcher: () => Promise<Product[]>}){
    return(
        (await productsFetcher()).map(product =>{
            return(
                <ProductsCard key={product.id} product={product} />
            )
            
        })
                    
    )
}