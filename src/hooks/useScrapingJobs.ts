import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ScrapingJob {
  id: string;
  source: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  search_term?: string;
  records_fetched: number;
  records_processed: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export const useScrapingJobs = () => {
  const [jobs, setJobs] = useState<ScrapingJob[]>([]);
  const [activeJobs, setActiveJobs] = useState<number>(0);

  // Fetch recent jobs
  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('scraping_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setJobs(data as ScrapingJob[] || []);
      setActiveJobs(data?.filter((j) => j.status === 'running' || j.status === 'pending').length || 0);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  // Subscribe to realtime job updates
  useEffect(() => {
    fetchJobs();

    const channel = supabase
      .channel('jobs-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scraping_jobs' },
        (payload) => {
          console.log('Job update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setJobs((prev) => [payload.new as ScrapingJob, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setJobs((prev) =>
              prev.map((j) => (j.id === payload.new.id ? (payload.new as ScrapingJob) : j))
            );

            // Show toast for completed/failed jobs
            const job = payload.new as ScrapingJob;
            if (job.status === 'completed') {
              toast.success(`Scrape completed! ${job.records_processed} entities processed`);
            } else if (job.status === 'failed') {
              toast.error(`Scrape failed: ${job.error_message}`);
            }
          }

          // Recalculate active jobs
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    jobs,
    activeJobs,
    fetchJobs,
  };
};
