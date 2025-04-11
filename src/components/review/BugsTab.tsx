
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import SeverityBadge from "./SeverityBadge";

interface Bug {
  id?: number;
  line: number;
  message: string;
  severity: string;
}

interface BugsTabProps {
  bugs: Bug[];
}

const BugsTab: React.FC<BugsTabProps> = ({ bugs }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Bug Reports & Code Smells
        </CardTitle>
        <CardDescription>Potential issues and vulnerabilities in your code</CardDescription>
      </CardHeader>
      <CardContent>
        {bugs.length > 0 ? (
          <div className="space-y-4">
            {bugs.map((bug) => (
              <div key={bug.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Line {bug.line}</p>
                      <p className="text-sm">{bug.message}</p>
                    </div>
                  </div>
                  <SeverityBadge severity={bug.severity} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No bugs identified for this code.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default BugsTab;
