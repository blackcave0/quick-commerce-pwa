# Firebase Configuration Guide

## Error: Firebase: Error (auth/invalid-api-key)

If you're seeing this error, it means your Firebase configuration is missing or invalid. Follow these steps to fix it:

## Step 1: Create a `.env.local` file

Create a file named `.env.local` in the root of your project with the following content:

```
# Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
```

## Step 2: Get your Firebase configuration values

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on the gear icon (⚙️) next to "Project Overview" and select "Project settings"
4. Scroll down to the "Your apps" section
5. If you haven't already added a web app, click on the web icon (</>) to add one
6. Once added, you'll see a `firebaseConfig` object with all the values you need

## Step 3: Replace the placeholder values in `.env.local`

Replace all the `your_xxx_here` values in the `.env.local` file with the actual values from your Firebase configuration.

## Step 4: Restart your development server

After creating or updating the `.env.local` file, you need to restart your development server:

```bash
npm run dev
```

## Advanced: Setting up Firebase Cloud Messaging (FCM)

If you want to use push notifications via FCM, you'll also need to:

1. Go to the Firebase Console > Project Settings > Cloud Messaging
2. Generate a VAPID key pair (if not already done)
3. Copy the "Web Push certificate" (which is your VAPID key)
4. Add it to your `.env.local` file as `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

## Troubleshooting

- Make sure there are no spaces around the equal signs in your `.env.local` file
- Don't use quotes around the values
- Ensure that you have restarted your development server after creating the file
- If you're deploying to a hosting service like Vercel, make sure to add these environment variables in your project settings 