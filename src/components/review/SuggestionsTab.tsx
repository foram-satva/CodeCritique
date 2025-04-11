
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import SeverityBadge from "./SeverityBadge";

interface Suggestion {
  id?: number;
  line: number;
  message: string;
  severity: string;
}

interface SuggestionsTabProps {
  suggestions: Suggestion[];
}

const SuggestionsTab: React.FC<SuggestionsTabProps> = ({ suggestions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Detailed Suggestions
        </CardTitle>
        <CardDescription>Specific recommendations to improve your code</CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Line {suggestion.line}</p>
                      <p className="text-sm">{suggestion.message}</p>
                    </div>
                  </div>
                  <SeverityBadge severity={suggestion.severity} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No suggestions identified for this code.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestionsTab;
