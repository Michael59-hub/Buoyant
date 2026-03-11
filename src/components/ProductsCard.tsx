import Link from "next/link"
import Image from "next/image"

type Product = {
  id: string
  name: string
  price: number
  description: string
  imagePath: string
  isAvailableForPurchase: boolean
}

export default function ProductsCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col bg-white/4 border border-white/8 rounded-2xl overflow-hidden hover:border-[#c8f533]/40 hover:bg-white/6 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square w-full bg-white/5 overflow-hidden">
        <Image
          src={`https://res.cloudinary.com/dmal6jha3/image/upload/v1773235223/${product.imagePath}`}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!product.isAvailableForPurchase && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-xs font-mono text-white/60 uppercase tracking-widest">Unavailable</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-[#c8f533] transition-colors">
          {product.name}
        </h3>
        <p className="text-white/35 text-xs line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[#c8f533] font-black text-base">
            ${(product.price / 100).toFixed(2)}
          </span>
          <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest border border-white/10 rounded-full px-2 py-0.5">
            {product.isAvailableForPurchase ? "Available" : "Sold Out"}
          </span>
        </div>
      </div>

      {/* Hover arrow indicator */}
      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#c8f533] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </Link>
  )
}
