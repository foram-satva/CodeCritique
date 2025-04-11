
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Constants
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mock function to simulate sending an SMS - in a real app, you'd use a service like Twilio
const sendSms = async (phoneNumber: string, otp: string) => {
  // Here we would integrate with an SMS provider
  console.log(`[MOCK] Sending OTP ${otp} to ${phoneNumber}`);
  return true;
};

// Generate a random 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with expiry (5 minutes)
const storeOTP = async (supabase: any, phone: string, otp: string): Promise<boolean> => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5); // OTP valid for 5 minutes
  
  try {
    // Use a table to store OTPs (you might need to create this table)
    const { error } = await supabase
      .from("phone_otps")
      .upsert(
        { 
          phone_number: phone,
          otp_code: otp,
          expires_at: expiresAt.toISOString()
        },
        { onConflict: "phone_number" }
      );
      
    if (error) {
      console.error("Error storing OTP:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Exception storing OTP:", e);
    return false;
  }
};

// Verify an OTP
const verifyOTP = async (supabase: any, phone: string, otp: string): Promise<boolean> => {
  try {
    // Check if OTP exists and is valid
    const { data, error } = await supabase
      .from("phone_otps")
      .select("*")
      .eq("phone_number", phone)
      .eq("otp_code", otp)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (error || !data) {
      console.error("Error verifying OTP:", error);
      return false;
    }

    // Delete the used OTP
    await supabase
      .from("phone_otps")
      .delete()
      .eq("phone_number", phone);
      
    return true;
  } catch (e) {
    console.error("Exception verifying OTP:", e);
    return false;
  }
};

// Find user by phone number
const findUserByPhone = async (supabase: any, phone: string): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("mobile_number", phone)
      .single();

    if (error || !data) {
      console.error("Error finding user by phone:", error);
      return null;
    }
    return data;
  } catch (e) {
    console.error("Exception finding user by phone:", e);
    return null;
  }
};

// Enable OTP for a user
const enableOTP = async (supabase: any, userId: string, phone: string): Promise<boolean> => {
  try {
    // Update the profile to mark OTP as enabled
    const { error } = await supabase
      .from("profiles")
      .update({
        mobile_number: phone,
        otp_enabled: true
      })
      .eq("id", userId);
    
    if (error) {
      console.error("Error enabling OTP:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Exception enabling OTP:", e);
    return false;
  }
};

// Disable OTP for a user
const disableOTP = async (supabase: any, userId: string): Promise<boolean> => {
  try {
    // Update the profile to mark OTP as disabled
    const { error } = await supabase
      .from("profiles")
      .update({
        otp_enabled: false
      })
      .eq("id", userId);
    
    if (error) {
      console.error("Error disabling OTP:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Exception disabling OTP:", e);
    return false;
  }
};

// Handle the request
serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  // Create Supabase clients
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const adminAuth = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  
  try {
    const { action, phone, otp, token, password, user_id } = await req.json();

    // Create phone_otps table if it doesn't exist (first request)
    try {
      await supabase.rpc("create_phone_otps_if_not_exists");
    } catch (error) {
      console.log("Phone OTPs table might already exist:", error);
    }

    // Handle different actions
    switch (action) {
      case "send_otp": {
        // Validate phone
        if (!phone || !/^\+?[1-9]\d{1,14}$/.test(phone)) {
          return new Response(
            JSON.stringify({ error: "Invalid phone number" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        // Check if user exists
        const user = await findUserByPhone(supabase, phone);
        if (!user) {
          return new Response(
            JSON.stringify({ error: "No account found with this phone number" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
          );
        }

        // Generate and store OTP
        const otp = generateOTP();
        const stored = await storeOTP(supabase, phone, otp);
        if (!stored) {
          return new Response(
            JSON.stringify({ error: "Failed to create OTP" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        // Send OTP via SMS
        await sendSms(phone, otp);
        
        return new Response(
          JSON.stringify({ success: true, message: "OTP sent successfully" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      case "verify_otp": {
        // Validate inputs
        if (!phone || !otp) {
          return new Response(
            JSON.stringify({ error: "Phone number and OTP required" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        // Verify OTP
        const isValid = await verifyOTP(supabase, phone, otp);
        if (!isValid) {
          return new Response(
            JSON.stringify({ error: "Invalid or expired OTP" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        // Find user by phone
        const user = await findUserByPhone(supabase, phone);
        if (!user) {
          return new Response(
            JSON.stringify({ error: "User not found" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
          );
        }

        // Generate a password reset token
        const { data, error } = await adminAuth.auth.admin.generateLink({
          type: 'recovery',
          email: user.email,
        });

        if (error) {
          return new Response(
            JSON.stringify({ error: "Failed to generate reset token" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "OTP verified successfully",
            token: data.properties.token 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      case "reset_password": {
        // Validate inputs
        if (!token || !password) {
          return new Response(
            JSON.stringify({ error: "Token and password required" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        // Reset password using admin client
        const { error } = await adminAuth.auth.admin.updateUserById(
          token,
          { password }
        );

        if (error) {
          return new Response(
            JSON.stringify({ error: "Failed to reset password" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: "Password reset successfully" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      case "enable_otp": {
        // Validate inputs
        if (!user_id || !phone) {
          return new Response(
            JSON.stringify({ error: "User ID and phone number required" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        // Validate phone format
        if (!/^\+?[1-9]\d{1,14}$/.test(phone)) {
          return new Response(
            JSON.stringify({ error: "Invalid phone number format" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        const enabled = await enableOTP(supabase, user_id, phone);
        if (!enabled) {
          return new Response(
            JSON.stringify({ error: "Failed to enable OTP" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: "OTP enabled successfully" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "disable_otp": {
        // Validate inputs
        if (!user_id) {
          return new Response(
            JSON.stringify({ error: "User ID required" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        const disabled = await disableOTP(supabase, user_id);
        if (!disabled) {
          return new Response(
            JSON.stringify({ error: "Failed to disable OTP" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: "OTP disabled successfully" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
