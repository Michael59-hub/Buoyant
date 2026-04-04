"use client"

import React, { useState, useTransition } from "react"
import { formatCurrency } from "@/lib/formatters"
import { uploadProductImage, uploadProductFile } from "@/lib/cloudinaryUpload"
import { addVendorProduct } from "../_actions/vendorProducts"
import Image from "next/image"

type FormErrors =
  | { name?: string[]; price?: string[]; description?: string[]; image?: string[]; file?: string[]; category?: string[] }
  | { general: string }
  | undefined

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!

const CATEGORIES = [
  { value: "music", label: "Music", emoji: "🎵" },
  { value: "image", label: "Images", emoji: "🖼️" },
  { value: "book", label: "Books", emoji: "📖" },
  { value: "template", label: "Templates", emoji: "📐" },
  { value: "font", label: "Fonts", emoji: "✏️" },
  { value: "video", label: "Video", emoji: "🎬" },
  { value: "software", label: "Software", emoji: "💾" },
  { value: "course", label: "Courses", emoji: "🎓" },
  { value: "preset", label: "Presets", emoji: "🎛️" },
]

export default function VendorProductForm() {
  const [errors, setErrors] = useState<FormErrors>(undefined)
  const [priceInCents, setPriceInCents] = useState<number | undefined>()
  const [isPending, startTransition] = useTransition()
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)

  const fieldErrors = errors && !("general" in errors) ? errors : null
  const generalError = errors && "general" in errors ? errors.general : null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors(undefined)
    const formData = new FormData(e.currentTarget)
    const imageFile = formData.get("image") as File | null
    const productFile = formData.get("file") as File | null

    const metaData = new FormData()
    metaData.append("name", formData.get("name") as string)
    metaData.append("description", formData.get("description") as string)
    metaData.append("price", formData.get("price") as string)
    metaData.append("category", (formData.get("category") as string) ?? "")

    try {
      if (imageFile && imageFile.size > 0) {
        setUploadStatus("Uploading image...")
        const imagePath = await uploadProductImage(imageFile)
        metaData.append("imagePath", imagePath)
      }

      if (productFile && productFile.size > 0) {
        setUploadStatus("Uploading file...")
        const filePath = await uploadProductFile(productFile)
        metaData.append("filePath", filePath)
      }

      setUploadStatus("Saving product...")
      startTransition(async () => {
        const result = await addVendorProduct(undefined, metaData)
        if (result) setErrors(result as FormErrors)
        setUploadStatus("")
      })
    } catch (err) {
      console.error(err)
      setErrors({ general: "Failed to upload files. Please try again." })
      setUploadStatus("")
    }
  }

  const isLoading = isPending || !!uploadStatus

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {generalError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4">
          <p className="text-red-400 text-sm">{generalError}</p>
        </div>
      )}

      {/* Name */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-3">
        <label htmlFor="name" className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">Product Name</label>
        <input type="text" id="name" name="name" required placeholder="e.g. Minimal UI Kit"
          className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c8f533]/50 transition-all" />
        {fieldErrors?.name && <p className="text-red-400 text-xs">{fieldErrors.name}</p>}
      </div>

      {/* Price */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-3">
        <label htmlFor="price" className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">Price (in cents)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-mono">¢</span>
          <input type="number" id="price" name="price" required value={priceInCents ?? ""}
            onChange={e => setPriceInCents(Number(e.target.value))} placeholder="0"
            className="w-full bg-white/4 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c8f533]/50 transition-all font-mono" />
        </div>
        {priceInCents != null && priceInCents > 0 && (
          <p className="text-[#c8f533] text-sm font-mono">= {formatCurrency(priceInCents / 100)}</p>
        )}
        {fieldErrors?.price && <p className="text-red-400 text-xs">{fieldErrors.price}</p>}
      </div>

      {/* Description */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-3">
        <label htmlFor="description" className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">Description</label>
        <textarea id="description" name="description" required rows={4} placeholder="Describe your product..."
          className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c8f533]/50 transition-all resize-none" />
        {fieldErrors?.description && <p className="text-red-400 text-xs">{fieldErrors.description}</p>}
      </div>

      {/* Category */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-3">
        <label className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat.value} className="relative flex items-center gap-2 bg-white/4 border border-white/10 rounded-xl px-3 py-2.5 cursor-pointer hover:border-white/20 transition-all has-[:checked]:border-[#c8f533]/50 has-[:checked]:bg-[#c8f533]/5">
              <input type="radio" name="category" value={cat.value} required className="sr-only" />
              <span className="text-base">{cat.emoji}</span>
              <span className="text-white/60 text-xs font-medium">{cat.label}</span>
            </label>
          ))}
        </div>
        {fieldErrors?.category && <p className="text-red-400 text-xs">{fieldErrors.category}</p>}
      </div>

      {/* Image */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-3">
        <label className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">Product Image</label>
        {imagePreview && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#c8f533]/20">
            <Image src={imagePreview} fill className="object-cover" alt="Preview" />
          </div>
        )}
        <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-white/15 rounded-xl px-4 py-6 cursor-pointer hover:border-white/25 hover:bg-white/[0.02] transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="white" strokeWidth="1.5" strokeOpacity=".3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white/30 text-xs font-mono">{imagePreview ? "Change image" : "Upload image"}</span>
          <input type="file" name="image" accept="image/*" required className="sr-only"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) setImagePreview(URL.createObjectURL(f)) }} />
        </label>
        {fieldErrors?.image && <p className="text-red-400 text-xs">{fieldErrors.image}</p>}
      </div>

      {/* File */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-3">
        <label className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">Product File</label>
        {selectedFileName && (
          <div className="flex items-center gap-3 bg-[#c8f533]/5 border border-[#c8f533]/20 rounded-xl px-4 py-3">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 8l4 4 8-8" stroke="#c8f533" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-[#c8f533] text-xs font-mono truncate">{selectedFileName}</p>
          </div>
        )}
        <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-white/15 rounded-xl px-4 py-6 cursor-pointer hover:border-white/25 hover:bg-white/[0.02] transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="white" strokeWidth="1.5" strokeOpacity=".3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2v6h6M12 11v6M9 14l3-3 3 3" stroke="white" strokeWidth="1.5" strokeOpacity=".3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white/30 text-xs font-mono">{selectedFileName ? "Change file" : "Upload file"}</span>
          <input type="file" name="file" required className="sr-only"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) setSelectedFileName(f.name) }} />
        </label>
        {fieldErrors?.file && <p className="text-red-400 text-xs">{fieldErrors.file}</p>}
      </div>

      {/* Submit */}
      <button type="submit" disabled={isLoading}
        className="w-full bg-[#c8f533] text-black font-bold py-4 rounded-2xl text-sm tracking-wide hover:bg-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".2"/>
              <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            {uploadStatus || "Saving..."}
          </>
        ) : "Add Product →"}
      </button>
    </form>
  )
}
