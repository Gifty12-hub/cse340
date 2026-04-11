CREATE TABLE IF NOT EXISTS public.inquiries (
  inquiry_id     SERIAL PRIMARY KEY,
  inv_id         INTEGER NOT NULL
                   REFERENCES public.inventory(inv_id)
                   ON DELETE CASCADE,
  customer_name  VARCHAR(100) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20),
  message        TEXT NOT NULL,
  inquiry_date   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_inv_id
  ON public.inquiries(inv_id);

CREATE INDEX IF NOT EXISTS idx_inquiries_email
  ON public.inquiries(customer_email);