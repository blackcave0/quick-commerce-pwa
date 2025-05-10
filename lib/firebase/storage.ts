import { storage } from "./config"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

export const uploadProductImage = async (file: File, vendorId: string) => {
  try {
    const timestamp = Date.now()
    const fileName = `products/${vendorId}/${timestamp}_${file.name}`
    const storageRef = ref(storage, fileName)

    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)

    return { success: true, url: downloadURL, path: fileName }
  } catch (error) {
    console.error("Error uploading product image:", error)
    return { success: false, error }
  }
}

export const deleteProductImage = async (imagePath: string) => {
  try {
    const storageRef = ref(storage, imagePath)
    await deleteObject(storageRef)
    return { success: true }
  } catch (error) {
    console.error("Error deleting product image:", error)
    return { success: false, error }
  }
}
