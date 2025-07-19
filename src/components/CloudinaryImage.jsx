import React, { useState } from 'react';
import { Image, Transformation } from 'cloudinary-react';

const CloudinaryImage = ({
  publicId,
  src,
  alt = '',
  width = 'auto',
  height = 'auto',
  className = '',
  crop = 'fill',
  gravity = 'auto',
  quality = 'auto',
  fetchFormat = 'auto',
  fallback = null,
  ...props
}) => {
  const [error, setError] = useState(false);

  // If there's an error and we have a fallback, return the fallback
  if (error && fallback) {
    return <img src={fallback} alt={alt} className={className} />;
  }

  // If we have a direct image URL, use it
  if (src && !publicId) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setError(true)}
        {...props}
      />
    );
  }

  // If we have a Cloudinary public ID
  if (publicId) {
    console.log('Rendering Cloudinary Image with publicId:', publicId);
    console.log('Cloud Name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    
    return (
      <Image
        cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}
        publicId={publicId}
        alt={alt}
        className={className}
        loading="lazy"
        onError={(e) => {
          console.error('Cloudinary Image Error:', e);
          setError(true);
        }}
        onLoad={() => console.log('Image loaded successfully')}
        {...props}
      >
        <Transformation
          width={width}
          height={height}
          crop={crop}
          gravity={gravity}
          quality={quality}
          fetchFormat={fetchFormat}
        />
      </Image>
    );
  }

  // If no image is provided and no fallback, return null
  return null;
};

export default CloudinaryImage;
