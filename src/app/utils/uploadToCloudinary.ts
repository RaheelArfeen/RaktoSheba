import cloudinary from '../../config/cloudinary';

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
  publicId?: string,
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `raktosheba/${folder}`, public_id: publicId, resource_type: 'auto' },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Cloudinary upload failed'));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );

    stream.end(buffer);
  });
};
