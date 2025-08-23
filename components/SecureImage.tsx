'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SecureImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
}

export default function SecureImage({
  src,
  alt,
  width = 300,
  height = 450,
  className = '',
  fallbackSrc = '/images/placeholder.svg'
}: SecureImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // Si l'image est une URL externe, l'afficher directement
  if (src.startsWith('http')) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        unoptimized
      />
    );
  }

  // Pour les images locales, utiliser l'API sécurisée
  const secureSrc = src.startsWith('/api/secure-media/') 
    ? src 
    : `/api/secure-media/${src}`;

  return (
    <Image
      src={secureSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized
    />
  );
}
