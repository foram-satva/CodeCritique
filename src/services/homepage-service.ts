
import { supabase } from "@/integrations/supabase/client";

export interface HomepageData {
  id: string;
  hero_title: string;
  hero_description: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon_name: string;
}

export interface ProcessStep {
  id: string;
  step_number: number;
  title: string;
  description: string;
}

export const getHomepageData = async (): Promise<HomepageData | null> => {
  try {
    const { data, error } = await supabase
      .from('homepage_data')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching homepage data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getHomepageData:', error);
    return null;
  }
};

export const getFeatures = async (): Promise<Feature[]> => {
  try {
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching features:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getFeatures:', error);
    return [];
  }
};

export const getProcessSteps = async (): Promise<ProcessStep[]> => {
  try {
    const { data, error } = await supabase
      .from('process_steps')
      .select('*')
      .order('step_number', { ascending: true });

    if (error) {
      console.error('Error fetching process steps:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getProcessSteps:', error);
    return [];
  }
};
