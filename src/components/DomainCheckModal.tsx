import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DomainCheckModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName: string;
}

export function DomainCheckModal({ open, onOpenChange, companyName }: DomainCheckModalProps) {
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState<string>("");
  const [available, setAvailable] = useState<boolean | null>(null);

  const sanitizeDomainName = (name: string): string => {
    // Remove common company suffixes
    const cleaned = name
      .replace(/\b(limited|ltd|inc|incorporated|corp|corporation|plc|llc|l\.l\.c|co|company)\b/gi, '')
      .trim();
    // Keep only letters, numbers, and hyphens
    const sanitized = cleaned
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .substring(0, 63);
    return sanitized;
  };

  const checkDomainAvailability = async (domainName: string): Promise<boolean> => {
    // Use Cloudflare DNS-over-HTTPS to check if domain exists
    const fqdn = `${domainName}.com`;
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(fqdn)}&type=A`;
    
    try {
      const res = await fetch(url, { 
        headers: { 'accept': 'application/dns-json' }
      });
      
      if (!res.ok) throw new Error('DNS lookup failed');
      
      const data = await res.json();
      // Status 3 = NXDOMAIN (domain doesn't exist, likely available)
      // No Answer records also suggests availability
      const isAvailable = Number(data.Status) === 3 || (!data.Answer && Number(data.Status) === 0);
      return isAvailable;
    } catch (error) {
      console.error('DNS check error:', error);
      throw error;
    }
  };

  const checkDomain = async () => {
    console.log('checkDomain called for:', companyName);
    setLoading(true);
    setAvailable(null);

    try {
      const sanitized = sanitizeDomainName(companyName);
      const domainToCheck = `${sanitized}.com`;
      setDomain(domainToCheck);
      
      console.log('Checking domain:', domainToCheck);
      const isAvailable = await checkDomainAvailability(sanitized);
      
      setAvailable(isAvailable);
      console.log('Domain available:', isAvailable);
    } catch (error) {
      console.error('Domain check error:', error);
      toast.error('Could not check availability. You can still view pricing on GoDaddy.');
      const sanitized = sanitizeDomainName(companyName);
      setDomain(`${sanitized}.com`);
      setAvailable(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      checkDomain();
    } else {
      setDomain("");
      setAvailable(null);
    }
    onOpenChange(newOpen);
  };

  const getGoDaddyUrl = () => {
    return `https://www.godaddy.com/en-ph/domainsearch/find?checkAvail=1&domainToCheck=${encodeURIComponent(domain)}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Domain Availability Check</DialogTitle>
          <DialogDescription>Checks .com availability and live pricing via GoDaddy</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Checking DNS...</p>
            </div>
          )}

          {!loading && domain && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Domain: <span className="font-mono font-semibold text-foreground">{domain}</span>
              </div>

              {/* Availability Status */}
              {available !== null && (
                <div className={`rounded-lg border p-3 flex items-center gap-2 ${
                  available 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {available ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-semibold">{domain} looks available!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5" />
                      <span className="font-semibold">{domain} appears to be registered</span>
                    </>
                  )}
                </div>
              )}

              {/* GoDaddy Section */}
              <div className="rounded-lg border border-dashed p-4 space-y-3 bg-blue-50/50">
                <div className="flex items-center gap-2 font-bold">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                  <span>GoDaddy.com</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {available 
                    ? "Confirm pricing on GoDaddy. If available, you'll see the live checkout price."
                    : "Check aftermarket pricing and alternatives on GoDaddy's domain marketplace."
                  }
                </p>
                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => window.open(getGoDaddyUrl(), '_blank', 'noopener')}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Pricing on GoDaddy
                  </Button>
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
