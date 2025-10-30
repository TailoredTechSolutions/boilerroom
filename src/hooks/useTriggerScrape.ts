import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ScrapeSource = 'COMPANIES_HOUSE' | 'CH' | 'GLEIF' | 'SEC_EDGAR' | 'ASIC';

export interface TriggerScrapeParams {
  source: ScrapeSource;
  searchTerm?: string;
  filters?: Record<string, unknown>;
}

export const useTriggerScrape = () => {
  const [isLoading, setIsLoading] = useState(false);

  const triggerScrape = async (params: TriggerScrapeParams) => {
    setIsLoading(true);

    try {
      console.log('Triggering scrape with params:', params);

      const { data, error } = await supabase.functions.invoke('trigger-scrape', {
        body: {
          source: params.source,
          searchTerm: params.searchTerm,
          filters: params.filters,
        },
      });

      if (error) {
        console.error('Error triggering scrape:', error);
        toast.error(`Failed to start scrape: ${error.message}`);
        throw error;
      }

      console.log('Scrape triggered successfully:', data);
      toast.success(`Scraping job started successfully! Job ID: ${data.jobId}`);

      return data;
    } catch (error) {
      console.error('Failed to trigger scrape:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to start scrape: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    triggerScrape,
    isLoading,
  };
};
