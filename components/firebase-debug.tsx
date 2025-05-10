"use client"

import { useFirebase } from "@/lib/context/firebase-provider"

export default function FirebaseDebug() {
  const { isFirebaseInitialized, isAuthInitialized, isLoading } = useFirebase()

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white p-2 text-xs font-mono z-50">
      <div>Firebase App: {isFirebaseInitialized ? "✅" : "❌"}</div>
      <div>Firebase Auth: {isAuthInitialized ? "✅" : "❌"}</div>
      <div>Loading: {isLoading ? "⏳" : "✅"}</div>
    </div>
  )
}
