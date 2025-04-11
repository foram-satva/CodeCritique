
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCodeReview } from "@/hooks/useCodeReview";
import CodeSubmissionForm from "@/components/review/CodeSubmissionForm";
import ReviewResults from "@/components/review/ReviewResults";

const ReviewPage = () => {
  const {
    code,
    setCode,
    fileName,
    setFileName,
    language,
    setLanguage,
    isSubmitting,
    results,
    handleSubmit,
    handleSaveAnalysis,
    resetReview,
    isSavingAnalysis,
  } = useCodeReview();

  return (
    <DashboardLayout title="Code Review">
      <div className="space-y-6">
        {!results ? (
          <Card>
            <CardHeader>
              <CardTitle>Submit Code for Review</CardTitle>
              <CardDescription>
                Paste your code below to get AI-powered insights and optimization suggestions for any programming language.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeSubmissionForm
                code={code}
                fileName={fileName}
                language={language}
                isSubmitting={isSubmitting}
                onCodeChange={setCode}
                onFileNameChange={setFileName}
                onLanguageChange={setLanguage}
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>
        ) : (
          <ReviewResults
            results={results}
            code={code}
            onNewReview={resetReview}
            onSaveAnalysis={handleSaveAnalysis}
            isSavingAnalysis={isSavingAnalysis}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReviewPage;
