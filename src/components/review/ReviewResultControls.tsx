
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ReviewResultControlsProps {
  onNewReview: () => void;
  onSaveAnalysis: () => void;
  isSavingAnalysis: boolean;
}

const ReviewResultControls: React.FC<ReviewResultControlsProps> = ({
  onNewReview,
  onSaveAnalysis,
  isSavingAnalysis,
}) => {
  return (
    <div className="flex gap-4 mb-6">
      <Button variant="outline" onClick={onNewReview}>
        New Review
      </Button>
      <Button variant="secondary" onClick={onSaveAnalysis} disabled={isSavingAnalysis}>
        {isSavingAnalysis ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Analysis'
        )}
      </Button>
    </div>
  );
};

export default ReviewResultControls;
