import { Cloudinary } from 'cloudinary-core';

const cloudinaryCore = new Cloudinary({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  secure: true
});

export const getImageUrl = (publicId, options = {}) => {
  return cloudinaryCore.url(publicId, {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  });
};

export const getOptimizedImage = (publicId, width = 800, height = null) => {
  return cloudinaryCore.url(publicId, {
    width: width,
    height: height,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    fetch_format: 'auto'
  });
};
