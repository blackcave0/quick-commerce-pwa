# Firebase Configuration Instructions

## Fix your .env.local file

Your current `.env.local` file is incomplete. Please update it with the following content:

```
# Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=test-api-key-for-development
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=test-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=test-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=test-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdefghijklmnop
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
```

These are dummy values that will allow the test account login to work in development mode.

## Steps to update your .env.local file:

1. Open your project folder at `D:/quick-commerce-pwa`
2. Open the `.env.local` file in a text editor
3. Replace the current content with the configuration above
4. Save the file
5. Restart your development server:
   ```
   npm run dev
   ```

## For production use:

For production, you should replace these dummy values with your actual Firebase project credentials from the Firebase Console. Follow the instructions in the FIREBASE_SETUP_GUIDE.md file to get your actual Firebase credentials.

## After updating:

- The test account (test@example.com/password) should work for development
- The "Firebase: Error (auth/invalid-api-key)" error should be resolved
- The vendor login and authentication should function correctly 