import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Company {
  name: string;
  logo: string;
  valuation?: string;
}

const companies: Company[] = [
  { name: "SpaceX", logo: "🚀", valuation: "$180.0B" },
  { name: "OpenAI", logo: "🤖", valuation: "$86.0B" },
  { name: "Stripe", logo: "💳", valuation: "$61.7B" },
  { name: "Klarna", logo: "💰", valuation: "$6.5B" },
  { name: "Revolut", logo: "🏦" },
  { name: "StubHub", logo: "🎫" },
  { name: "Databricks", logo: "📊" },
  { name: "Discord", logo: "💬" },
];

export const CompanyTicker = () => {
  const [isPaused, setIsPaused] = useState(false);
  
  // Duplicate companies for seamless loop
  const duplicatedCompanies = [...companies, ...companies];
  
  return (
    <section className="py-12 relative overflow-hidden">
      <div 
        className="flex gap-6 animate-scroll"
        style={{
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedCompanies.map((company, index) => (
          <Card
            key={`${company.name}-${index}`}
            className="flex-shrink-0 w-48 h-32 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="h-full flex flex-col items-center justify-center p-4 space-y-2">
              <span className="text-4xl">{company.logo}</span>
              <p className="font-semibold text-sm text-center">{company.name}</p>
              {company.valuation && (
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium">Valuation</p>
                  <p className="text-primary font-bold">{company.valuation}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
};
