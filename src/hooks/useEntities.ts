import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Entity {
  id: string;
  legal_name: string;
  trading_name?: string;
  registry_id: string;
  registry_source: string;
  country: string;
  status: 'Active' | 'Inactive' | 'Dissolved' | 'Unknown';
  score: number;
  website?: string;
  created_at: string;
  updated_at: string;
  raw_payload?: any;
  filter_status?: string;
  filter_notes?: string[];
  domain_available?: boolean;
  domain_status?: any;
  news_mentions?: any;
  social_media_presence?: any;
  officers_data?: any;
}

interface FilterState {
  status: string;
  scoreRange: [number, number];
  country: string;
  source?: string;
  filterStatus?: string;
  hasNegativePress?: boolean;
  domainAvailable?: boolean;
}

export const useEntities = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch entities from database
  const fetchEntities = async () => {
    try {
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .order('score', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      setEntities(data as Entity[] || []);
      setFilteredEntities(data as Entity[] || []);
    } catch (error) {
      console.error('Error fetching entities:', error);
      toast.error('Failed to load entities');
    }
  };

  // Subscribe to realtime updates
  useEffect(() => {
    fetchEntities();

    const channel = supabase
      .channel('entities-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'entities' },
        (payload) => {
          console.log('New entity added:', payload.new);
          setEntities((prev) => [payload.new as Entity, ...prev]);
          toast.success('New entity discovered!');
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'entities' },
        (payload) => {
          console.log('Entity updated:', payload.new);
          setEntities((prev) =>
            prev.map((e) => (e.id === payload.new.id ? (payload.new as Entity) : e))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Apply filters
  const applyFilters = (filters: FilterState) => {
    let filtered = entities;

    if (filters.status !== 'all') {
      filtered = filtered.filter(
        (e) => e.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.country !== 'all') {
      filtered = filtered.filter((e) => e.country === filters.country);
    }

    if (filters.source) {
      filtered = filtered.filter((e) => e.registry_source === filters.source);
    }

    // Filter by qualification status
    if (filters.filterStatus) {
      filtered = filtered.filter((e) => e.filter_status === filters.filterStatus);
    }

    // Filter by negative press
    if (filters.hasNegativePress !== undefined) {
      filtered = filtered.filter(
        (e) => e.news_mentions?.has_negative_press === filters.hasNegativePress
      );
    }

    // Filter by domain availability
    if (filters.domainAvailable !== undefined) {
      filtered = filtered.filter((e) => e.domain_available === filters.domainAvailable);
    }

    filtered = filtered.filter(
      (e) => e.score >= filters.scoreRange[0] && e.score <= filters.scoreRange[1]
    );

    setFilteredEntities(filtered);
  };

  // Trigger scraping job
  const triggerScrape = async (source: string, searchTerm?: string) => {
    setIsLoading(true);
    const toastId = toast.loading('Initiating scrape...');

    try {
      // Supabase client automatically includes auth headers
      const { data, error } = await supabase.functions.invoke('trigger-scrape', {
        body: { source, searchTerm, filters: {} },
      });

      if (error) {
        throw error;
      }

      if (!data?.success || !data?.jobId) {
        throw new Error('Scraper did not start');
      }

      toast.dismiss(toastId);
      toast.success(`Scraping job started: ${data.jobId}`);
      
      // Refresh entities after a delay
      setTimeout(fetchEntities, 3000);
    } catch (error) {
      console.error('Error triggering scrape:', error);
      toast.dismiss(toastId);
      toast.error('Failed to start scrape job');
    } finally {
      setIsLoading(false);
    }
  };

  // Export entities
  const exportEntities = async (filters: FilterState, format: 'CSV' | 'JSON' = 'CSV') => {
    const toastId = toast.loading('Generating export...');
    
    try {
      // Supabase client automatically includes auth headers
      const { data, error } = await supabase.functions.invoke('export-entities', {
        body: {
          filters: {
            source: filters.source,
            status: filters.status !== 'all' ? [filters.status] : undefined,
            country: filters.country,
            minScore: filters.scoreRange[0],
            maxScore: filters.scoreRange[1],
          },
          columns: [
            'legal_name',
            'registry_source',
            'registry_id',
            'status',
            'score',
            'country',
            'website',
            'filter_status',
            'filter_notes',
            'domain_available',
            'officers_data',
            'updated_at',
          ],
          format,
        },
      });

      if (error) throw error;

      toast.dismiss(toastId);
      toast.success('Export completed!');
      
      // Download the file
      const blob = new Blob([data], { type: format === 'CSV' ? 'text/csv' : 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `entities_export_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
      a.click();
    } catch (error) {
      console.error('Error exporting entities:', error);
      toast.dismiss(toastId);
      toast.error('Failed to export entities');
    }
  };

  return {
    entities,
    filteredEntities,
    isLoading,
    fetchEntities,
    applyFilters,
    triggerScrape,
    exportEntities,
  };
};
