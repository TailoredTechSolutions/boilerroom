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
  officers: any[] | null;
  email_contacts: string[] | null;
  website: string | null;
  domain_available: boolean | null;
  web_presence_score: number | null;
  negative_press_flag: boolean | null;
  country: string | null;
  last_seen: string | null;
  data_quality_score: number | null;
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

  const renderDirectors = () => {
    const officers = company.psc || company.raw_payload?.officers || [];
    if (!officers || officers.length === 0) return "N/A";
    
    return (
      <div className="space-y-2">
        {officers.map((officer: any, index: number) => (
          <div key={index} className="p-3 bg-muted/30 rounded-lg">
            <p className="font-medium text-foreground">{officer.name || officer.officer_name || "Unknown"}</p>
            <p className="text-sm text-muted-foreground">{officer.officer_role || officer.kind || "Director"}</p>
          </div>
        ))}
      </div>
    );
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

        {/* LEI Number - Basic Fields for now */}
        {isGLEIF && !isHongKong && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-semibold">LEI Number</span>
                </div>
                <p className="text-foreground font-mono">{company.registry_id}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">Registration Date</span>
                </div>
                <p className="text-foreground">
                  {company.incorporation_date 
                    ? new Date(company.incorporation_date).toLocaleDateString() 
                    : "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">Entity Status</span>
                </div>
                <Badge variant={company.status === "Active" ? "default" : "secondary"}>
                  {company.status || "Unknown"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-semibold">Entity Type</span>
                </div>
                <p className="text-foreground">{company.company_type || "N/A"}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-semibold">Jurisdiction</span>
                </div>
                <p className="text-foreground">{company.jurisdiction || "N/A"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-semibold">Legal Address</span>
              </div>
              <p className="text-foreground">{renderAddress()}</p>
            </div>
          </>
        )}

        {/* Hong Kong ICRIS Specific Fields */}
        {isHongKong && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Company Name */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-semibold">Company Name (English / Chinese)</span>
                </div>
                <p className="text-foreground">{company.legal_name}</p>
              </div>

              {/* Company Number (CR Number) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-semibold">Company Number (CR Number)</span>
                </div>
                <p className="text-foreground font-mono">{company.registry_id}</p>
              </div>

              {/* Company Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-semibold">Company Type (Private / Public / Non-HK)</span>
                </div>
                <p className="text-foreground">{company.company_type || "N/A"}</p>
              </div>

              {/* Incorporation Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">Incorporation Date</span>
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
                  <span className="text-sm font-semibold">Status (Live / Dissolved / Dormant)</span>
                </div>
                <Badge variant={company.status === "Active" ? "default" : "secondary"}>
                  {company.status || "Unknown"}
                </Badge>
              </div>

              {/* Place of Incorporation */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-semibold">Place of Incorporation</span>
                </div>
                <p className="text-foreground">{company.jurisdiction || "N/A"}</p>
              </div>
            </div>

            {/* Registered Office Address */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-semibold">Registered Office Address</span>
              </div>
              <p className="text-foreground">{renderAddress()}</p>
            </div>

            {/* Business Nature / Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-semibold">Business Nature / Description</span>
              </div>
              <p className="text-foreground">{getNatureOfBusiness()}</p>
            </div>

            {/* Director(s) / Officer(s) Names */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold">Director(s) / Officer(s) Names</span>
              </div>
              {renderDirectors()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Share Capital Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-semibold">Share Capital Information</span>
                </div>
                <p className="text-foreground">{company.raw_payload?.share_capital || "N/A"}</p>
              </div>

              {/* Document Filing History */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-semibold">Document Filing History</span>
                </div>
                <Badge variant="outline">
                  {company.raw_payload?.has_filing_history ? "Available" : "Not Available"}
                </Badge>
              </div>

              {/* Last Annual Return Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">Last Annual Return Date</span>
                </div>
                <p className="text-foreground">
                  {company.raw_payload?.last_annual_return_date 
                    ? new Date(company.raw_payload.last_annual_return_date).toLocaleDateString() 
                    : "N/A"}
                </p>
              </div>

              {/* Business Registration Number (BRN) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-semibold">Business Registration Number (BRN)</span>
                </div>
                <p className="text-foreground font-mono">{company.raw_payload?.brn || "N/A"}</p>
              </div>

              {/* Parent / Holding Company */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-semibold">Parent / Holding Company</span>
                </div>
                <p className="text-foreground">{company.raw_payload?.parent_company || "N/A"}</p>
              </div>
            </div>

            {/* Remarks / Special Notes */}
            {company.raw_payload?.remarks && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">Remarks / Special Notes</span>
                </div>
                <p className="text-foreground">{company.raw_payload.remarks}</p>
              </div>
            )}
          </>
        )}

        {/* Companies House Specific Fields */}
        {isCompaniesHouse && (
          <>
            {/* Entity Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Entity Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Company Name</span>
                  </div>
                  <p className="text-foreground">{company.legal_name}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-semibold">Company Number</span>
                  </div>
                  <p className="text-foreground font-mono">{company.registry_id}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Company Type</span>
                  </div>
                  <p className="text-foreground">{company.company_type || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-semibold">Incorporation Date</span>
                  </div>
                  <p className="text-foreground">
                    {company.incorporation_date 
                      ? new Date(company.incorporation_date).toLocaleDateString() 
                      : "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">Status</span>
                  </div>
                  <Badge variant={company.status === "Active" ? "default" : "secondary"}>
                    {company.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-semibold">SIC Code(s)</span>
                  </div>
                  <p className="text-foreground">{renderSICCodes()}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Industry Description</span>
                  </div>
                  <p className="text-foreground">{company.raw_payload?.industry_description || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-semibold">Country of Registration</span>
                  </div>
                  <p className="text-foreground">{company.country || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-semibold">Jurisdiction</span>
                  </div>
                  <p className="text-foreground">{company.jurisdiction || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Company Category</span>
                  </div>
                  <p className="text-foreground">{company.raw_payload?.company_category || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Company Subtype</span>
                  </div>
                  <p className="text-foreground">{company.raw_payload?.company_subtype || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Nature of Business</span>
                  </div>
                  <p className="text-foreground">{getNatureOfBusiness()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-semibold">Registered Office Address</span>
                </div>
                <p className="text-foreground">{renderAddress()}</p>
              </div>
            </div>

            {/* Filing & Compliance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Filing & Compliance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-semibold">Last Accounts Filed Date</span>
                  </div>
                  <p className="text-foreground">
                    {company.raw_payload?.last_accounts_filed 
                      ? new Date(company.raw_payload.last_accounts_filed).toLocaleDateString() 
                      : "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-semibold">Next Accounts Due Date</span>
                  </div>
                  <p className="text-foreground">
                    {company.raw_payload?.next_accounts_due 
                      ? new Date(company.raw_payload.next_accounts_due).toLocaleDateString() 
                      : "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-semibold">Last Confirmation Statement Date</span>
                  </div>
                  <p className="text-foreground">
                    {company.raw_payload?.last_confirmation_statement 
                      ? new Date(company.raw_payload.last_confirmation_statement).toLocaleDateString() 
                      : "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-semibold">Next Confirmation Statement Due Date</span>
                  </div>
                  <p className="text-foreground">
                    {company.raw_payload?.next_confirmation_statement_due 
                      ? new Date(company.raw_payload.next_confirmation_statement_due).toLocaleDateString() 
                      : "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-semibold">Accounting Reference Date</span>
                  </div>
                  <p className="text-foreground">
                    {company.raw_payload?.accounting_reference_date 
                      ? new Date(company.raw_payload.accounting_reference_date).toLocaleDateString() 
                      : "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-semibold">Filing Status</span>
                  </div>
                  <Badge variant={company.raw_payload?.filing_status === "Up to Date" ? "default" : "secondary"}>
                    {company.raw_payload?.filing_status || "N/A"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-semibold">Document Filing History Link</span>
                  </div>
                  <p className="text-foreground">{company.raw_payload?.filing_history_link || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-semibold">Annual Return Status</span>
                  </div>
                  <p className="text-foreground">{company.raw_payload?.annual_return_status || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-semibold">Insolvency Notices</span>
                  </div>
                  <p className="text-foreground">{company.raw_payload?.insolvency_notices || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* People & Officers */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">People & Officers</h3>
              {company.officers && company.officers.length > 0 ? (
                <div className="space-y-3">
                  {company.officers.map((officer: any, index: number) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Director Name</span>
                        <p className="font-medium text-foreground">{officer.name || officer.officer_name || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Role</span>
                        <p className="text-foreground">{officer.officer_role || officer.role || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Appointment Date</span>
                        <p className="text-foreground">
                          {officer.appointed_on 
                            ? new Date(officer.appointed_on).toLocaleDateString() 
                            : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Nationality</span>
                        <p className="text-foreground">{officer.nationality || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Country of Residence</span>
                        <p className="text-foreground">{officer.country_of_residence || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Occupation</span>
                        <p className="text-foreground">{officer.occupation || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Date of Birth (Year)</span>
                        <p className="text-foreground">{officer.date_of_birth?.year || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Officer ID</span>
                        <p className="text-foreground font-mono text-xs">{officer.officer_id || "N/A"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No officer information available</p>
              )}
            </div>

            {/* Ownership & Control */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Ownership & Control</h3>
              {company.psc && company.psc.length > 0 ? (
                <div className="space-y-3">
                  {company.psc.map((person: any, index: number) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">PSC Name</span>
                        <p className="font-medium text-foreground">{person.name || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">PSC Type</span>
                        <p className="text-foreground">{person.kind || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">PSC Nationality</span>
                        <p className="text-foreground">{person.nationality || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">PSC Country of Residence</span>
                        <p className="text-foreground">{person.country_of_residence || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Nature of Control</span>
                        <p className="text-foreground">
                          {person.natures_of_control 
                            ? (Array.isArray(person.natures_of_control) 
                                ? person.natures_of_control.join(", ") 
                                : person.natures_of_control)
                            : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">PSC Notified Date</span>
                        <p className="text-foreground">
                          {person.notified_on 
                            ? new Date(person.notified_on).toLocaleDateString() 
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No PSC information available</p>
              )}
            </div>

            {/* Financial Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Financial Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">Total Assets</span>
                  </div>
                  <p className="text-foreground">{company.raw_payload?.total_assets || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">Current Liabilities</span>
                  </div>
                  <p className="text-foreground">{company.raw_payload?.current_liabilities || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">Net Worth / Shareholder Equity</span>
                  </div>
                  <p className="text-foreground">{company.raw_payload?.net_worth || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">Turnover</span>
                  </div>
                  <p className="text-foreground">{company.raw_payload?.turnover || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">Cash at Bank</span>
                  </div>
                  <p className="text-foreground">{company.raw_payload?.cash_at_bank || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-semibold">Number of Employees</span>
                  </div>
                  <p className="text-foreground">{company.raw_payload?.employees || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">Annual Revenue (estimated)</span>
                  </div>
                  <p className="text-foreground">{company.raw_payload?.annual_revenue || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Contact & Communication */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Contact & Communication</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-semibold">Company Website</span>
                  </div>
                  <p className="text-foreground">{company.website || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-semibold">Domain Availability</span>
                  </div>
                  <Badge variant={company.domain_available === false ? "secondary" : "default"}>
                    {company.domain_available === null ? "N/A" : company.domain_available ? "Available" : "Taken"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-semibold">Contact Email</span>
                  </div>
                  <p className="text-foreground">
                    {company.email_contacts && Array.isArray(company.email_contacts) && company.email_contacts.length > 0
                      ? company.email_contacts.join(", ")
                      : "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-semibold">Phone Number</span>
                  </div>
                  <p className="text-foreground">{company.raw_payload?.phone || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">Online Presence Score</span>
                  </div>
                  <p className="text-foreground">
                    {company.web_presence_score !== null 
                      ? `${Math.round(company.web_presence_score * 100)}/100` 
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-semibold">Data Source</span>
                  </div>
                  <p className="text-foreground">{getRegistrySourceLabel()}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-semibold">Last Synced Date</span>
                  </div>
                  <p className="text-foreground">
                    {company.last_seen 
                      ? new Date(company.last_seen).toLocaleDateString() 
                      : "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">Sync Status</span>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">Record Confidence Score</span>
                  </div>
                  <p className="text-foreground">
                    {company.data_quality_score !== null 
                      ? `${Math.round(company.data_quality_score * 100)}/100` 
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ASIC - Use generic fields */}
        {isASIC && !isGLEIF && !isHongKong && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-semibold">Registry Number</span>
                </div>
                <p className="text-foreground font-mono">{company.registry_id}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">Incorporation Date</span>
                </div>
                <p className="text-foreground">
                  {company.incorporation_date 
                    ? new Date(company.incorporation_date).toLocaleDateString() 
                    : "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">Status</span>
                </div>
                <Badge variant={company.status === "Active" ? "default" : "secondary"}>
                  {company.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-semibold">Company Type</span>
                </div>
                <p className="text-foreground">{company.company_type || "N/A"}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-semibold">Region</span>
                </div>
                <p className="text-foreground">{company.jurisdiction || "N/A"}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-semibold">Website</span>
                </div>
                <p className="text-foreground">{company.website || "N/A"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-semibold">Registered Address</span>
              </div>
              <p className="text-foreground">{renderAddress()}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-semibold">Business Description</span>
              </div>
              <p className="text-foreground">{getNatureOfBusiness()}</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
