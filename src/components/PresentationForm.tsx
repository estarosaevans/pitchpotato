import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { useToast } from "@/hooks/use-toast";

export const PresentationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    topic: "",
    slideCount: "5",
    keyPoints: "",
    apiKey: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.apiKey || !formData.topic) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(10);

    try {
      // Here we would make the API call to OpenRouter
      // For now, we'll just simulate progress
      setProgress(30);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(100);
      
      toast({
        title: "Success!",
        description: "Your presentation is ready for download",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate presentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl w-full">
      <div className="space-y-2">
        <label className="text-sm font-medium">OpenRouter API Key</label>
        <Input
          type="password"
          value={formData.apiKey}
          onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
          placeholder="Enter your OpenRouter API key"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Presentation Topic</label>
        <Textarea
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          placeholder="What would you like your presentation to be about?"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Number of Slides</label>
        <Input
          type="number"
          min="1"
          max="20"
          value={formData.slideCount}
          onChange={(e) => setFormData({ ...formData, slideCount: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Key Points (optional)</label>
        <Textarea
          value={formData.keyPoints}
          onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
          placeholder="Enter any specific points you'd like to include (one per line)"
        />
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">
            Generating your presentation...
          </p>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Generating..." : "Generate Presentation"}
      </Button>
    </form>
  );
};