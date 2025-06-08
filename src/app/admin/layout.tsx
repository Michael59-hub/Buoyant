import { Nav, NavLink } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/modeToggler";


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
        <div className="text-orange-600 text-3xl text-center font-light font-mono p-2 my-auto w-1/4">
          Buoyant
        </div>
        <div className="flex justify-around items-center  mt-auto">
          <Input type="text" placeholder="Search for your favourite song, book..." className="w-4/5" />
          <Button type="submit" variant="outline"  className="w-1/5 ml-1.5">Search</Button>
        </div>
        <div className="items-left m-auto">
          <NavLink href="/admin">Dashboard</NavLink>
          <NavLink href="/admin/products">Products</NavLink>
          <NavLink href="/admin/users">Customers</NavLink>
          <NavLink href="/admin/orders">Sales</NavLink>
          <ModeToggle />
        </div>
        
      </Nav>
    <div className="container my-6">{children}</div>
    </>;

}

