
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useAuth } from "@/providers/AuthProvider";
import { Code2, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ResetPasswordPage = () => {
  const { toast } = useToast();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Get token either from URL (email flow) or from state (phone flow)
  const token = searchParams.get("token") || "";
  const fromPhone = location.state?.fromPhone || false;
  const phoneToken = location.state?.token || "";
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (fromPhone && phoneToken) {
        // Handle phone-based password reset
        const response = await supabase.functions.invoke("phone-auth", {
          body: {
            action: "reset_password",
            token: phoneToken,
            password: data.password,
          },
        });
        
        if (response.error) {
          throw new Error(response.error.message || "Failed to reset password");
        }
      } else if (token) {
        // Handle email-based password reset
        await resetPassword(token, data.password);
      } else {
        throw new Error("Invalid or missing reset token");
      }

      toast({
        title: "Success",
        description: "Password reset successfully. You can now log in with your new password.",
      });
      
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error resetting your password.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token && !phoneToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md p-4 text-center">
          <Card className="border shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-destructive">Invalid Token</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The password reset token is missing or invalid.</p>
              <p className="mt-4">
                Please try resetting your password again.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate("/forgot-password")}>
                Back to Password Reset
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-4">
        <Card className="border shadow-lg animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <Code2 className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold">Create New Password</CardTitle>
            <CardDescription className="mt-2">
              Enter and confirm your new password
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-background"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-background"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Remembered your password?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Back to login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
