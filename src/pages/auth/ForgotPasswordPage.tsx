
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from "@/providers/AuthProvider";
import { Code2, Loader2, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9\s\-()]+$/, "Please enter a valid phone number"),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PhoneFormValues = z.infer<typeof phoneSchema>;

const ForgotPasswordPage = () => {
  const { toast } = useToast();
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmitEmail = async (data: EmailFormValues) => {
    try {
      setIsSubmittingEmail(true);
      await requestPasswordReset(data.email);
      toast({
        title: "Success",
        description: "Password reset link sent to your email.",
      });
      // Redirect to login page
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error sending the reset link.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const onSubmitPhone = async (data: PhoneFormValues) => {
    try {
      setIsSubmittingPhone(true);
      
      // Call phone-auth edge function to send OTP
      const response = await supabase.functions.invoke("phone-auth", {
        body: {
          action: "send_otp",
          phone: data.phone,
        },
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to send OTP");
      }
      
      toast({
        title: "Success",
        description: "OTP sent to your phone number.",
      });
      
      // Navigate to OTP verification page
      navigate("/verify-otp", { 
        state: { 
          phone: data.phone,
          isPasswordReset: true
        } 
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error sending the OTP.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background">
      <div className="w-full max-w-md p-4">
        <Card className="border shadow-lg animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Code2 className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Choose a method to reset your password
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 mx-6">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <CardContent>
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              className="bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full mt-2" disabled={isSubmittingEmail}>
                      {isSubmittingEmail ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending link...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="phone">
              <CardContent>
                <Form {...phoneForm}>
                  <form onSubmit={phoneForm.handleSubmit(onSubmitPhone)} className="space-y-4">
                    <FormField
                      control={phoneForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1234567890"
                              className="bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full mt-2" disabled={isSubmittingPhone}>
                      {isSubmittingPhone ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex justify-center border-t pt-4 mt-2">
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

export default ForgotPasswordPage;
