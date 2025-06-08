import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

export default async function AdminDashboard(){
    const salesData = await getSalesData();
    const userData = await getUserData();
    const productData = await getProductData();
    await wait(2000)
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard title="Total Sales" subtitle={`${formatNumber( salesData.numberOfSales)} Orders`} body={formatCurrency(salesData.amount)} />
            <DashboardCard title="Total Orders" subtitle={`${formatNumber( salesData.numberOfSales)} Orders`}body={formatCurrency(salesData.amount)} />
            <DashboardCard title="Customers" subtitle={`${formatNumber(userData.averageValuePerUser)} Average Value`} body={formatCurrency(userData.userCount)} />
            <DashboardCard title="Active Products" subtitle={`${formatNumber(productData.activeCount)} Inactive Porducts`} body={formatCurrency(productData.inactiveCount)}/>
        </div>
    )
    
}
const wait = (duration: number) =>{
    return new Promise(resolve => setTimeout(resolve, duration))
}

type DashboardCardProps = {
    title: string;
    subtitle: number |string;
    body: number | string;
}


const DashboardCard = ({title, subtitle, body}: DashboardCardProps) =>{
    return(
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent><p>{body}</p></CardContent>
        </Card>
    )
}

const getSalesData = async () =>{
    const data = await prisma.order.aggregate({
        _sum: {pricePaid: true},
        _count: true
    })

    return{
        amount: (data._sum.pricePaid || 0)/100,
        numberOfSales: data._count
    }
}

const getUserData = async () =>{
    const [userCount, orderData] = await Promise.all([
        prisma.user.count(),
        prisma.order.aggregate({
            _sum: { pricePaid:true },
        }),
    ])
    // const userCount = await prisma.user.count()
    // const orderData = await prisma.order.aggregate({
    //     _sum: { pricePaid: true }
    // })
    return{
        userCount,
        averageValuePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaid || 0)/userCount/100
    }
}

const getProductData = async () =>{
    const [activeCount, inactiveCount] = await Promise.all([
        prisma.product.count({where : {isAvailableForPurchase: true}}),
        prisma.product.count({where : {isAvailableForPurchase: false}}),
    ])
    return{
        activeCount,inactiveCount
    }
}

