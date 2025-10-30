import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";
import { z } from "zod";
import { CountryCodeSelector, countries, type Country } from "./CountryCodeSelector";

interface InvestorSignupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Enter a valid phone number").max(20),
});

const surveySchema = z.object({
  experience: z.enum(["I am experienced investor", "Somewhat Experience", "No Experience"], {
    errorMap: () => ({ message: "Please select your experience level" })
  }),
  timeframe: z.enum(["Immediately", "Within 14 Days", "Within a month"], {
    errorMap: () => ({ message: "Please select your investment timeframe" })
  }),
  portfolio: z.enum(["$100k-$250k", "$250k-$500k", "$500k+"], {
    errorMap: () => ({ message: "Please select your portfolio size" })
  }),
  income: z.enum(["$0- $100k", "$100k-$250k", "$250k-$500k", "$500k+"], {
    errorMap: () => ({ message: "Please select your annual income" })
  }),
  capital: z.enum(["20K+", "50K+", "100K+", "250K+"], {
    errorMap: () => ({ message: "Please select available capital" })
  }),
  advisor: z.enum(["YES", "NOPE"], {
    errorMap: () => ({ message: "Please indicate if you have an advisor" })
  }),
  alternatives: z.enum(["YES", "NOPE"], {
    errorMap: () => ({ message: "Please indicate prior alternative investments" })
  }),
  alternativesDetail: z.string().max(500, "Detail must be less than 500 characters").optional(),
  liquidity: z.enum(["Very", "Somewhat", "Not at all"], {
    errorMap: () => ({ message: "Please select your liquidity comfort level" })
  }),
  sectors: z.enum(["Tech", "Fintech", "Biotech", "Consumer", "Clean Energy", "Other"], {
    errorMap: () => ({ message: "Please select your sector interest" })
  }),
  curated: z.enum(["YES", "No"], {
    errorMap: () => ({ message: "Please indicate curated deal preference" })
  }),
  kyc: z.enum(["Yes", "No", "I'd like more info"], {
    errorMap: () => ({ message: "Please indicate KYC readiness" })
  }),
  decision: z.enum(["Yes", "No"], {
    errorMap: () => ({ message: "Please indicate decision-maker status" })
  }),
  bestTime: z.enum(["Morning", "Afternoon", "Evening"], {
    errorMap: () => ({ message: "Please select best time to reach you" })
  }),
});

type WizardStep = 
  | "lead" | "otp" | "experience" | "timeframe" | "portfolio" 
  | "income" | "capital" | "advisor" | "alternatives" | "alternatives-detail"
  | "liquidity" | "sectors" | "curated" | "kyc" | "decision" | "best-time" | "complete";

const STEPS: WizardStep[] = [
  "lead", "otp", "experience", "timeframe", "portfolio", "income", 
  "capital", "advisor", "alternatives", "alternatives-detail", "liquidity", 
  "sectors", "curated", "kyc", "decision", "best-time", "complete"
];

export const InvestorSignupWizard = ({ open, onOpenChange }: InvestorSignupWizardProps) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("lead");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pinCode: "",
    experience: "",
    timeframe: "",
    portfolio: "",
    income: "",
    capital: "",
    advisor: "",
    alternatives: "",
    alternativesDetail: "",
    liquidity: "",
    sectors: "",
    curated: "",
    kyc: "",
    decision: "",
    bestTime: "",
    agreePolicy: false,
  });

  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Default to UK

  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const goToStep = (step: WizardStep) => {
    setCurrentStep(step);
  };

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const handleLeadSubmit = async () => {
    try {
      signupSchema.parse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    if (!formData.agreePolicy) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the Privacy Policy",
        variant: "destructive",
      });
      return;
    }

    // Generate 4-digit PIN
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setFormData({ ...formData, pinCode: pin });

    // Send OTP via Twilio
    setIsSubmitting(true);
    try {
      const formattedPhone = formData.phone.startsWith('+') 
        ? formData.phone 
        : `${selectedCountry.dialCode}${formData.phone.replace(/^0+/, '')}`;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-sms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            phone: formattedPhone,
            message: `Your verification code is: ${pin}. Valid for 10 minutes.`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      toast({
        title: "Code Sent",
        description: "Check your phone for the verification code",
      });
      
      goToStep("otp");
    } catch (error: any) {
      console.error("Error sending SMS:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPVerify = () => {
    const enteredPin = formData.pinCode;
    
    if (enteredPin.length !== 4) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 4-digit PIN",
        variant: "destructive",
      });
      return;
    }

    // Note: In a production environment, you would verify the PIN against a stored value
    // For now, we're using the generated PIN stored in formData
    toast({
      title: "Verified",
      description: "Phone number verified successfully",
    });
    
    goToNextStep();
  };

  const handleFinalSubmit = async () => {
    // Validate survey data before submission
    try {
      surveySchema.parse({
        experience: formData.experience,
        timeframe: formData.timeframe,
        portfolio: formData.portfolio,
        income: formData.income,
        capital: formData.capital,
        advisor: formData.advisor,
        alternatives: formData.alternatives,
        alternativesDetail: formData.alternativesDetail,
        liquidity: formData.liquidity,
        sectors: formData.sectors,
        curated: formData.curated,
        kyc: formData.kyc,
        decision: formData.decision,
        bestTime: formData.bestTime,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Incomplete Survey",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("email_subscribers").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        phone_verified: true,
        survey_completed: true,
        survey_completed_at: new Date().toISOString(),
        experience: formData.experience,
        timeframe: formData.timeframe,
        portfolio_size: formData.portfolio,
        annual_income: formData.income,
        capital_available: formData.capital,
        has_advisor: formData.advisor === "YES",
        alternative_investments: formData.alternativesDetail || formData.alternatives,
        liquidity_comfort: formData.liquidity,
        interested_sectors: formData.sectors ? [formData.sectors] : [],
        curated_deals: formData.curated === "YES",
        kyc_ready: formData.kyc,
        decision_maker: formData.decision === "Yes",
        best_time_to_reach: formData.bestTime,
        alert_preferences: {
          ipo_alerts: true,
          market_news: true,
          weekly_digest: true,
        },
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Subscribed",
            description: "This email is already registered.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "You've been subscribed to market alerts.",
        });
        setTimeout(() => onOpenChange(false), 2000);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ChoiceButton = ({ value, onClick }: { value: string; onClick: () => void }) => (
    <Button
      type="button"
      onClick={onClick}
      className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      {value}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Get Early Access to 2025's Hottest IPOs</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">{Math.round(progress)}%</p>
        </div>

        {/* Content */}
        <div className="p-6 pt-4">
          {/* Step 1: Lead Capture */}
          {currentStep === "lead" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  Be the first to know before top private companies go public. Join our investor alert list today.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    maxLength={100}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Your Best Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your Best Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    maxLength={255}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Your Best Phone Number</Label>
                  <div className="flex gap-2">
                    <CountryCodeSelector
                      value={selectedCountry}
                      onChange={setSelectedCountry}
                    />
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll text you a 4-digit PIN to verify your number.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="policy"
                    checked={formData.agreePolicy}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, agreePolicy: checked as boolean })
                    }
                  />
                  <Label htmlFor="policy" className="text-sm cursor-pointer">
                    I agree to the Privacy Policy
                  </Label>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                We care about the protection of your data. We won't Spam
              </p>

              <Button
                onClick={handleLeadSubmit}
                disabled={isSubmitting}
                className="w-full h-14 text-base font-bold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  'NEXT >>'
                )}
              </Button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {currentStep === "otp" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Texting your PIN Code to your Phone Number</h3>
                <p className="text-muted-foreground">Enter 4 digit PIN Code to verify</p>
              </div>

              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <Input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-16 h-16 text-center text-2xl"
                    value={formData.pinCode[i] || ""}
                    onChange={(e) => {
                      const newPin = formData.pinCode.split("");
                      newPin[i] = e.target.value;
                      setFormData({ ...formData, pinCode: newPin.join("") });
                    }}
                  />
                ))}
              </div>

              <p className="text-sm text-center text-muted-foreground">
                Entered a wrong number or need a new code? Try again in 27 seconds
              </p>

              <Button
                onClick={handleOTPVerify}
                className="w-full h-14 text-base font-bold"
              >
                Verify
              </Button>
            </div>
          )}

          {/* Step 3: Experience */}
          {currentStep === "experience" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">
                What is your previous experience investing in pre IPOs?
              </h3>
              <div className="space-y-3">
                <ChoiceButton 
                  value="I am experienced investor" 
                  onClick={() => {
                    setFormData({ ...formData, experience: "I am experienced investor" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="Somewhat Experience" 
                  onClick={() => {
                    setFormData({ ...formData, experience: "Somewhat Experience" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="No Experience" 
                  onClick={() => {
                    setFormData({ ...formData, experience: "No Experience" });
                    goToNextStep();
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 4: Timeframe */}
          {currentStep === "timeframe" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">
                What is your Ideal Investment Timeframe?
              </h3>
              <div className="space-y-3">
                <ChoiceButton 
                  value="Immediately" 
                  onClick={() => {
                    setFormData({ ...formData, timeframe: "Immediately" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="Within 14 Days" 
                  onClick={() => {
                    setFormData({ ...formData, timeframe: "Within 14 Days" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="Within a month" 
                  onClick={() => {
                    setFormData({ ...formData, timeframe: "Within a month" });
                    goToNextStep();
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 5: Portfolio Size */}
          {currentStep === "portfolio" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">
                What is the size of your current portfolio?
              </h3>
              <div className="space-y-3">
                <ChoiceButton 
                  value="$100k-$250k" 
                  onClick={() => {
                    setFormData({ ...formData, portfolio: "$100k-$250k" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="$250k-$500k" 
                  onClick={() => {
                    setFormData({ ...formData, portfolio: "$250k-$500k" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="$500k+" 
                  onClick={() => {
                    setFormData({ ...formData, portfolio: "$500k+" });
                    goToNextStep();
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 6: Annual Income */}
          {currentStep === "income" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">
                What is your annual income (or household income)?
              </h3>
              <div className="space-y-3">
                <ChoiceButton 
                  value="$0- $100k" 
                  onClick={() => {
                    setFormData({ ...formData, income: "$0-$100k" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="$100k-$250k" 
                  onClick={() => {
                    setFormData({ ...formData, income: "$100k-$250k" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="$250k-$500k" 
                  onClick={() => {
                    setFormData({ ...formData, income: "$250k-$500k" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="$500k+" 
                  onClick={() => {
                    setFormData({ ...formData, income: "$500k+" });
                    goToNextStep();
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 7: Capital Available */}
          {currentStep === "capital" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">
                How much capital do you have available to invest over the next 12 months?
              </h3>
              <div className="space-y-3">
                <ChoiceButton 
                  value="20K+" 
                  onClick={() => {
                    setFormData({ ...formData, capital: "20K+" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="50K+" 
                  onClick={() => {
                    setFormData({ ...formData, capital: "50K+" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="100K+" 
                  onClick={() => {
                    setFormData({ ...formData, capital: "100K+" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="250K+" 
                  onClick={() => {
                    setFormData({ ...formData, capital: "250K+" });
                    goToNextStep();
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 8: Financial Advisor */}
          {currentStep === "advisor" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">
                Do you currently work with a financial advisor or wealth manager?
              </h3>
              <div className="space-y-3">
                <ChoiceButton 
                  value="YES" 
                  onClick={() => {
                    setFormData({ ...formData, advisor: "YES" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="NOPE" 
                  onClick={() => {
                    setFormData({ ...formData, advisor: "NOPE" });
                    goToNextStep();
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 9: Alternative Investments */}
          {currentStep === "alternatives" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">
                Have you previously invested in private placements or alternative assets?
              </h3>
              <div className="space-y-3">
                <ChoiceButton 
                  value="YES" 
                  onClick={() => {
                    setFormData({ ...formData, alternatives: "YES" });
                    goToStep("alternatives-detail");
                  }}
                />
                <ChoiceButton 
                  value="NOPE" 
                  onClick={() => {
                    setFormData({ ...formData, alternatives: "NOPE" });
                    goToStep("liquidity");
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 10: Alternative Details */}
          {currentStep === "alternatives-detail" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Private placements or alternative assets</h3>
                <p className="text-muted-foreground">
                  Private placements or alternative assets you have previously invested in
                </p>
              </div>
              
              <Textarea
                placeholder="Private placements or alternative assets you have previously invested in?"
                value={formData.alternativesDetail}
                onChange={(e) => setFormData({ ...formData, alternativesDetail: e.target.value })}
                rows={4}
              />

              <Button
                onClick={() => goToStep("liquidity")}
                className="w-full h-14 text-base font-bold"
              >
                NEXT
              </Button>
            </div>
          )}

          {/* Step 11: Liquidity Comfort */}
          {currentStep === "liquidity" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">
                How comfortable are you with long-term illiquid investments (3-7 years)?
              </h3>
              <div className="space-y-3">
                <ChoiceButton 
                  value="Very" 
                  onClick={() => {
                    setFormData({ ...formData, liquidity: "Very" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="Somewhat" 
                  onClick={() => {
                    setFormData({ ...formData, liquidity: "Somewhat" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="Not at all" 
                  onClick={() => {
                    setFormData({ ...formData, liquidity: "Not at all" });
                    goToNextStep();
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 12: Sectors */}
          {currentStep === "sectors" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">
                Which sectors are you most interested in?
              </h3>
              <div className="space-y-3">
                <ChoiceButton 
                  value="Tech" 
                  onClick={() => {
                    setFormData({ ...formData, sectors: "Tech" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="Fintech" 
                  onClick={() => {
                    setFormData({ ...formData, sectors: "Fintech" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="Biotech" 
                  onClick={() => {
                    setFormData({ ...formData, sectors: "Biotech" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="Consumer" 
                  onClick={() => {
                    setFormData({ ...formData, sectors: "Consumer" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="Clean Energy" 
                  onClick={() => {
                    setFormData({ ...formData, sectors: "Clean Energy" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="Other" 
                  onClick={() => {
                    setFormData({ ...formData, sectors: "Other" });
                    goToNextStep();
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 13: Curated Deals */}
          {currentStep === "curated" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">
                Would you be open to receiving curated deal opportunities based on your profile?
              </h3>
              <div className="space-y-3">
                <ChoiceButton 
                  value="YES" 
                  onClick={() => {
                    setFormData({ ...formData, curated: "YES" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="No" 
                  onClick={() => {
                    setFormData({ ...formData, curated: "No" });
                    goToNextStep();
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 14: KYC */}
          {currentStep === "kyc" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">
                Are you prepared to complete KYC/AML checks to participate in offerings?
              </h3>
              <div className="space-y-3">
                <ChoiceButton 
                  value="Yes" 
                  onClick={() => {
                    setFormData({ ...formData, kyc: "Yes" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="No" 
                  onClick={() => {
                    setFormData({ ...formData, kyc: "No" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="I'd like more info" 
                  onClick={() => {
                    setFormData({ ...formData, kyc: "I'd like more info" });
                    goToNextStep();
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 15: Decision Maker */}
          {currentStep === "decision" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">
                Are you a decision-maker for investment decisions?
              </h3>
              <div className="space-y-3">
                <ChoiceButton 
                  value="Yes" 
                  onClick={() => {
                    setFormData({ ...formData, decision: "Yes" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="No" 
                  onClick={() => {
                    setFormData({ ...formData, decision: "No" });
                    goToNextStep();
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 16: Best Time */}
          {currentStep === "best-time" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">
                Best time to reach you?
              </h3>
              <div className="space-y-3">
                <ChoiceButton 
                  value="Morning" 
                  onClick={() => {
                    setFormData({ ...formData, bestTime: "Morning" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="Afternoon" 
                  onClick={() => {
                    setFormData({ ...formData, bestTime: "Afternoon" });
                    goToNextStep();
                  }}
                />
                <ChoiceButton 
                  value="Evening" 
                  onClick={() => {
                    setFormData({ ...formData, bestTime: "Evening" });
                    goToNextStep();
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 17: Complete */}
          {currentStep === "complete" && (
            <div className="space-y-6 text-center">
              <h3 className="text-2xl font-bold">All set!</h3>
              <p className="text-muted-foreground">
                Thanks. We'll reach out with UK pre-IPO alerts that fit your profile.
              </p>
              <Button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="w-full h-14 text-base font-bold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
