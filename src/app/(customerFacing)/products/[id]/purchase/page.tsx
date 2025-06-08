import { prisma } from "@/db/db";

export default async function PurchasePage({params} : {params: Promise<{id: string}>}) {
    const {id} = await params;
    const product = await prisma.product.findUnique({
        where: { id},
    })
    if (!product) {
        return (
            <div className="max-w-2xl mx-auto p-10 text-center">
                <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                <p className="text-gray-600 mb-6">
                    We couldn&apos;t find the product you&apos;re looking for. It may have been removed or never existed.
                </p>
            </div>
        )
    }
    return<>
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Purchase Page</h1>
            <p className="text-lg">This is the purchase page for the product.</p>
        </div>
    </>

}