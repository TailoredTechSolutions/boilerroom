import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCleanupJobs = () => {
  const [isLoading, setIsLoading] = useState(false);

  const cleanupStaleJobs = async () => {
    setIsLoading(true);

    try {
      console.log('Triggering cleanup of stuck jobs...');

      const { data, error } = await supabase.functions.invoke('cleanup-stale-jobs', {
        body: {}
      });

      if (error) {
        console.error('Error cleaning up jobs:', error);
        toast.error(`Failed to clean up jobs: ${error.message}`);
        throw error;
      }

      console.log('Cleanup completed:', data);

      if (data.cleaned === 0) {
        toast.info('No stuck jobs found to clean up');
      } else {
        toast.success(`Successfully cleaned up ${data.cleaned} stuck job${data.cleaned > 1 ? 's' : ''}`);
      }

      return data;
    } catch (error) {
      console.error('Failed to cleanup jobs:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to clean up jobs: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cleanupStaleJobs,
    isLoading,
  };
};
