
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/providers/AuthProvider";
import { Code2, Loader2, Mail, Phone } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

const VerifyOtpPage = () => {
  const { toast } = useToast();
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const phone = location.state?.phone || "";
  const isPasswordReset = location.state?.isPasswordReset || false;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: OtpFormValues) => {
    // Validate that we have either email or phone
    if (!email && !phone) {
      toast({
        title: "Error",
        description: "Missing contact information. Please go back and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (phone && isPasswordReset) {
        // Verify phone OTP for password reset
        const response = await supabase.functions.invoke("phone-auth", {
          body: {
            action: "verify_otp",
            phone,
            otp: data.otp,
          },
        });

        if (response.error) {
          throw new Error(response.error.message || "Invalid OTP");
        }

        toast({
          title: "Success",
          description: "OTP verified successfully.",
        });

        // Navigate to reset password page with token
        navigate("/reset-password", { 
          state: { 
            token: response.data.token,
            fromPhone: true
          } 
        });
      } else if (email) {
        // Verify email OTP for signup
        await verifyOtp(email, data.otp);
        
        toast({
          title: "Success",
          description: "Email verified successfully.",
        });

        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);

      if (phone && isPasswordReset) {
        // Resend phone OTP
        const response = await supabase.functions.invoke("phone-auth", {
          body: {
            action: "send_otp",
            phone,
          },
        });

        if (response.error) {
          throw new Error(response.error.message || "Failed to resend OTP");
        }
      } else if (email) {
        // For email, we would trigger a resend email verification
        // This depends on your Supabase setup and might require an edge function
        await supabase.auth.resend({
          type: 'signup',
          email,
        });
      }

      toast({
        title: "Success",
        description: "OTP has been resent.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend OTP.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const contactInfo = email || phone;
  const contactType = email ? "email" : "phone";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-4">
        <Card className="border shadow-lg animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <Code2 className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold">Verify OTP</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2 mt-2">
              {contactType === "email" ? (
                <>
                  <Mail className="h-4 w-4" />
                  <span>Enter the 6-digit code sent to your email:</span>
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4" />
                  <span>Enter the 6-digit code sent to your phone:</span>
                </>
              )}
            </CardDescription>
            <p className="mt-1 font-semibold text-sm">{contactInfo}</p>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex justify-center">
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                      </div>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center space-y-4 border-t pt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleResendOTP} 
              disabled={isResending}
              className="h-auto px-2 py-1"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Resending...
                </>
              ) : (
                "Didn't receive a code? Resend OTP"
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground">
              <Link 
                to={isPasswordReset ? "/forgot-password" : "/login"} 
                className="text-primary hover:underline"
              >
                Back to {isPasswordReset ? "reset options" : "login"}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
