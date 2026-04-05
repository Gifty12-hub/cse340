-- First delete inventory items linked to hh and New Car classifications
DELETE FROM public.inventory
WHERE classification_id IN (
        SELECT classification_id
        FROM public.classification
        WHERE classification_name = 'hh'
            OR classification_name = 'New Car'
    );
-- Then delete the classifications
DELETE FROM public.classification
WHERE classification_name = 'hh'
    OR classification_name = 'New Car';