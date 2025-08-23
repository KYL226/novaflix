'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      <span className="ml-3 text-white text-lg">Chargement...</span>
    </div>
  );
}
