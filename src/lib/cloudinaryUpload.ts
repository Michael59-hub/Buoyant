const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

async function compressImage(file: File, maxMB = 8): Promise<File> {
  const maxBytes = maxMB * 1024 * 1024
  if (file.size <= maxBytes) return file

  return new Promise((resolve) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement("canvas")
      let { width, height } = img
      const maxDim = 2400
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }
      canvas.width = width
      canvas.height = height
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          resolve(new File([blob!], file.name, { type: "image/jpeg" }))
        },
        "image/jpeg",
        0.85
      )
    }
    img.src = url
  })
}

async function uploadRaw(file: File): Promise<string> {
  const data = new FormData()
  data.append("file", file)
  data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
  data.append("folder", "products/files")

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
    { method: "POST", body: data }
  )
  if (!res.ok) throw new Error(`File upload failed: ${res.statusText}`)
  const result = await res.json()
  return result.public_id as string
}

export async function uploadProductImage(file: File): Promise<string> {
  if (file.size > 10 * 1024 * 1024) {
    // Compress and upload simultaneously — compression is CPU-bound,
    // so we kick it off then immediately start the compressed upload
    const compressed = await compressImage(file)
    return uploadRaw_image(compressed)
  }
  return uploadRaw_image(file)
}

async function uploadRaw_image(file: File): Promise<string> {
  const data = new FormData()
  data.append("file", file)
  data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
  data.append("folder", "products/images")

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: data }
  )
  if (!res.ok) throw new Error(`Image upload failed: ${res.statusText}`)
  const result = await res.json()
  return result.public_id as string
}

export async function uploadProductFile(file: File): Promise<string> {
  if (file.size > 100 * 1024 * 1024) {
    throw new Error("File must be under 100MB")
  }
  return uploadRaw(file)
}