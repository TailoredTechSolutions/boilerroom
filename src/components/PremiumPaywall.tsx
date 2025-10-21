import { Lock, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface PremiumPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export const PremiumPaywall = ({ isOpen, onClose, feature = "this feature" }: PremiumPaywallProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate("/premium");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Premium Feature
          </DialogTitle>
          <DialogDescription className="text-center">
            Upgrade to Premium to access {feature}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            {[
              "Real-time IPO alerts",
              "Custom watchlists",
              "Advanced analytics",
              "Priority support",
              "Exclusive market insights",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={handleUpgrade}
            className="w-full"
            size="lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Upgrade to Premium
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface InlinePaywallProps {
  feature?: string;
  className?: string;
}

export const InlinePaywall = ({ feature = "this feature", className = "" }: InlinePaywallProps) => {
  const navigate = useNavigate();

  return (
    <div className={`rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center ${className}`}>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Lock className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mb-2 text-xl font-bold">Premium Feature</h3>
      <p className="mb-6 text-muted-foreground">
        Upgrade to Premium to access {feature} and unlock all advanced features
      </p>
      <Button onClick={() => navigate("/premium")} size="lg">
        <Sparkles className="mr-2 h-5 w-5" />
        Upgrade to Premium
      </Button>
    </div>
  );
};
