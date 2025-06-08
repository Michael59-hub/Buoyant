import { prisma } from "@/db/db"
// import { Product } from "../../../generated/prisma"
import ProductsCard from "@/components/ProductsCard"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { Product } from "../../../generated/prisma/client"
// import { ArrowRight } from "lucide-react"
// import {  Suspense } from "react"
import { cache } from "@/lib/cache"
import Testimonial from "@/components/Testimonial"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"

export default async function HomePage(){
    const popularProducts = await getMostPopularProducts()
    const newestProducts = await getNewestProducts()
    const randomProduct = await getRandomProducts()
    return<>
        <main className="flex flex-col gap-20 px-4 md:px-8 lg:px-16 py-10">
      <Hero product={randomProduct} />

      {/* Featured Categories */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newestProducts.map((product) => (
            <ProductsCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Popular Products (mock data) */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Popular Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <ProductsCard key={product.id} product={product} />
          ))}
        </div>
      </section>


      <Testimonial />
      <Footer />
    </main>
        
    </>
}

const getAllProducts = () =>{
    return prisma.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { createdAt: "desc" },
    })
}

const getRandomProducts = cache(async () => {
    const products = await getAllProducts();
    const randomProduct = Math.floor(Math.random() * products.length);
    // You can return the random product or products[randomProduct] here if needed
    return products[randomProduct];
}, ["/", "getRandomProducts"], {revalidate: 60 * 60 * 24})

const getMostPopularProducts = cache(() =>{
    return prisma.product.findMany({
        where : {isAvailableForPurchase : true},
        orderBy: { orders: { _count: "desc" } },
        take: 5,
    })
}, ["/", "getMostPopularProducts"], {revalidate: 60 * 60 * 24})

const getNewestProducts = cache(() =>{
    return prisma.product.findMany({
        where : {isAvailableForPurchase : true},
        orderBy: { createdAt: "desc"},
        take: 5,
    })    
}, ["/", "getNewestProducts"], {revalidate: 60 * 60 * 24})  
// type productsGridSectionProps = {
//     title: string,
//     productsFetcher: ()=> Promise<Product[]>
// }

// async function ProductGridSection({productsFetcher, title}: productsGridSectionProps){
//     return(
//         <div className="space-y-4">
//             <div className="flex gap-4">
//                 <h2 className="text-3xl font-bold">
//                     {title}
//                     <Button asChild variant="outline">
//                         <Link href="/products" className="space-x-2"><span>View all</span> <ArrowRight className="size-4" /></Link>
//                     </Button>
//                 </h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <Suspense fallback={<>
//                         <ProductCardSkeleton />
//                         <ProductCardSkeleton />
//                         <ProductCardSkeleton />
//                     </>}>
//                     <ProductSuspense productsFetcher={productsFetcher} />
//                 </Suspense>
                
//             </div>
//         </div>
//     )
// }

// async function ProductSuspense({productsFetcher} : {productsFetcher: () => Promise<Product[]>}){
//     return(
//         (await productsFetcher()).map(product =>{
//             return(
//                 <ProductsCard key={product.id} product={product} />
//             )
            
//         })
                    
//     )
// }