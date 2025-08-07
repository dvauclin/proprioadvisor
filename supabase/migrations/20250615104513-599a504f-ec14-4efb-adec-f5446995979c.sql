
-- This query will update all articles to remove trailing slashes from internal relative links
-- Example: href="/my-page/" becomes href="/my-page"
UPDATE articles
SET contenu = regexp_replace(
  contenu,
  'href="(/[^"\s]+)/"', -- find href="/path/" but not href="/"
  'href="\1"',          -- replace with href="/path"
  'g'
);

-- This query will update all articles to remove trailing slashes from internal absolute links for proprioadvisor.fr
-- Example: href="https://proprioadvisor.fr/my-page/" becomes href="https://proprioadvisor.fr/my-page"
UPDATE articles
SET contenu = regexp_replace(
  contenu,
  'href="(https://proprioadvisor.fr/[^"\s]+)/"', -- find href="https://.../path/" but not href="https://.../"
  'href="\1"',                                  -- replace with href="https://.../path"
  'g'
);
