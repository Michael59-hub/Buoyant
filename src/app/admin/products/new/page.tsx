import ProductForm from "../_components/productForm"
import Link from "next/link"

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-[#080808] px-6 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-xs font-mono text-white/30 hover:text-white/60 transition-colors mb-6"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Products
          </Link>
          <p className="text-xs font-mono text-[#c8f533] tracking-[0.2em] uppercase mb-2">Admin</p>
          <h1 className="text-4xl font-black text-white tracking-tight">Add Product</h1>
        </div>

        <ProductForm />
      </div>
    </div>
  )
}
