import { getAuth } from "./firebase-client"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut 
} from "firebase/auth"
import { db } from "./config"
import { doc, getDoc } from "firebase/firestore"

// Sign in with email and password specific for vendors
export const signInVendor = async (email: string, password: string) => {
  try {
    const auth = getAuth()
    if (!auth) {
      console.error("Firebase auth not initialized")
      return { 
        success: false, 
        error: new Error("Firebase authentication not initialized. Please check your Firebase configuration.") 
      }
    }

    // For development without Firebase, allow a test account
    if (process.env.NODE_ENV === 'development' && email === 'test@example.com' && password === 'password') {
      console.log('Using test vendor account in development mode')
      // Return a successful login with test data
      return { 
        success: true, 
        user: { uid: 'test-vendor-id' },
        vendorData: {
          id: 'test-vendor-id',
          name: 'Test Vendor',
          email: 'test@example.com',
          phone: '1234567890',
          address: 'Test Address',
          pincode: '123456',
          isOpen: true,
          status: 'active'
        }
      }
    }

    // Only attempt Firebase auth if we're not using the test account
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    // Check if user has vendor role
    try {
      const userDoc = await getDoc(doc(db, "vendors", userCredential.user.uid))
      
      if (!userDoc.exists()) {
        // Sign out if not a vendor
        await firebaseSignOut(auth)
        return { 
          success: false, 
          error: new Error("Account exists but not registered as vendor") 
        }
      }
      
      const vendorData = userDoc.data()
      
      // Check if vendor account is active
      if (vendorData.status !== "active") {
        await firebaseSignOut(auth)
        return { 
          success: false, 
          error: new Error(`Vendor account ${vendorData.status}. Please contact admin.`) 
        }
      }
      
      return { 
        success: true, 
        user: userCredential.user,
        vendorData: {
          id: userDoc.id,
          ...vendorData
        }
      }
    } catch (dbError) {
      console.error("Error accessing Firestore:", dbError)
      return { 
        success: false, 
        error: new Error("Error verifying vendor status. Please try again later.") 
      }
    }
  } catch (error: any) {
    console.error("Error signing in vendor:", error)
    
    // Provide more helpful error messages
    let errorMessage = "Failed to sign in"
    
    if (error.code === 'auth/invalid-credential') {
      errorMessage = "Invalid email or password"
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = "No account found with this email"
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = "Incorrect password"
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = "Too many unsuccessful login attempts. Please try again later."
    } else if (error.code === 'auth/invalid-api-key') {
      errorMessage = "Firebase configuration error. Please contact support."
    }
    
    return { 
      success: false, 
      error: new Error(errorMessage) 
    }
  }
}

// Sign out vendor
export const signOutVendor = async () => {
  try {
    const auth = getAuth()
    if (!auth) {
      return { 
        success: false, 
        error: new Error("Firebase authentication not initialized") 
      }
    }

    await firebaseSignOut(auth)
    return { success: true }
  } catch (error: any) {
    console.error("Error signing out vendor:", error)
    return { 
      success: false, 
      error: new Error(error.message || "Failed to sign out") 
    }
  }
}

// Get current vendor data
export const getCurrentVendorData = async () => {
  try {
    const auth = getAuth()
    if (!auth || !auth.currentUser) {
      return { success: false, error: new Error("No authenticated vendor") }
    }

    // For development without Firebase, return test data
    if (process.env.NODE_ENV === 'development' && auth.currentUser.uid === 'test-vendor-id') {
      return { 
        success: true, 
        vendorData: {
          id: 'test-vendor-id',
          name: 'Test Vendor',
          email: 'test@example.com',
          phone: '1234567890',
          address: 'Test Address',
          pincode: '123456',
          isOpen: true,
          status: 'active'
        }
      }
    }

    try {
      const vendorDoc = await getDoc(doc(db, "vendors", auth.currentUser.uid))
      
      if (!vendorDoc.exists()) {
        return { success: false, error: new Error("Vendor data not found") }
      }
      
      return { 
        success: true, 
        vendorData: {
          id: vendorDoc.id,
          ...vendorDoc.data()
        }
      }
    } catch (dbError) {
      console.error("Error accessing Firestore:", dbError)
      return { 
        success: false, 
        error: new Error("Error accessing vendor data. Please try again later.") 
      }
    }
  } catch (error: any) {
    console.error("Error getting vendor data:", error)
    return { 
      success: false, 
      error: new Error(error.message || "Failed to get vendor data") 
    }
  }
} 