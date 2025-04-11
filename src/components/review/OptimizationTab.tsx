
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SeverityBadge from "./SeverityBadge";

interface OptimizationItem {
  id?: number;
  line: number;
  message: string;
  severity: string;
  original_code?: string;
  optimized_code?: string;
  explanation?: string;
}

interface OptimizationTabProps {
  optimizations: OptimizationItem[];
}

const OptimizationTab: React.FC<OptimizationTabProps> = ({ optimizations }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          Performance Optimization
        </CardTitle>
        <CardDescription>
          Recommendations to improve code efficiency with optimized code samples
        </CardDescription>
      </CardHeader>
      <CardContent>
        {optimizations.length > 0 ? (
          <div className="space-y-4">
            {optimizations.map((optItem) => (
              <div key={optItem.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <Zap className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Line {optItem.line}</p>
                      <p className="text-sm">{optItem.message}</p>
                    </div>
                  </div>
                  <SeverityBadge severity={optItem.severity} />
                </div>

                {(optItem.original_code || optItem.optimized_code) && (
                  <Accordion type="single" collapsible className="mt-4">
                    <AccordionItem value="code-sample">
                      <AccordionTrigger className="text-sm font-medium">
                        View Code Sample
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          {optItem.original_code && (
                            <div>
                              <p className="text-xs font-medium mb-1">Original Code:</p>
                              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                                {optItem.original_code}
                              </pre>
                            </div>
                          )}

                          {optItem.optimized_code && (
                            <div>
                              <p className="text-xs font-medium mb-1">Optimized Code:</p>
                              <pre className="bg-blue-50 dark:bg-blue-950 p-3 rounded text-xs overflow-x-auto">
                                {optItem.optimized_code}
                              </pre>
                            </div>
                          )}

                          {optItem.explanation && (
                            <div>
                              <p className="text-xs font-medium mb-1">Explanation:</p>
                              <p className="text-xs">{optItem.explanation}</p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No optimization opportunities identified for this code.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizationTab;
