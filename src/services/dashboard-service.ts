
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStat {
  id: string;
  title: string;
  value: string;
  icon_name: string;
  description: string;
  color: string;
  bgColor: string;
}

export interface RecentReview {
  id: string;
  name: string;
  date: string;
  status: string;
  issues: number;
}

export const getDashboardStats = async (): Promise<DashboardStat[]> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return [];
    }

    // Get review history data for calculations
    const { data: reviews, error: reviewsError } = await supabase
      .from('review_history')
      .select('*')
      .eq('user_id', user.id);

    if (reviewsError) {
      console.error('Error fetching review history for stats:', reviewsError);
      return [];
    }

    // Calculate statistics
    const totalReviews = reviews?.length || 0;
    const latestReview = reviews && reviews.length > 0 
      ? reviews.sort((a, b) => new Date(b.review_date).getTime() - new Date(a.review_date).getTime())[0].file_name 
      : 'None';
    const totalOptimizations = reviews?.reduce((sum, review) => sum + (review.optimizations || 0), 0) || 0;

    // Create stats array
    const calculatedStats: DashboardStat[] = [
      {
        id: "1",
        title: "Total Reviews",
        value: totalReviews.toString(),
        icon_name: "GitPullRequest",
        description: "Code reviews completed",
        color: "text-blue-500",
        bgColor: "bg-blue-50",
      },
      {
        id: "2",
        title: "Latest Review",
        value: latestReview,
        icon_name: "FileCode",
        description: "Last code analysis",
        color: "text-purple-500",
        bgColor: "bg-purple-50",
      },
      {
        id: "3",
        title: "Improvements",
        value: totalOptimizations.toString(),
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

    return calculatedStats;
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    return [];
  }
};

export const getRecentReviews = async (): Promise<RecentReview[]> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return [];
    }

    // Query recent_reviews table filtering by user_id
    const { data, error } = await supabase
      .from('recent_reviews')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching recent reviews:', error);
      
      // Fallback: If recent_reviews table has issues, get data from review_history
      const { data: historyData, error: historyError } = await supabase
        .from('review_history')
        .select('*')
        .eq('user_id', user.id)
        .order('review_date', { ascending: false })
        .limit(5);
        
      if (historyError) {
        console.error('Error fetching fallback review history:', historyError);
        return [];
      }
      
      // Transform review_history data to match RecentReview interface
      return (historyData || []).map(item => ({
        id: item.id,
        name: item.file_name,
        date: item.review_date,
        status: item.status,
        issues: item.bugs + item.optimizations + item.suggestions
      }));
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRecentReviews:', error);
    return [];
  }
};
