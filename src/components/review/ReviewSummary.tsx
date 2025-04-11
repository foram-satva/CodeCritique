
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ThumbsUp } from "lucide-react";

interface ReviewSummaryProps {
  score: number;
  strengths: string[];
  weaknesses: string[];
  detectedLanguage?: string;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  score,
  strengths,
  weaknesses,
  detectedLanguage,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ThumbsUp className="h-5 w-5 text-primary" />
          Code Analysis Summary
          {detectedLanguage && detectedLanguage !== "unknown" && (
            <span className="text-sm bg-primary/10 px-2 py-1 rounded-full text-primary">
              {detectedLanguage.charAt(0).toUpperCase() + detectedLanguage.slice(1)}
            </span>
          )}
        </CardTitle>
        <CardDescription>Overall assessment of your code quality</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32 rounded-full flex items-center justify-center bg-primary/10">
              <span className="text-3xl font-bold text-primary">{score}%</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {strengths.map((strength: string, idx: number) => (
                    <li key={idx} className="text-sm flex gap-2">
                      <ThumbsUp className="h-4 w-4 text-green-500 shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {weaknesses.map((weakness: string, idx: number) => (
                    <li key={idx} className="text-sm flex gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                      {weakness}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSummary;
