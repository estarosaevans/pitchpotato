import { PresentationForm } from "@/components/PresentationForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AI PowerPoint Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create professional presentations in minutes using AI. Just provide your topic
            and let our AI do the heavy lifting.
          </p>
        </div>
        
        <div className="flex justify-center">
          <PresentationForm />
        </div>
      </div>
    </div>
  );
};

export default Index;