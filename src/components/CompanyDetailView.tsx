import { X, Building2, Calendar, FileText, MapPin, Globe, Users, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface CompanyDetail {
  id: string;
  legal_name: string;
  registry_id: string;
  registry_source: string;
  incorporation_date: string | null;
  sic_codes: string[] | null;
  status: string;
  company_type: string | null;
  address: any;
  jurisdiction: string | null;
  raw_payload: any;
  psc: any[] | null;
  website: string | null;
  domain_available: boolean | null;
  web_presence_score: number | null;
  negative_press_flag: boolean | null;
}

interface CompanyDetailViewProps {
  company: CompanyDetail;
  onClose: () => void;
}

export const CompanyDetailView = ({ company, onClose }: CompanyDetailViewProps) => {
  const isCompaniesHouse = company.registry_source?.toLowerCase().includes('companies house') || 
                           company.registry_source?.toLowerCase().includes('ch');
  const isGLEIF = company.registry_source?.toLowerCase().includes('gleif') || 
                  company.registry_source?.toLowerCase().includes('lei');
  const isHongKong = company.registry_source?.toLowerCase().includes('hong kong') || 
                     company.registry_source?.toLowerCase().includes('hk') ||
                     company.registry_source?.toLowerCase().includes('icris');
  const isASIC = company.registry_source?.toLowerCase().includes('asic') || 
                 company.registry_source?.toLowerCase().includes('australia');
  
  const renderAddress = () => {
    if (!company.address) return "N/A";
    if (typeof company.address === 'string') return company.address;
    
    const addr = company.address;
    const parts = [
      addr.address_line_1,
      addr.address_line_2,
      addr.locality,
      addr.postal_code,
      addr.region,
      addr.country
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const renderPSC = () => {
    if (!company.psc || company.psc.length === 0) return "No PSC data available";
    
    return (
      <div className="space-y-2">
        {company.psc.map((person: any, index: number) => (
          <div key={index} className="p-3 bg-muted/30 rounded-lg">
            <p className="font-medium text-foreground">{person.name || "Unknown"}</p>
            <p className="text-sm text-muted-foreground">{person.kind || person.nature_of_control?.[0] || "N/A"}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderSICCodes = () => {
    if (!company.sic_codes || company.sic_codes.length === 0) return "N/A";
    return company.sic_codes.join(", ");
  };

  const getNatureOfBusiness = () => {
    if (company.raw_payload?.company_type_description) {
      return company.raw_payload.company_type_description;
    }
    return company.company_type || "N/A";
  };

  const getRegistrySourceLabel = () => {
    if (isCompaniesHouse) return "UK Companies House";
    if (isGLEIF) return "GLEIF / LEI Number";
    if (isHongKong) return "Hong Kong ICRIS";
    if (isASIC) return "Australian ASIC";
    return company.registry_source || "Unknown";
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-card border-border relative animate-fade-in">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-4 right-4"
      >
        <X className="w-4 h-4" />
      </Button>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">{company.legal_name}</h2>
            <div className="flex gap-2">
              <Badge variant={company.status === "Active" ? "default" : "secondary"}>
                {company.status}
              </Badge>
              <Badge variant="outline">{getRegistrySourceLabel()}</Badge>
              <Badge variant="outline">{company.registry_id}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Company/Entity Number */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {isGLEIF ? "LEI Number" : isHongKong ? "Registry Number" : "Company Number"}
              </span>
            </div>
            <p className="text-foreground font-mono">{company.registry_id}</p>
          </div>

          {/* Incorporation/Registration Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {isGLEIF ? "Registration Date" : "Incorporation Date"}
              </span>
            </div>
            <p className="text-foreground">
              {company.incorporation_date 
                ? new Date(company.incorporation_date).toLocaleDateString() 
                : "N/A"}
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {isGLEIF ? "Entity Status" : "Company Status"}
              </span>
            </div>
            <Badge variant={company.status === "Active" ? "default" : "secondary"}>
              {company.status}
            </Badge>
          </div>

          {/* Company/Entity Type */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {isGLEIF ? "Entity Type" : "Company Type"}
              </span>
            </div>
            <p className="text-foreground">{company.company_type || "N/A"}</p>
          </div>

          {/* Region/Jurisdiction */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {isGLEIF ? "Jurisdiction" : isHongKong ? "Region" : "Region"}
              </span>
            </div>
            <p className="text-foreground">{company.jurisdiction || "N/A"}</p>
          </div>

          {/* Website / Domain Availability */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-semibold">Website / Domain</span>
            </div>
            <p className="text-foreground">
              {company.website || (company.domain_available === false ? "Domain Taken" : "N/A")}
            </p>
          </div>
        </div>

        {/* SIC Codes - Only for Companies House */}
        {isCompaniesHouse && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-semibold">SIC Codes</span>
            </div>
            <p className="text-foreground">{renderSICCodes()}</p>
          </div>
        )}

        {/* Registered Office Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {isGLEIF ? "Legal Address" : "Registered Office Address"}
            </span>
          </div>
          <p className="text-foreground">{renderAddress()}</p>
        </div>

        {/* Nature of Business */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-semibold">Nature of Business</span>
          </div>
          <p className="text-foreground">{getNatureOfBusiness()}</p>
        </div>

        {/* People with Significant Control - Only for Companies House */}
        {isCompaniesHouse && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm font-semibold">People with Significant Control (PSC)</span>
            </div>
            {renderPSC()}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Filing History Available - Only for Companies House and ASIC */}
          {(isCompaniesHouse || isASIC) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-semibold">Filing History</span>
              </div>
              <Badge variant="outline">
                {company.raw_payload?.has_filing_history ? "Available" : "Not Available"}
              </Badge>
            </div>
          )}

          {/* Online Presence Strength */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">Online Presence</span>
            </div>
            <p className="text-foreground">
              {company.web_presence_score !== null 
                ? `${company.web_presence_score}/100` 
                : "N/A"}
            </p>
          </div>

          {/* Negative Press Check */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Negative Press</span>
            </div>
            <Badge variant={company.negative_press_flag ? "destructive" : "default"}>
              {company.negative_press_flag ? "Flagged" : "Clear"}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
