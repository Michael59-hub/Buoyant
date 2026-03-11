"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/formatters"
import React, { useState } from "react"
import { addProduct, updateProduct } from "../../_actions/products"
import { useFormStatus } from "react-dom"
import { Product } from "../../../../../generated/prisma/client"
import Image from "next/image"

type FormErrors =
  | { name?: string[]; price?: string[]; description?: string[]; image?: string[]; file?: string[] }
  | { general: string }
  | undefined

export default function ProductForm({ product }: { product?: Product | null }) {
    const [error, action] = React.useActionState<FormErrors, FormData>(
        product == null ? addProduct : updateProduct.bind(null, product.id),
        undefined
    )
    const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.price)

    const fieldErrors = error && !('general' in error) ? error : null
    const generalError = error && 'general' in error ? error.general : null

    return (
        <form action={action} className="space-y-8">
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
                    <div className="text-muted-foreground">{product?.filePath}</div>
                )}
                {fieldErrors?.file && <p className="text-destructive">{fieldErrors.file}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input type="file" id="image" name="image" required={product == null} />
                {product != null && (
                    <Image
                        src={`/${product.imagePath}`}
                        width={400}
                        height={400}
                        alt={product.imagePath}
                    />
                )}
                {fieldErrors?.image && <p className="text-destructive">{fieldErrors.image}</p>}
            </div>

            <SubmitButton />
        </form>
    )
}

const SubmitButton = () => {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save"}
        </Button>
    )
}
