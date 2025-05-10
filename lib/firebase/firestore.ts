import { db } from "./config"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"

// Types
export interface Product {
  id?: string
  name: string
  description: string
  price: number
  mrp: number
  category: string
  image: string
  unit: string
  stock: number
  vendorId: string
  pincodes: string[]
  status: "active" | "out_of_stock" | "deleted"
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Vendor {
  id?: string
  name: string
  email: string
  phone: string
  address: string
  pincodes: string[]
  status: "active" | "pending" | "blocked"
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Order {
  id?: string
  userId: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
  }>
  totalAmount: number
  deliveryFee: number
  address: {
    name: string
    phone: string
    address: string
    pincode: string
    city: string
  }
  paymentMethod: "cod" | "online"
  paymentStatus: "pending" | "paid" | "failed"
  orderStatus: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled"
  deliveryPersonId?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

// Products
export const getProductsByPincode = async (pincode: string) => {
  try {
    const q = query(
      collection(db, "products"),
      where("pincodes", "array-contains", pincode),
      where("status", "==", "active"),
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error getting products by pincode:", error)
    return []
  }
}

export const getProductsByCategory = async (category: string, pincode: string) => {
  try {
    const q = query(
      collection(db, "products"),
      where("category", "==", category),
      where("pincodes", "array-contains", pincode),
      where("status", "==", "active"),
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error getting products by category:", error)
    return []
  }
}

export const getProductById = async (productId: string) => {
  try {
    const docRef = doc(db, "products", productId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting product by ID:", error)
    return null
  }
}

export const addProduct = async (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, ...product }
  } catch (error) {
    console.error("Error adding product:", error)
    throw error
  }
}

export const updateProduct = async (
  productId: string,
  product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>,
) => {
  try {
    const docRef = doc(db, "products", productId)
    await updateDoc(docRef, {
      ...product,
      updatedAt: serverTimestamp(),
    })
    return { id: productId, ...product }
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export const deleteProduct = async (productId: string) => {
  try {
    // Soft delete by updating status
    const docRef = doc(db, "products", productId)
    await updateDoc(docRef, {
      status: "deleted",
      updatedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

// Vendors
export const getVendorsByPincode = async (pincode: string) => {
  try {
    const q = query(
      collection(db, "vendors"),
      where("pincodes", "array-contains", pincode),
      where("status", "==", "active"),
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Vendor[]
  } catch (error) {
    console.error("Error getting vendors by pincode:", error)
    return []
  }
}

export const getVendorById = async (vendorId: string) => {
  try {
    const docRef = doc(db, "vendors", vendorId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Vendor
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting vendor by ID:", error)
    return null
  }
}

export const addVendor = async (vendor: Omit<Vendor, "id" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "vendors"), {
      ...vendor,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, ...vendor }
  } catch (error) {
    console.error("Error adding vendor:", error)
    throw error
  }
}

export const updateVendor = async (
  vendorId: string,
  vendor: Partial<Omit<Vendor, "id" | "createdAt" | "updatedAt">>,
) => {
  try {
    const docRef = doc(db, "vendors", vendorId)
    await updateDoc(docRef, {
      ...vendor,
      updatedAt: serverTimestamp(),
    })
    return { id: vendorId, ...vendor }
  } catch (error) {
    console.error("Error updating vendor:", error)
    throw error
  }
}

// Orders
export const createOrder = async (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      orderStatus: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, ...orderData }
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export const getOrdersByUser = async (userId: string) => {
  try {
    const q = query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[]
  } catch (error) {
    console.error("Error getting orders by user:", error)
    return []
  }
}

export const getOrderById = async (orderId: string) => {
  try {
    const docRef = doc(db, "orders", orderId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting order by ID:", error)
    return null
  }
}

export const updateOrderStatus = async (orderId: string, status: Order["orderStatus"]) => {
  try {
    const docRef = doc(db, "orders", orderId)
    await updateDoc(docRef, {
      orderStatus: status,
      updatedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}

export const assignDeliveryPerson = async (orderId: string, deliveryPersonId: string) => {
  try {
    const docRef = doc(db, "orders", orderId)
    await updateDoc(docRef, {
      deliveryPersonId,
      orderStatus: "out_for_delivery",
      updatedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error assigning delivery person:", error)
    throw error
  }
}
