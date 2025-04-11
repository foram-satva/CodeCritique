
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, Calendar, ChevronRight, FileCode, Loader2, Search, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReviewHistory } from "@/services/review-service";
import { useToast } from "@/hooks/use-toast";

const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const { data: reviewHistory, isLoading } = useQuery({
    queryKey: ['reviewHistory'],
    queryFn: getReviewHistory,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load review history",
          variant: "destructive",
        });
      }
    }
  });
  
  const filteredHistory = reviewHistory?.filter(item => 
    item.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <DashboardLayout title="Review History">
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle>Code Review History</CardTitle>
                <CardDescription>
                  View and search your past code reviews
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button asChild>
                  <Link to="/review">New Review</Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.length === 0 && (
                  <div className="py-8 text-center">
                    <FileCode className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">
                      {searchTerm ? "No matching reviews found" : "No reviews found"}
                    </p>
                  </div>
                )}

                {filteredHistory.map((review) => (
                  <div 
                    key={review.id} 
                    className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileCode className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{review.file_name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(review.review_date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>{review.bugs}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Zap className="h-4 w-4 text-blue-500" />
                          <span>{review.optimizations}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <FileCode className="h-4 w-4 text-amber-500" />
                          <span>{review.suggestions}</span>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/history/${review.id}`}>
                          View <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
