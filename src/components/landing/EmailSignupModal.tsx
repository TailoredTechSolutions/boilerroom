import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

interface EmailSignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
});

export const EmailSignupModal = ({ open, onOpenChange }: EmailSignupModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ipoAlerts, setIpoAlerts] = useState(true);
  const [marketNews, setMarketNews] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    try {
      signupSchema.parse({ name, email });
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
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("email_subscribers").insert({
        name,
        email,
        alert_preferences: {
          ipo_alerts: ipoAlerts,
          market_news: marketNews,
          weekly_digest: weeklyDigest,
        },
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Subscribed",
            description: "This email is already registered for alerts.",
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
        setName("");
        setEmail("");
        onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Get Free Market Alerts</DialogTitle>
          <DialogDescription>
            Stay informed about pre-IPO opportunities and market movements.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-3 pt-2">
            <Label className="text-base font-semibold">Alert Preferences</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ipo"
                checked={ipoAlerts}
                onCheckedChange={(checked) => setIpoAlerts(checked as boolean)}
                disabled={isSubmitting}
              />
              <Label htmlFor="ipo" className="text-sm font-normal cursor-pointer">
                Pre-IPO & IPO Alerts
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="news"
                checked={marketNews}
                onCheckedChange={(checked) => setMarketNews(checked as boolean)}
                disabled={isSubmitting}
              />
              <Label htmlFor="news" className="text-sm font-normal cursor-pointer">
                Market News Updates
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="digest"
                checked={weeklyDigest}
                onCheckedChange={(checked) => setWeeklyDigest(checked as boolean)}
                disabled={isSubmitting}
              />
              <Label htmlFor="digest" className="text-sm font-normal cursor-pointer">
                Weekly Market Digest
              </Label>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe to Alerts"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
