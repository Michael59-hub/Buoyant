


import { Button } from "@/components/ui/button";
import PageHeader from "../_components/pageHeader";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/productAction";

const AdminProductPage = () =>{
    return<>
        <div className="flex justify-between items-center gap-4">
            <PageHeader>Products</PageHeader>
            <Button asChild>
                <Link href="/admin/products/new" className="flex items-center gap-2">Add Product</Link>
            </Button>
        </div>
        <ProductsTable />

    </>
}


const   ProductsTable = async() =>{
    const products = await prisma.product.findMany({
        select:{
            id: true,
            name: true,
            price: true,
            isAvailableForPurchase: true,
            _count:{
                select:{
                    orders: true
                }
            }
        },
        orderBy: {name: "asc"}
    })
    if(products.length === 0 ) return <p className="text-muted-foreground">No products found</p>
    return(
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-0 ">
                        <span className="sr-only">Available for purchase</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="w-0 ">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map(product => {
                    return (
                        <TableRow key={product.id}>
                            <TableCell>
                                {product.isAvailableForPurchase ? ( <><CheckCircle2 /></> ) : (<XCircle className="stroke-destructive" />)}
                            </TableCell>
                            <TableCell>
                                {product.name}
                            </TableCell>
                            <TableCell>
                                { formatCurrency(product.price/100)}
                            </TableCell>
                            <TableCell>
                                {formatNumber(product._count.orders)}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreVertical />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild>
                                            <a download href={`/admin/products/${product.id}/download`}>Download</a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                                        </DropdownMenuItem>
                                        <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase}/>
                                        <DropdownMenuSeparator />
                                        <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    )
}

export default AdminProductPage;