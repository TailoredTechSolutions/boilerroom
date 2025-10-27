-- Add is_saved flag to entities table
ALTER TABLE public.entities 
ADD COLUMN IF NOT EXISTS is_saved boolean DEFAULT false;

-- Remove duplicates, keeping the most recent entry for each registry_id
DELETE FROM public.entities a
USING public.entities b
WHERE a.id < b.id 
  AND a.registry_id = b.registry_id 
  AND a.registry_source = b.registry_source;

-- Create index for better performance on saved flag queries
CREATE INDEX IF NOT EXISTS idx_entities_is_saved ON public.entities(is_saved);
CREATE INDEX IF NOT EXISTS idx_entities_source_saved ON public.entities(registry_source, is_saved);