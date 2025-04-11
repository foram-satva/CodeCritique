
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Code, Lightbulb, ThumbsUp, Zap } from "lucide-react";
import ReviewSummary from "./ReviewSummary";
import SuggestionsTab from "./SuggestionsTab";
import OptimizationTab from "./OptimizationTab";
import BugsTab from "./BugsTab";
import CodeTab from "./CodeTab";
import ReviewResultControls from "./ReviewResultControls";
import { OptimizationSample } from "@/services/review-service";

export interface ReviewResult {
  summary: {
    score: number;
    strengths: string[];
    weaknesses: string[];
  };
  suggestions: Array<{
    id?: number;
    line: number;
    message: string;
    severity: string;
  }>;
  optimization: Array<{
    id?: number;
    line: number;
    message: string;
    severity: string;
    original_code?: string;
    optimized_code?: string;
    explanation?: string;
  }>;
  bugs: Array<{
    id?: number;
    line: number;
    message: string;
    severity: string;
  }>;
  detectedLanguage?: string;
  fullReview: string;
}

interface ReviewResultsProps {
  results: ReviewResult;
  code: string;
  onNewReview: () => void;
  onSaveAnalysis: () => void;
  isSavingAnalysis: boolean;
}

const ReviewResults: React.FC<ReviewResultsProps> = ({
  results,
  code,
  onNewReview,
  onSaveAnalysis,
  isSavingAnalysis,
}) => {
  return (
    <div className="space-y-6">
      <ReviewResultControls
        onNewReview={onNewReview}
        onSaveAnalysis={onSaveAnalysis}
        isSavingAnalysis={isSavingAnalysis}
      />

      <Tabs defaultValue="summary">
        <TabsList className="mb-6">
          <TabsTrigger value="summary">
            <ThumbsUp className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            <Lightbulb className="h-4 w-4 mr-2" />
            Suggestions
          </TabsTrigger>
          <TabsTrigger value="optimization">
            <Zap className="h-4 w-4 mr-2" />
            Optimization
          </TabsTrigger>
          <TabsTrigger value="bugs">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Bug Report
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="h-4 w-4 mr-2" />
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <ReviewSummary
            score={results.summary.score}
            strengths={results.summary.strengths}
            weaknesses={results.summary.weaknesses}
            detectedLanguage={results.detectedLanguage}
          />
        </TabsContent>

        <TabsContent value="suggestions">
          <SuggestionsTab suggestions={results.suggestions} />
        </TabsContent>

        <TabsContent value="optimization">
          <OptimizationTab optimizations={results.optimization} />
        </TabsContent>

        <TabsContent value="bugs">
          <BugsTab bugs={results.bugs} />
        </TabsContent>

        <TabsContent value="code">
          <CodeTab code={code} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewResults;
