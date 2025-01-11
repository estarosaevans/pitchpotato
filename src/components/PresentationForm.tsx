import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { useToast } from "@/hooks/use-toast";
import pptxgen from "pptxgenjs";

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

  const generateSlideContent = async (topic: string, slideCount: number, keyPoints: string) => {
    const prompt = `Create a presentation about "${topic}" with ${slideCount} slides.${
      keyPoints ? `\nInclude these key points:\n${keyPoints}` : ""
    }

    Format the response as a JSON array where each object represents a slide with:
    - title: The slide title
    - content: Array of bullet points for the slide
    
    Make it engaging and informative.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${formData.apiKey}`,
        "HTTP-Referer": window.location.href,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to generate presentation");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const createPowerPoint = async (slideContent: string) => {
    try {
      // Parse the JSON string into an array of slides
      const slides = JSON.parse(slideContent);
      
      // Create a new PowerPoint presentation
      const pres = new pptxgen();

      // Set the presentation properties
      pres.author = "AI PowerPoint Generator";
      pres.title = formData.topic;

      // Create a title slide
      const titleSlide = pres.addSlide();
      titleSlide.addText(formData.topic, {
        x: 0.5,
        y: 0.4, // Using 0.4 instead of "40%" for proper typing
        w: "90%",
        fontSize: 44,
        bold: true,
        color: "363636",
        align: "center", // Use align property instead of x: "center"
      });

      // Add content slides
      slides.forEach((slide: { title: string; content: string[] }) => {
        const contentSlide = pres.addSlide();
        
        // Add slide title
        contentSlide.addText(slide.title, {
          x: 0.5,
          y: 0.5,
          w: "90%",
          fontSize: 32,
          bold: true,
          color: "363636",
        });

        // Convert string array to TextProps array for bullet points
        const bulletPoints = slide.content.map(point => ({
          text: point,
          bullet: true,
        }));

        // Add bullet points
        contentSlide.addText(bulletPoints, {
          x: 0.5,
          y: 1.5,
          w: "90%",
          fontSize: 18,
          color: "666666",
        });
      });

      // Save the presentation
      await pres.writeFile({ fileName: `${formData.topic.replace(/[^a-z0-9]/gi, '_')}.pptx` });
    } catch (error) {
      console.error("Error creating PowerPoint:", error);
      throw new Error("Failed to create PowerPoint file");
    }
  };

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
      setProgress(30);
      const slideContent = await generateSlideContent(
        formData.topic,
        parseInt(formData.slideCount),
        formData.keyPoints
      );
      
      setProgress(60);
      console.log("Generated content:", slideContent);
      
      // Create and download the PowerPoint file
      await createPowerPoint(slideContent);
      setProgress(100);
      
      toast({
        title: "Success!",
        description: "Your presentation has been generated and downloaded",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate presentation",
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