




async function createOrder(productId: string) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    })
    if (!response.ok) {
      throw new Error("Failed to create order")
    }   
    const order = await response.json()
    return order
  } catch (error) {
    console.error(error)
  }
}