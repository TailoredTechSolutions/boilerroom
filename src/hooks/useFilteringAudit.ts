import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FilteringAuditRecord {
  id: string;
  company_name: string;
  scraping_job_id: string | null;
  filter_type: string;
  blocked: boolean;
  sentiment_score: number | null;
  articles_found: number | null;
  top_article_title: string | null;
  top_article_url: string | null;
  decision_details: any;
  created_at: string;
}

export const useFilteringAudit = (days: number = 7) => {
  return useQuery({
    queryKey: ['filtering-audit', days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('filtering_audit')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FilteringAuditRecord[];
    },
  });
};

export const useFilteringStats = (days: number = 7) => {
  return useQuery({
    queryKey: ['filtering-stats', days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('filtering_audit')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      const records = data as FilteringAuditRecord[];
      const total = records.length;
      const blocked = records.filter(r => r.blocked).length;
      const byType = records.reduce((acc, r) => {
        acc[r.filter_type] = (acc[r.filter_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sentimentScores = records
        .filter(r => r.sentiment_score !== null)
        .map(r => r.sentiment_score as number);

      return {
        total,
        blocked,
        blockRate: total > 0 ? (blocked / total) * 100 : 0,
        byType,
        sentimentScores,
      };
    },
  });
};