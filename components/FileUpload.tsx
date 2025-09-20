'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, CheckCircle, AlertCircle, File, Image, Video } from 'lucide-react';

interface FileUploadProps {
  type: 'video' | 'image';
  onUploadSuccess: (fileUrl: string, fileName: string) => void;
  onUploadError: (error: string) => void;
  currentFile?: string;
  disabled?: boolean;
}

export default function FileUpload({ 
  type, 
  onUploadSuccess, 
  onUploadError, 
  currentFile,
  disabled = false 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialiser uploadedFile avec currentFile si fourni
  useEffect(() => {
    if (currentFile) {
      // Si currentFile est déjà une URL complète, l'utiliser directement
      if (currentFile.startsWith('/api/secure-media/')) {
        setUploadedFile(currentFile);
      } else {
        // Sinon, construire l'URL complète
        const fullUrl = type === 'video' 
          ? `/api/secure-media/videos/${currentFile}`
          : `/api/secure-media/images/${currentFile}`;
        setUploadedFile(fullUrl);
      }
    }
  }, [currentFile, type]);

  const handleFileSelect = async (file: File) => {
    if (disabled) return;

    // Vérifier le type de fichier
    const isValidType = type === 'video' 
      ? file.type.startsWith('video/')
      : file.type.startsWith('image/');

    if (!isValidType) {
      onUploadError(`Veuillez sélectionner un fichier ${type === 'video' ? 'vidéo' : 'image'} valide`);
      return;
    }

    // Vérifier la taille
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      onUploadError(`Fichier trop volumineux. Maximum: ${type === 'video' ? '100MB' : '10MB'}`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      // Simuler le progrès d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (data.success) {
        // Construire l'URL complète pour l'affichage
        const fullUrl = type === 'video' 
          ? `/api/secure-media/videos/${data.data.fileUrl}`
          : `/api/secure-media/images/${data.data.fileUrl}`;
        
        setUploadedFile(fullUrl);
        // Passer seulement le nom du fichier (sans le chemin complet)
        onUploadSuccess(data.data.fileUrl, data.data.fileName);
      } else {
        onUploadError(data.error || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      onUploadError('Erreur réseau lors de l\'upload');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        {type === 'video' ? 'Fichier Vidéo' : 'Image Poster'}
      </Label>
      
      {/* Zone d'upload */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${uploadedFile ? 'border-green-500 bg-green-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={type === 'video' ? 'video/*' : 'image/*'}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {isUploading ? (
          <div className="space-y-2">
            <div className="w-8 h-8 mx-auto">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-sm text-gray-600">Upload en cours...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">{uploadProgress}%</p>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-2">
            <CheckCircle className="w-8 h-8 mx-auto text-green-500" />
            <p className="text-sm text-green-600 font-medium">Fichier uploadé avec succès</p>
            <p className="text-xs text-gray-500 break-all">{uploadedFile}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Supprimer
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {type === 'video' ? (
              <Video className="w-8 h-8 mx-auto text-gray-400" />
            ) : (
              <Image className="w-8 h-8 mx-auto text-gray-400" />
            )}
            <div>
              <p className="text-sm text-gray-600">
                Cliquez pour sélectionner ou glissez-déposez votre fichier
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {type === 'video' 
                  ? 'Formats acceptés: MP4, AVI, MOV, WMV, MKV (max 100MB)'
                  : 'Formats acceptés: JPG, PNG, WebP (max 10MB)'
                }
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
            >
              <Upload className="w-4 h-4 mr-1" />
              Sélectionner un fichier
            </Button>
          </div>
        )}
      </div>

      {/* Aperçu de l'image uploadée */}
      {uploadedFile && type === 'image' && (
        <div className="mt-4">
          <Label className="text-sm font-medium mb-2 block">Aperçu:</Label>
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={uploadedFile}
              alt="Aperçu"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
