'use client';

import { useState, useEffect } from 'react';

interface SecureBackgroundImageProps {
  src: string;
  className?: string;
  fallbackClassName?: string;
  children?: React.ReactNode;
}

export default function SecureBackgroundImage({ 
  src, 
  className = '', 
  fallbackClassName = 'bg-gradient-to-br from-gray-800 to-gray-900',
  children 
}: SecureBackgroundImageProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Construire l'URL de l'image de manière sécurisée
  const getSecureImageUrl = (imageSrc: string) => {
    if (imageSrc.startsWith('http')) {
      return imageSrc;
    }
    return `/api/secure-media/images/${imageSrc}`;
  };

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const secureUrl = getSecureImageUrl(src);
    setImageUrl(secureUrl);
    setIsLoading(false);
  }, [src]);

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Précharger l'image pour vérifier qu'elle existe
  useEffect(() => {
    if (!imageUrl || hasError) return;

    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
    img.src = imageUrl;
  }, [imageUrl, hasError]);

  if (isLoading) {
    return (
      <div className={`${className} ${fallbackClassName} flex items-center justify-center`}>
        <div className="animate-pulse bg-gray-700 rounded w-full h-full"></div>
        {children}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`${className} ${fallbackClassName} flex items-center justify-center`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {children}
    </div>
  );
}
