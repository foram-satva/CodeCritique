
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface OptimizationSample {
  original_code: string;
  optimized_code: string;
  explanation: string;
}

export interface ReviewHistoryItem {
  id: string;
  file_name: string;
  review_date: string;
  status: string;
  bugs: number;
  optimizations: number;
  suggestions: number;
  language: string;
  optimization_samples?: OptimizationSample[];
}

export const getReviewHistory = async (): Promise<ReviewHistoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('review_history')
      .select('*')
      .order('review_date', { ascending: false });

    if (error) {
      console.error('Error fetching review history:', error);
      return [];
    }

    // Transform the data to ensure it matches the ReviewHistoryItem interface
    return (data || []).map(item => ({
      ...item,
      language: item.language || 'unknown',
      optimization_samples: item.optimization_samples ? (item.optimization_samples as unknown as OptimizationSample[]) : []
    })) as ReviewHistoryItem[];
  } catch (error) {
    console.error('Error in getReviewHistory:', error);
    return [];
  }
};

export const saveReview = async (
  fileName: string,
  bugs: number,
  optimizations: number,
  suggestions: number,
  language: string = 'unknown',
  optimizationSamples: OptimizationSample[] = []
): Promise<string | null> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }

    const { data, error } = await supabase
      .from('review_history')
      .insert({
        file_name: fileName,
        bugs: bugs,
        optimizations: optimizations,
        suggestions: suggestions,
        language: language,
        optimization_samples: optimizationSamples as unknown as Json,
        user_id: user.id // Ensure user_id is set correctly
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving review:', error);
      return null;
    }

    // After successfully saving to review_history, update recent_reviews as well
    const { error: recentError } = await supabase
      .from('recent_reviews')
      .insert({
        name: fileName,
        issues: bugs + optimizations + suggestions,
        user_id: user.id,
        date: new Date().toISOString()
      });

    if (recentError) {
      console.error('Error updating recent reviews:', recentError);
    }

    return data?.id || null;
  } catch (error) {
    console.error('Error in saveReview:', error);
    return null;
  }
};
