export async function createOrder(billingData: any) {
  const res = await fetch("/api/orders/cart/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ billing: billingData }),
  });
  if (!res.ok) {
    throw new Error("Failed to create order");
  }
  const data = await res.json();
  return data; 
}

export async function captureOrder(orderId: string) {
  const res = await fetch(`/api/orders/cart/${orderId}/capture`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("Failed to capture order");
  }
  const data = await res.json();
  return data; 
}

export async function addCart(cartData: any) {
  const res = await fetch("/api/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cartData),
  });
  if (!res.ok) {
    throw new Error("Failed to add cart");
  }
  return await res.json();
}

export async function getCart() {
  const res = await fetch("/api/cart/get");
  if (!res.ok) {
    throw new Error("Failed to get cart");
  }
  return await res.json();
}

export async function mergeCart(guestCartData: any) {
  const res = await fetch("/api/cart/merge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(guestCartData),
  });
  if (!res.ok) {
    throw new Error("Failed to merge cart");
  }
  return await res.json();
}
