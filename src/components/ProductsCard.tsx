import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { Product } from "../../generated/prisma/client";
import { formatCurrency } from "@/lib/formatters";

type productParams = Product;

export default function ProductsCard({product}: {product : productParams}){
    const supabaseUrl = `https://jcmfszwaxbdnnugiuwcs.supabase.co/storage/v1/object/public/images/${product.imagePath}`;
    const localUrl  = `/${product.imagePath}`;
    let imageUrl: string;
    if (process.env.DATABASE_URL == "file:./dev.db"){
        imageUrl = localUrl;
    }else{
        imageUrl = supabaseUrl;
    }
    return<>
        <Link href={`/products/${product.id}`} className="block">
            <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <div className="relative w-full h-auto aspect-video">
                    <Image src={imageUrl}  alt={product.name} fill  />
                </div>
                <CardHeader>
                    <CardTitle className="font-light">{product.name}</CardTitle>
                    <CardDescription><p className="font-bold">{formatCurrency(product.price / 100)}</p></CardDescription>
                </CardHeader>
            </Card>
        </Link>
    </>
}

export function ProductCardSkeleton(){
    return<>
        <Card className="overflow-hidden flex flex-col animate-pulse">
            <div className="w-full bg-gray-300 aspect-video">
            </div>
            <CardHeader>
                <div className="bg-gray-300 w-3/4 h-6"></div>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="bg-gray-300 w-full h-4 rounded-full"></div>
                <div className="bg-gray-300 w-full h-4 rounded-full"></div>
                <div className="bg-gray-300 w-full h-4 rounded-full"></div>
            </CardContent>
            <CardFooter>
                <Button disabled size="lg" className="w-full">
                    
                </Button>
            </CardFooter>
        </Card>
    </>
}