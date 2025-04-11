import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  mobile_number?: string;
  otp_enabled?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  requestPhoneOtp: (phoneNumber: string) => Promise<void>;
  verifyPhoneOtp: (phoneNumber: string, otp: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          setIsAuthenticated(true);
          
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
                
              if (error) {
                console.error('Error fetching profile:', error);
                return;
              }
              
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: profile?.name || currentSession.user.email?.split('@')[0] || '',
                avatar_url: profile?.avatar_url || undefined,
                mobile_number: profile?.mobile_number || undefined,
                otp_enabled: profile?.otp_enabled || false
              });
            } catch (error) {
              console.error('Error in profile fetch:', error);
            }
          }, 0);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession?.user) {
          setSession(initialSession);
          setIsAuthenticated(true);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', initialSession.user.id)
            .single();
            
          setUser({
            id: initialSession.user.id,
            email: initialSession.user.email || '',
            name: profile?.name || initialSession.user.email?.split('@')[0] || '',
            avatar_url: profile?.avatar_url || undefined,
            mobile_number: profile?.mobile_number || undefined,
            otp_enabled: profile?.otp_enabled || false
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      if (data.session) {
        toast({
          title: "Success",
          description: "Logged in successfully.",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    name: string,
    password: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        toast({
          title: "Success",
          description: "Account created successfully.",
        });
      } else {
        toast({
          title: "Verification required",
          description: "Please check your email for verification instructions.",
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "OTP verified successfully.",
      });
      
    } catch (error: any) {
      console.error("OTP verification error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Password reset instructions sent to your email.",
      });
    } catch (error: any) {
      console.error("Password reset request error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Password updated successfully.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      });
      
      if (signInError) {
        throw new Error("Current password is incorrect");
      }
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Password updated successfully.",
      });
    } catch (error: any) {
      console.error("Password update error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPhoneOtp = async (phoneNumber: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("phone-auth", {
        body: {
          action: "send_otp",
          phone: phoneNumber,
        },
      });
      
      if (error || (data && !data.success)) {
        throw new Error(data?.error || error?.message || "Failed to send OTP");
      }
      
      toast({
        title: "Success",
        description: "OTP sent to your phone number.",
      });
    } catch (error: any) {
      console.error("Phone OTP request error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhoneOtp = async (phoneNumber: string, otp: string): Promise<string> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("phone-auth", {
        body: {
          action: "verify_otp",
          phone: phoneNumber,
          otp,
        },
      });
      
      if (error || (data && !data.success)) {
        throw new Error(data?.error || error?.message || "Invalid OTP");
      }
      
      toast({
        title: "Success",
        description: "OTP verified successfully.",
      });
      
      return data.token;
    } catch (error: any) {
      console.error("Phone OTP verification error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Logged out successfully.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<void> => {
    if (!user?.id) throw new Error("No authenticated user");
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          avatar_url: data.avatar_url,
          mobile_number: data.mobile_number,
          otp_enabled: data.otp_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    verifyOtp,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    updatePassword,
    requestPhoneOtp,
    verifyPhoneOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
