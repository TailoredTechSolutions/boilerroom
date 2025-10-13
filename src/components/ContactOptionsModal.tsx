import { Mail, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
}

interface ContactOptionsModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactOptionsModal = ({ lead, isOpen, onClose }: ContactOptionsModalProps) => {
  if (!lead) return null;

  const handleEmail = () => {
    window.location.href = `mailto:${lead.email}`;
    toast.success(`Opening email to ${lead.contactName}`);
    onClose();
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:${lead.phone}`;
    toast.success(`Calling ${lead.contactName}`);
    onClose();
  };

  const handleText = () => {
    window.location.href = `sms:${lead.phone}`;
    toast.success(`Opening text message to ${lead.contactName}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card text-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Contact {lead.contactName}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose how you'd like to reach out to {lead.companyName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <Button
            onClick={handleEmail}
            className="w-full justify-start gap-3 h-14 bg-card hover:bg-muted border border-border"
            variant="outline"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">{lead.email}</p>
            </div>
          </Button>

          <Button
            onClick={handlePhoneCall}
            className="w-full justify-start gap-3 h-14 bg-card hover:bg-muted border border-border"
            variant="outline"
          >
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">Phone Call</p>
              <p className="text-sm text-muted-foreground">{lead.phone}</p>
            </div>
          </Button>

          <Button
            onClick={handleText}
            className="w-full justify-start gap-3 h-14 bg-card hover:bg-muted border border-border"
            variant="outline"
          >
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-info" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">Text Message</p>
              <p className="text-sm text-muted-foreground">{lead.phone}</p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
