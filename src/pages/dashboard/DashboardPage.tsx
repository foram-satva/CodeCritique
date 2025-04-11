import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getRecentReviews } from "@/services/dashboard-service";
import { Loader2 } from "lucide-react";

// Icon mapping for dynamic icon rendering
import { FileCode, GitPullRequest, Users, Zap, History, Home, LogOut, Moon, Settings, Sun, User } from "lucide-react";

const iconMap = {
  GitPullRequest: GitPullRequest,
  FileCode: FileCode,
  Zap: Zap,
  Users: Users,
  History: History,
  Home: Home,
  Settings: Settings,
  User: User,
};

const DashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch dashboard statistics
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        });
      }
    }
  });

  // Fetch recent reviews
  const { data: recentReviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['recentReviews'],
    queryFn: getRecentReviews,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load recent reviews",
          variant: "destructive",
        });
      }
    }
  });

  // Fallback stats if data isn't available yet
  const defaultStats = [
    {
      id: "1",
      title: "Total Reviews",
      value: "0",
      icon_name: "GitPullRequest",
      description: "Code reviews completed",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      id: "2",
      title: "Latest Review",
      value: "None",
      icon_name: "FileCode",
      description: "Last code analysis",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      id: "3",
      title: "Improvements",
      value: "0",
      icon_name: "Zap",
      description: "Optimizations made",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      id: "4",
      title: "Plan",
      value: "Free",
      icon_name: "Users",
      description: "Current subscription",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
  ];

  const displayStats = stats && stats.length > 0 ? stats : defaultStats;
  
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Welcome back, {user?.name}!</CardTitle>
            <CardDescription>
              Here's an overview of your code review activity and analytics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/review">
                <Button className="w-full sm:w-auto">
                  New Code Review
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="outline" className="w-full sm:w-auto">
                  View History
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoadingStats ? (
            <div className="col-span-4 flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            displayStats.map((stat) => {
              const IconComponent = iconMap[stat.icon_name as keyof typeof iconMap] || GitPullRequest;
              return (
                <Card key={stat.id} className="animate-fade-in">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-md ${stat.bgColor}`}>
                        <IconComponent className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Code Reviews</CardTitle>
            <CardDescription>
              Your latest code analysis results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingReviews ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {recentReviews && recentReviews.length > 0 ? (
                  recentReviews.map((review) => (
                    <div key={review.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{review.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          {review.issues} issues found
                        </div>
                        <Link to={`/history/${review.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No recent reviews found</p>
                    <Button asChild className="mt-4">
                      <Link to="/review">Start your first review</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
