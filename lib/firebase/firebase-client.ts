"use client"

// This file handles Firebase initialization on the client side only
import { initializeApp } from "firebase/app"
import { getAuth as _getAuth } from "firebase/auth"
import { getFirestore as _getFirestore } from "firebase/firestore"
import { getStorage as _getStorage } from "firebase/storage"

// Track initialization status
let isFirebaseInitialized = false
let isAuthInitialized = false
let firebaseApp: any
let auth: any
let db: any
let storage: any

// Helper to check environment variables
const getEnvOrFallback = (key: string, fallback: string = "") => {
  const value = process.env[key]
  if (!value && process.env.NODE_ENV === "development") {
    console.warn(`Missing environment variable: ${key}, using fallback value`)
    
    // Default development fallback values for Firebase config
    const devFallbacks: Record<string, string> = {
      NEXT_PUBLIC_FIREBASE_API_KEY: "test-api-key-for-development",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "test-project.firebaseapp.com",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "test-project",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "test-project.appspot.com",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "123456789",
      NEXT_PUBLIC_FIREBASE_APP_ID: "1:123456789:web:abcdefghijklmnop",
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-ABCDEFGHIJ",
    }
    
    return devFallbacks[key] || fallback
  }
  return value || ""
}

// Check if Firebase config is valid
const isConfigValid = (config: any) => {
  return (
    config.apiKey && 
    config.apiKey !== "" && 
    config.projectId && 
    config.projectId !== ""
  )
}

// Function to initialize Firebase App only
export function initializeFirebaseApp() {
  // Only initialize once and only on the client side
  if (isFirebaseInitialized || typeof window === "undefined") {
    return firebaseApp
  }

  try {
    // Firebase configuration
    const firebaseConfig = {
      apiKey: getEnvOrFallback("NEXT_PUBLIC_FIREBASE_API_KEY"),
      authDomain: getEnvOrFallback("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
      projectId: getEnvOrFallback("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
      storageBucket: getEnvOrFallback("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
      messagingSenderId: getEnvOrFallback("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
      appId: getEnvOrFallback("NEXT_PUBLIC_FIREBASE_APP_ID"),
      measurementId: getEnvOrFallback("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"),
    }

    // Check if config is valid before initializing
    if (!isConfigValid(firebaseConfig)) {
      console.error(
        "Firebase configuration is invalid. Please check your environment variables or .env.local file. " +
        "You need to set NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, " +
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID, etc. Using test account only."
      )
      
      // In development, we can still use the test account without Firebase
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode detected. Test accounts will work without Firebase.")
      }
      
      return null
    }

    // Initialize Firebase app
    firebaseApp = initializeApp(firebaseConfig)
    isFirebaseInitialized = true
    console.log("Firebase App initialized successfully")

    return firebaseApp
  } catch (error) {
    console.error("Error initializing Firebase App:", error)
    isFirebaseInitialized = false
    return null
  }
}

// Function to initialize Firebase Auth
export function initializeFirebaseAuth() {
  // Only initialize once, only on the client side, and only if Firebase App is initialized
  if (isAuthInitialized || typeof window === "undefined" || !isFirebaseInitialized || !firebaseApp) {
    return auth
  }

  try {
    auth = _getAuth(firebaseApp)
    isAuthInitialized = true
    console.log("Firebase Auth initialized successfully")
    return auth
  } catch (error) {
    console.error("Error initializing Firebase Auth:", error)
    isAuthInitialized = false
    auth = { currentUser: null }
    return auth
  }
}

// Function to initialize Firebase Firestore
export function initializeFirebaseFirestore() {
  if (typeof window === "undefined" || !isFirebaseInitialized || !firebaseApp) {
    return null
  }

  try {
    db = _getFirestore(firebaseApp)
    console.log("Firebase Firestore initialized successfully")
    return db
  } catch (error) {
    console.error("Error initializing Firebase Firestore:", error)
    db = { collection: () => ({}) }
    return db
  }
}

// Function to initialize Firebase Storage
export function initializeFirebaseStorage() {
  if (typeof window === "undefined" || !isFirebaseInitialized || !firebaseApp) {
    return null
  }

  try {
    storage = _getStorage(firebaseApp)
    console.log("Firebase Storage initialized successfully")
    return storage
  } catch (error) {
    console.error("Error initializing Firebase Storage:", error)
    storage = {}
    return storage
  }
}

// Function to get Firebase Auth (will initialize if needed)
export function getAuth() {
  if (!auth) {
    console.log("Creating dummy auth for development mode")
    auth = { currentUser: null }
  }
  return auth
}

// Function to get Firebase Firestore (will initialize if needed)
export function getFirestore() {
  if (!db) {
    db = { collection: () => ({}) }
  }
  return db
}

// Function to get Firebase Storage (will initialize if needed)
export function getStorage() {
  if (!storage) {
    storage = {}
  }
  return storage
}

// Initialize Firebase App immediately but only on client side
if (typeof window !== "undefined") {
  const app = initializeFirebaseApp()
  
  // Only proceed with other initializations if the app was initialized successfully
  if (app) {
    // Wait a bit before initializing Auth to ensure App is fully initialized
    setTimeout(() => {
      initializeFirebaseAuth()
      initializeFirebaseFirestore()
      initializeFirebaseStorage()
    }, 1000)
  } else {
    // Set fallback values to prevent errors
    console.log("Using fallback Firebase objects for development")
    auth = { currentUser: null }
    db = { collection: () => ({}) }
    storage = {}
  }
}

export { firebaseApp, auth, db, storage, isFirebaseInitialized, isAuthInitialized }
