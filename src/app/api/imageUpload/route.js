import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { image } = await req.json();

    const uploadResponse = await cloudinary.uploader.upload(image, {
      upload_preset: 'karmsetu', 
    });
    console.log(uploadResponse.secure_url, "Image URL from API to upload image to CLoudinary");
    return NextResponse.json({ success: true, url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    return NextResponse.json({ success: false, message: error.message });
  }
}
