import Link from "next/link";

export default function Footer() {
    return<>
        <footer className="bg-background text-foreground py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
            <h3 className="text-lg font-semibold mb-3">Buoyant</h3>
            <p className="text-popover-foreground">
                Your one-stop shop for clothing, electronics, and more.
            </p>
            </div>
            <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-popover-foreground">
                <li><Link href="/products">Products</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/cart">Cart</Link></li>
            </ul>
            </div>
            <div>
            <h4 className="font-semibold mb-2">Get In Touch</h4>
            <p className="text-popover-foreground">Email: support@buoyant.com</p>
            <p className="text-popover-foreground">Phone: +1 (555) 123-4567</p>
            </div>
        </div>
        <div className="text-center text-popover-foreground text-xs mt-8">
            &copy; {new Date().getFullYear()} Buoyant. All rights reserved.
        </div>
        </footer>

    </>
}