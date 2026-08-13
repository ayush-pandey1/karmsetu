import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dya4imi67',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '731558185296553',
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ success: false, message: "No image data provided" }, { status: 400 });
    }

    let uploadResponse;
    if (process.env.CLOUDINARY_API_SECRET) {
      uploadResponse = await cloudinary.uploader.upload(image, {
        upload_preset: 'karmsetu',
      });
    } else {
      uploadResponse = await cloudinary.uploader.unsigned_upload(image, 'karmsetu');
    }

    console.log(uploadResponse.secure_url, "Image URL from API to upload image to Cloudinary");
    return NextResponse.json({ success: true, url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    // Fallback attempt to unsigned_upload if signed attempt failed
    try {
      const fallbackResponse = await cloudinary.uploader.unsigned_upload(image, 'karmsetu');
      return NextResponse.json({ success: true, url: fallbackResponse.secure_url });
    } catch (fallbackError) {
      console.error("Fallback upload also failed:", fallbackError.message);
      return NextResponse.json({ success: false, message: error.message || fallbackError.message }, { status: 500 });
    }
  }
}
