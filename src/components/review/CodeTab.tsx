
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "lucide-react";

interface CodeTabProps {
  code: string;
}

const CodeTab: React.FC<CodeTabProps> = ({ code }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          Your Code
        </CardTitle>
        <CardDescription>Original code submitted for review</CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="bg-card p-4 rounded-lg overflow-auto border font-mono text-sm">{code}</pre>
      </CardContent>
    </Card>
  );
};

export default CodeTab;
