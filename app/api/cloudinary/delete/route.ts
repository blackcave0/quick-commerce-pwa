import { NextResponse } from 'next/server';
import { cloudinaryConfig } from '@/lib/cloudinary/config';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { public_id } = body;

    if (!public_id) {
      return NextResponse.json(
        { success: false, message: 'Public ID is required' },
        { status: 400 }
      );
    }

    // Check if Cloudinary is configured
    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey || !cloudinaryConfig.apiSecret) {
      return NextResponse.json(
        { success: false, message: 'Cloudinary is not properly configured' },
        { status: 500 }
      );
    }

    // Create timestamp for the signature
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Create signature string
    const signatureString = `public_id=${public_id}&timestamp=${timestamp}${cloudinaryConfig.apiSecret}`;
    
    // Generate SHA-1 signature
    const signature = crypto
      .createHash('sha1')
      .update(signatureString)
      .digest('hex');

    // Make request to Cloudinary API
    const formData = new FormData();
    formData.append('public_id', public_id);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', cloudinaryConfig.apiKey);
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (data.result !== 'ok') {
      return NextResponse.json(
        { success: false, message: data.result || 'Failed to delete image' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting image from Cloudinary:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 