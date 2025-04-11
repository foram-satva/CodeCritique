
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateCodeReview } from "@/utils/ai-service";
import { ReviewResult } from "@/components/review/ReviewResults";
import { useMutation } from "@tanstack/react-query";
import { saveReview, OptimizationSample } from "@/services/review-service";
import { programmingLanguages } from "@/components/review/CodeSubmissionForm";

export const useCodeReview = () => {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<ReviewResult | null>(null);
  const [fileName, setFileName] = useState("code_sample");
  const [language, setLanguage] = useState("auto");

  const saveMutation = useMutation({
    mutationFn: (data: {
      fileName: string;
      bugs: number;
      optimizations: number;
      suggestions: number;
      language: string;
      optimizationSamples: OptimizationSample[];
    }) =>
      saveReview(
        data.fileName,
        data.bugs,
        data.optimizations,
        data.suggestions,
        data.language,
        data.optimizationSamples
      ),
    meta: {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Review saved successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to save review",
          variant: "destructive",
        });
      },
    },
  });

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to review.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      toast({
        title: "Processing",
        description: "Sending code to AI for review...",
      });

      const reviewResult = await generateCodeReview(code);

      console.log("Review result returned:", reviewResult);

      const processedResult: ReviewResult = {
        ...reviewResult,
        summary: reviewResult.summary || {
          score: 70,
          strengths: ["Code was reviewed"],
          weaknesses: ["Limited analysis available"],
        },
        suggestions: (reviewResult.suggestions || []).map((item, index) => ({
          ...item,
          id: item.id || index + 1,
        })),
        optimization: (reviewResult.optimization || []).map((item, index) => ({
          ...item,
          id: item.id || index + 1,
        })),
        bugs: (reviewResult.bugs || []).map((item, index) => ({
          ...item,
          id: item.id || index + 1,
        })),
      };

      // Update file extension based on detected language if auto was selected
      if (language === "auto" && reviewResult.detectedLanguage) {
        const extension = getFileExtension(reviewResult.detectedLanguage);
        if (extension) {
          setFileName((prev) => {
            const baseName = prev.split(".")[0] || "code_sample";
            return `${baseName}.${extension}`;
          });
        }
      }

      setResults(processedResult);
      toast({
        title: "Success",
        description: "Code review completed successfully.",
      });
    } catch (error) {
      console.error("Review error:", error);
      toast({
        title: "Error",
        description: "There was an error reviewing your code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);

    // Update file extension if not auto
    if (value !== "auto") {
      const extension = getFileExtension(value);
      if (extension) {
        setFileName((prev) => {
          const baseName = prev.split(".")[0] || "code_sample";
          return `${baseName}.${extension}`;
        });
      }
    }
  };

  const handleSaveAnalysis = () => {
    if (!results) return;

    // Extract optimization samples from the results
    const optimizationSamples: OptimizationSample[] = results.optimization
      .filter((opt) => opt.original_code && opt.optimized_code)
      .map((opt) => ({
        original_code: opt.original_code || "",
        optimized_code: opt.optimized_code || "",
        explanation: opt.explanation || "",
      }));

    saveMutation.mutate({
      fileName: fileName,
      bugs: results.bugs.length,
      optimizations: results.optimization.length,
      suggestions: results.suggestions.length,
      language: results.detectedLanguage || language,
      optimizationSamples: optimizationSamples,
    });
  };

  const resetReview = () => {
    setResults(null);
  };

  // Helper function to get file extension from language
  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      csharp: "cs",
      cpp: "cpp",
      php: "php",
      go: "go",
      ruby: "rb",
      rust: "rs",
      swift: "swift",
      kotlin: "kt",
      sql: "sql",
    };

    // Convert to lowercase and sanitize the detected language
    const sanitized = language.toLowerCase().trim();
    return extensions[sanitized] || "";
  };

  return {
    code,
    setCode,
    fileName,
    setFileName,
    language,
    setLanguage: handleLanguageChange,
    isSubmitting,
    results,
    handleSubmit,
    handleSaveAnalysis,
    resetReview,
    isSavingAnalysis: saveMutation.isPending,
  };
};
