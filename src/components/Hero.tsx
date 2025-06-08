import Link from "next/link";
import { Button } from "./ui/button";

type Product = {
    id: string;
    name: string;
    imagePath: string;
    price: number;
    description: string;
    filePath: string;
}

export default function Hero({ product }: { product: Product }) {
    return<>
        <section className="relative bg-cover bg-center rounded-3xl overflow-hidden" style={{ backgroundImage: `url(/${product.imagePath})` }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-20 px-6 md:px-12">
            {/* Text Content */}
            <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                Elevate Your Style<br />
                <span className="text-foreground">Everyday Essentials. Premium Quality.</span>
            </h1>
            <p className="text-lg text-background max-w-md">
                Discover handpicked collections of fashion, tech, and lifestyle products built to match your pace and personality.
            </p>
            <div className="flex flex-wrap items-center gap-4">
                <Link href="/products">
                <Button size="lg">Shop Now</Button>
                </Link>
                <Link href="/collections/new-arrivals">
                <Button variant="outline" size="lg">New Arrivals</Button>
                </Link>
            </div>
            {/* Quick Links (optional) */}
            <div className="flex gap-4 mt-4 text-sm text-background">
                <Link href="/collections/clothing" className="hover:underline">Clothing</Link>
                <Link href="/collections/electronics" className="hover:underline">Electronics</Link>
                <Link href="/collections/home" className="hover:underline">Home & Decor</Link>
            </div>
            </div>

            {/* Hero Image */}
            {/* <div className="relative w-full h-96 md:h-[28rem]">
            <Image
                src={`/${product.imagePath}`}
                alt={product.name}
                width={500}
                height={500}
                className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-2xl"
            />
            </div> */}
        </div>

        {/* Background gradient blob */}
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl z-0">Hola</div>
        </section>

    </>
}