
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileCode, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

// Common programming languages
export const programmingLanguages = [
  { value: "auto", label: "Auto Detect" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "php", label: "PHP" },
  { value: "go", label: "Go" },
  { value: "ruby", label: "Ruby" },
  { value: "rust", label: "Rust" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "sql", label: "SQL" },
];

interface CodeSubmissionFormProps {
  code: string;
  fileName: string;
  language: string;
  isSubmitting: boolean;
  onCodeChange: (value: string) => void;
  onFileNameChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onSubmit: () => void;
}

const CodeSubmissionForm: React.FC<CodeSubmissionFormProps> = ({
  code,
  fileName,
  language,
  isSubmitting,
  onCodeChange,
  onFileNameChange,
  onLanguageChange,
  onSubmit,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fileName" className="block text-sm font-medium mb-1">
            File Name
          </label>
          <Input
            id="fileName"
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            className="max-w-full"
          />
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium mb-1">
            Language
          </label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Programming Languages</SelectLabel>
                {programmingLanguages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Textarea
        className="font-mono h-64 code-editor"
        placeholder="// Paste your code here..."
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        spellCheck="false"
      />
      <Button onClick={onSubmit} disabled={isSubmitting || !code.trim()}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <FileCode className="mr-2 h-4 w-4" />
            Submit for Review
          </>
        )}
      </Button>
    </div>
  );
};

export default CodeSubmissionForm;
