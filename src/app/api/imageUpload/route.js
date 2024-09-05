import cloudinary from '@/lib/cloudinary';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
        console.log("API request received in the Backend to upload image to cloudinary")
      const { image } = req.body;

      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'profile_pics', // Optional folder to organize images
        use_filename: true,
        unique_filename: false,
      });

      console.log("Image uploaded image to cloudinary from Backend");
      console.log(uploadResponse.secure_url, "From Backend API")
      return res.status(200).json({
        success: true,
        url: uploadResponse.secure_url,
      });
    } catch (error) {
        console.log(error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
