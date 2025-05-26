import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { prisma } from "@/db/db";
import Link from "next/link";

// interface ProductPageProps {
//   params: {
//     id: string;
//   };
// }

export default async function ProductPage({params} : {params: Promise<{id: string}>}){
  const {id} = await params;
  const product = await prisma.product.findUnique({
    where: {id},
  })
  if (!product) {
    return (
      <div className="max-w-2xl mx-auto p-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">
          We couldn&apost find the product you&aposre looking for. It may have been removed or never existed.
        </p>
        <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
          Go Back Home
        </Link>
      </div>
    )
  }
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative aspect-square w-full bg-gray-100 rounded-2xl overflow-hidden shadow">
        <Image
          src={`/${product.imagePath}`}
          alt={product.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl text-green-600 font-semibold mb-2">
            ${product.price / 100}
          </p>
          <p className="text-sm text-gray-700 mb-6">{product.description}</p>
          <div className="mb-4">
            {product.isAvailableForPurchase ? (
              <span className="text-green-500 font-medium">In Stock</span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>
        </div>
        <Button
          className="w-full py-4 text-lg"
          disabled={!product.isAvailableForPurchase}
        >
          {product.isAvailableForPurchase ? "Add to Cart" : "Unavailable"}
        </Button>
      </div>
    </div>
  );
};

// At the bottom of page.tsx (or in a separate file)
export async function generateStaticParams(): Promise<{ id: string }[]> {
  const products = await prisma.product.findMany({
    select: { id: true },
  });

  return products.map((product) => ({
    id: product.id,
  }));
}
