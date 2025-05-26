import { Nav, NavLink } from "@/components/Nav";
import { cn } from "@/lib/utils";
import Link from "next/link";


// export default function AdminLayout({
//     children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return <>
//       <Nav>
//         <Link href="/admin" className={cn("p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground")}>Dashboard</Link>
//         <Link href="/admin/products" className={cn("p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground")}>Products</Link>
//         <Link href="/admin/users" className={cn("p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground")}>Customers</Link>
//         <Link href="/admin/orders" className={cn("p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground")}>Sales</Link>
//       </Nav>
//     <div className="container my-6">{children}</div>
//     </>;

// }

export const dynamic = "force-dynamic";

export default function AdminLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
      </Nav>
    <div className="container my-6">{children}</div>
    </>;

}

