-- Clean up dummy data entries (those with registry_id patterns from test generation)
DELETE FROM entities 
WHERE registry_id LIKE 'COMPANIES_HOUSE-%' 
   OR registry_id LIKE 'GLEIF-%' 
   OR registry_id LIKE 'SEC_EDGAR-%' 
   OR registry_id LIKE 'ASIC-%';