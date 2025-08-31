import MediaTest from '@/components/MediaTest';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Page de Test</h1>
          <p className="text-gray-400 text-lg">
            Testez les fonctionnalités de votre application NovaFlix
          </p>
        </div>
        
        <MediaTest />
      </div>
    </div>
  );
}
