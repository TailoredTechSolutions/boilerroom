import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DomainCheckModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName: string;
}

export function DomainCheckModal({ open, onOpenChange, companyName }: DomainCheckModalProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const checkDomain = async () => {
    setLoading(true);
    setResults(null);

    try {
      // Generate domain from company name
      const domain = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 63) + '.com';

      const { data, error } = await supabase.functions.invoke('check-domain', {
        body: { domain },
      });

      if (error) throw error;

      setResults(data);
    } catch (error) {
      console.error('Domain check error:', error);
      toast.error('Failed to check domain availability');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      checkDomain();
    } else {
      setResults(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Domain Availability Check</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Checking: <span className="font-mono font-semibold text-foreground">{results.domain}</span>
              </div>

              {/* GoDaddy Results */}
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">GoDaddy</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {results.godaddy?.error ? (
                    <span className="text-sm text-muted-foreground italic">{results.godaddy.error}</span>
                  ) : (
                    <span className={`font-semibold ${results.godaddy?.available ? 'text-green-600' : 'text-red-600'}`}>
                      {results.godaddy?.available ? 'Available' : 'Taken'}
                    </span>
                  )}
                </div>
                {results.godaddy?.price && results.godaddy?.available && (
                  <div className="text-sm text-muted-foreground">
                    Price: <span className="font-semibold text-foreground">{results.godaddy.price}</span>
                  </div>
                )}
              </div>

              {/* Namecheap Placeholder */}
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Namecheap</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground italic">Need API key</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
