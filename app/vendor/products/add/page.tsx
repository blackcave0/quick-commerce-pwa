"use client"

import { useState, useRef, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useVendor } from "@/lib/context/vendor-provider"
import { addProduct } from "@/lib/firebase/firestore"
import { uploadProductImage, uploadMultipleProductImages, checkCloudinaryConfig } from "@/lib/cloudinary/upload"
import { isCloudinaryConfigured } from "@/lib/cloudinary/config"
import { AlertCircle, Loader2, Upload, Info, X, Image as ImageIcon, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

// Categories
const categories = [
  { id: "fruits-vegetables", name: "Fruits & Vegetables" },
  { id: "dairy", name: "Dairy" },
  { id: "bakery", name: "Bakery" },
  { id: "meat", name: "Meat & Poultry" },
  { id: "grocery", name: "Grocery & Staples" },
]

export default function AddProductPage() {
  const router = useRouter()
  const { vendor } = useVendor()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfigChecking, setIsConfigChecking] = useState(false)
  const [configError, setConfigError] = useState<string | null>(null)
  const [selectedPincodes, setSelectedPincodes] = useState<string[]>([])
  // Images
  const [primaryImage, setPrimaryImage] = useState<File | null>(null)
  const [primaryImagePreview, setPrimaryImagePreview] = useState<string | null>(null)
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const additionalFileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    mrp: "",
    stock: "",
    unit: "pcs", // Default unit
  })

  // Handle pincode selection
  const handlePincodeChange = (pincodeId: string) => {
    setSelectedPincodes((prev) =>
      prev.includes(pincodeId) ? prev.filter((id) => id !== pincodeId) : [...prev, pincodeId],
    )
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // Handle primary image upload
  const handlePrimaryImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }

      setPrimaryImage(file)

      // Create a preview
      const reader = new FileReader()
      reader.onload = () => {
        setPrimaryImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      setError(null)
    }
  }

  // Handle additional images upload
  const handleAdditionalImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: File[] = Array.from(e.target.files)

      // Check if we're exceeding the limit of 2 additional images
      if (additionalImages.length + newFiles.length > 2) {
        toast({
          variant: "destructive",
          title: "Too many images",
          description: "You can upload a maximum of 2 additional images"
        })
        return
      }

      // Validate all files
      const invalidFiles = newFiles.filter(file => !file.type.startsWith('image/'))
      if (invalidFiles.length > 0) {
        setError("Please select valid image files only")
        return
      }

      const largeFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024)
      if (largeFiles.length > 0) {
        setError("All images must be less than 5MB")
        return
      }

      // Add to existing images
      setAdditionalImages(prev => [...prev, ...newFiles])

      // Generate previews
      const newPreviews: string[] = []
      newFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = () => {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === newFiles.length) {
            setAdditionalImagePreviews(prev => [...prev, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      })

      setError(null)
    }
  }

  // Remove an additional image
  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index))
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Trigger primary file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Trigger additional file input click
  const triggerAdditionalFileInput = () => {
    if (additionalFileInputRef.current) {
      additionalFileInputRef.current.click()
    }
  }

  // Check Cloudinary configuration
  const checkConfig = async () => {
    setIsConfigChecking(true)
    setConfigError(null)

    try {
      const result = await checkCloudinaryConfig()
      if (!result.configured) {
        setConfigError("Cloudinary is not properly configured. Please contact the administrator.")
      } else {
        toast({
          title: "Cloudinary Check Passed",
          description: "Cloudinary is correctly configured for uploads."
        })
      }
    } catch (error: any) {
      setConfigError(`Configuration check failed: ${error.message || 'Unknown error'}`)
    } finally {
      setIsConfigChecking(false)
    }
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    // Validation
    if (!vendor || !vendor.id) {
      setError("Vendor information is missing. Please log in again.")
      setIsSubmitting(false)
      return
    }

    if (!primaryImage) {
      setError("Please upload a primary product image")
      setIsSubmitting(false)
      return
    }

    if (selectedPincodes.length === 0) {
      setError("Please select at least one delivery area (pincode)")
      setIsSubmitting(false)
      return
    }

    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      setError("Cloudinary is not properly configured. Please contact the administrator.")
      setIsSubmitting(false)
      return
    }

    try {
      // 1. Upload primary image to Cloudinary
      setUploadProgress(10)
      const primaryImageResult = await uploadProductImage(primaryImage, vendor.id)

      if (!primaryImageResult.success || !primaryImageResult.url) {
        throw new Error(primaryImageResult.errorMessage || "Failed to upload primary product image")
      }

      setUploadProgress(30)

      // 2. Upload additional images if any
      let additionalImageResults: any[] = []
      if (additionalImages.length > 0) {
        const multipleUploadResult = await uploadMultipleProductImages(
          additionalImages,
          vendor.id,
          (progress) => {
            // Scale progress from 30-60%
            setUploadProgress(30 + (progress * 0.3))
          }
        )

        additionalImageResults = multipleUploadResult.results

        if (!multipleUploadResult.success) {
          console.warn("Some additional images failed to upload", multipleUploadResult)
        }
      }

      setUploadProgress(60)

      // 3. Prepare additional image URLs and public_ids
      const additionalImagesData = additionalImageResults
        .filter(result => result.success)
        .map(result => ({
          url: result.url,
          public_id: result.public_id,
          path: result.public_id // Include path for backward compatibility
        }))

      // 4. Add product to Firestore
      const newProduct = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        mrp: parseFloat(formData.mrp),
        stock: parseInt(formData.stock),
        unit: formData.unit,
        image: primaryImageResult.url,
        imagePublicId: primaryImageResult.public_id,
        additionalImages: additionalImagesData,
        vendorId: vendor.id,
        pincodes: selectedPincodes,
        status: "active" as const,
      }

      setUploadProgress(80)
      const product = await addProduct(newProduct)
      setUploadProgress(100)

      // 5. Show success message and redirect
      toast({
        title: "Product Added",
        description: "Your product has been added successfully",
      })

      // Redirect to products page
      router.push("/vendor/products")
    } catch (error: any) {
      console.error("Error adding product:", error)

      let errorMessage = error.message || "Failed to add product. Please try again."

      // Check if it might be a configuration issue
      if (errorMessage.includes('configuration') ||
        errorMessage.includes('network') ||
        errorMessage.includes('access')) {
        errorMessage += ". This might be due to Cloudinary configuration issues. Please try again or contact support."
      }

      setError(errorMessage)
      setIsSubmitting(false)
    }
  }

  // Get vendor pincodes from profile
  const vendorPincodes = vendor?.pincodes || []

  // If no vendor data, show loading
  if (!vendor) {
    return <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>
  }

  // If vendor has no delivery areas selected, show a message
  if (vendorPincodes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Add Product</h1>
        </div>

        <Card className="md:max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Delivery Areas Required</CardTitle>
            <CardDescription>
              You need to set up your delivery areas before adding products
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive" className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No delivery areas configured</AlertTitle>
              <AlertDescription>
                Before adding products, you need to configure which pincodes you can deliver to. This is required so customers know where your products are available.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <Button asChild>
                <a href="/vendor/profile/pincodes">Configure Delivery Areas</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add Product</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {configError && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{configError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Enter the basic details of your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
              <CardDescription>Set the price and manage inventory.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="mrp">MRP (₹)</Label>
                <Input
                  id="mrp"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.mrp}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="unit">Unit (e.g., kg, pcs, dozen)</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Upload a primary image (required) and up to 2 additional images (optional).
                Max size: 5MB per image.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Image Section */}
              <div>
                <Label className="block mb-2 font-medium">Primary Image (Required)</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                  {primaryImagePreview ? (
                    <div className="relative h-48 w-48 mb-4">
                      <Image
                        src={primaryImagePreview}
                        alt="Primary product preview"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full flex flex-col items-center justify-center bg-gray-50 rounded-md">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-500">Click to upload primary product image</p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePrimaryImageChange}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileInput}
                  >
                    {primaryImagePreview ? "Change Primary Image" : "Upload Primary Image"}
                  </Button>
                </div>
              </div>

              {/* Additional Images Section */}
              <div>
                <Label className="block mb-2 font-medium">Additional Images (Optional, max 2)</Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Display additional image previews */}
                  {additionalImagePreviews.map((preview, index) => (
                    <div key={index} className="relative border rounded-md p-2">
                      <div className="relative h-32 w-full">
                        <Image
                          src={preview}
                          alt={`Additional image ${index + 1}`}
                          fill
                          className="object-contain rounded-md"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm text-red-500 hover:text-red-700"
                        onClick={() => removeAdditionalImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Add more images button if less than 2 */}
                  {additionalImagePreviews.length < 2 && (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center p-4 h-32 cursor-pointer hover:bg-gray-50"
                      onClick={triggerAdditionalFileInput}
                    >
                      <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Add image</p>
                    </div>
                  )}
                </div>

                <input
                  ref={additionalFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleAdditionalImagesChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>
                Select the areas where this product will be available for delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {vendorPincodes.map((pincode) => (
                  <div key={pincode} className="flex items-center space-x-2 p-2 border rounded-md">
                    <Checkbox
                      id={`pincode-${pincode}`}
                      checked={selectedPincodes.includes(pincode)}
                      onCheckedChange={() => handlePincodeChange(pincode)}
                    />
                    <Label
                      htmlFor={`pincode-${pincode}`}
                      className="cursor-pointer text-sm"
                    >
                      {pincode}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedPincodes.length === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  * You must select at least one delivery area
                </p>
              )}
            </CardContent>
          </Card>

          <div className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600"
              disabled={isSubmitting || selectedPincodes.length === 0 || !primaryImage}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : "Saving..."}
                </div>
              ) : (
                "Save Product"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
