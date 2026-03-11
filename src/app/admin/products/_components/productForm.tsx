"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/formatters"
import React, { useState, useTransition } from "react"
import { addProduct, updateProduct } from "../../_actions/products"
import { Product } from "../../../../../generated/prisma/client"
import Image from "next/image"

type FormErrors =
  | { name?: string[]; price?: string[]; description?: string[]; image?: string[]; file?: string[]; category?: string[] }
  | { general: string }
  | undefined

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

async function uploadToCloudinary(file: File, resourceType: "image" | "raw"): Promise<string> {
    console.log("Cloud name:", CLOUDINARY_CLOUD_NAME)
  console.log("Preset:", CLOUDINARY_UPLOAD_PRESET)
  console.log("File:", file.name, file.size, file.type)
  console.log("URL:", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`)
  const data = new FormData()
  data.append("file", file)
  data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
  data.append("folder", resourceType === "image" ? "products/images" : "products/files")

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: data }
  )

  if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.statusText}`)
  const result = await res.json()
  return result.public_id as string
}

export default function ProductForm({ product }: { product?: Product | null }) {
  const [errors, setErrors] = useState<FormErrors>(undefined)
  const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.price)
  const [isPending, startTransition] = useTransition()
  const [uploadStatus, setUploadStatus] = useState<string>("")

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
        const imagePath = await uploadToCloudinary(imageFile, "image")
        metaData.append("imagePath", imagePath)
      } else if (product?.imagePath) {
        metaData.append("imagePath", product.imagePath)
      }

      if (productFile && productFile.size > 0) {
        setUploadStatus("Uploading file...")
        const filePath = await uploadToCloudinary(productFile, "raw")
        metaData.append("filePath", filePath)
      } else if (product?.filePath) {
        metaData.append("filePath", product.filePath)
      }

      setUploadStatus("Saving product...")

      startTransition(async () => {
        const result =
          product == null
            ? await addProduct(undefined, metaData)
            : await updateProduct(product.id, undefined, metaData)

        if (result) setErrors(result as FormErrors)
        setUploadStatus("")
      })
    } catch (err) {
      console.error(err)
      setErrors({ general: "Failed to upload files. Please try again." })
      setUploadStatus("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {generalError && (
        <p className="text-destructive font-medium">{generalError}</p>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required defaultValue={product?.name || ""} />
        {fieldErrors?.name && <p className="text-destructive">{fieldErrors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price in Cents</Label>
        <Input
          type="number"
          id="price"
          name="price"
          required
          value={priceInCents}
          onChange={e => setPriceInCents(Number(e.target.value))}
        />
        <div className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
        {fieldErrors?.price && <p className="text-destructive">{fieldErrors.price}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={product?.description || ""} required />
        {fieldErrors?.description && <p className="text-destructive">{fieldErrors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={product == null} />
        {product != null && (
          <div className="text-muted-foreground text-sm">{product?.filePath}</div>
        )}
        {fieldErrors?.file && <p className="text-destructive">{fieldErrors.file}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" accept="image/*" required={product == null} />
        {product != null && product.imagePath && (
          <Image
            src={`https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${product.imagePath}`}
            width={400}
            height={400}
            alt={product.imagePath}
          />
        )}
        {fieldErrors?.image && <p className="text-destructive">{fieldErrors.image}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          required
          defaultValue={product?.category || ""}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="" disabled>Select a category</option>
          <option value="music">Music</option>
          <option value="image">Images</option>
          <option value="book">Books</option>
          <option value="template">Templates</option>
          <option value="font">Fonts</option>
          <option value="video">Video</option>
          <option value="software">Software</option>
          <option value="course">Courses</option>
          <option value="preset">Presets</option>
        </select>
        {fieldErrors?.category && <p className="text-destructive">{fieldErrors.category}</p>}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? uploadStatus || "Saving..." : "Save"}
      </Button>
    </form>
  )
}
