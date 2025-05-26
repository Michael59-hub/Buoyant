import { prisma } from "@/db/db"
import { Product } from "../../../generated/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function HomePage(){
    const products = await getMostPopularProducts()
    return<>
        <h1>Hello</h1>
        <div className="flex justify-evenly flex-wrap gap-4">
            {products.map(product =>{
                return(
                    <Card key={product.id} className="w-1/5">
                        <CardHeader>
                            <img src={product.imagePath} alt={product.name} className="w-4/5 mb-4" />
                            <CardTitle className="font-light">{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-bold">${product.price/100}</p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="outline">
                                <Link href={`/products/${product.id}`}>View Product</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
        
        {/* {products.map(product =>{
            return (
                <div className="flex justify-evenly flex-col">
                    <div key={product.id} className="p-4 border rounded-lg">
                    <img src={product.imagePath} alt={product.name} className="w-1/5 h-48 object-cover mb-4 rounded-lg" />
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <p className="text-gray-500">Price: ${product.price / 100}</p>
                    <Button asChild variant="outline">
                        <Link href={`/products/${product.id}`}>View Product</Link>
                    </Button>
                    </div>
                </div>
                
            )
        })} */}
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
type productsGridSectionProps = {
    title: string,
    productsFetcher: ()=> Promise<Product[]>
}

function ProductGridSection({productsFetcher, title}: productsGridSectionProps){
    return(
        <div className="space-y-4">
            <div className="flex gap-4">
                <h2 className="text-3xl font-bold">
                    <Button asChild variant="outline">
                        <Link href="/products">View all</Link>
                    </Button>
                </h2>
            </div>
        </div>
    )
}