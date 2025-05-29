import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
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
        <Card className="w-1/5">
            <CardHeader>
                <Image src={imageUrl} width={400} height={300} alt={product.name} className="w-4/5 mb-4" />
                <CardTitle className="font-light">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="font-bold">{formatCurrency(product.price / 100)}</p>
            </CardContent>
            <CardFooter>
                <Button asChild variant="outline">
                    <Link href={`/products/${product.id}`}>View</Link>
                </Button>
            </CardFooter>
        </Card>
    </>
}

export function ProductCardSkeleton(){
    return<>
        <Card className="w-1/5">
            <CardHeader>
                
                <CardTitle className="font-light"></CardTitle>
            </CardHeader>
            <CardContent>
                <p className="font-bold"></p>
            </CardContent>
            <CardFooter>
                <Button asChild variant="outline">
        
                </Button>
            </CardFooter>
        </Card>
    </>
}