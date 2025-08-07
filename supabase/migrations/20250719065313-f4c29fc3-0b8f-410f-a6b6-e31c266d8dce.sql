-- Réactiver RLS sur toutes les tables avec des politiques très permissives
-- qui n'entravent aucune fonctionnalité

-- Activer RLS sur toutes les tables
ALTER TABLE public.conciergeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villes ENABLE ROW LEVEL SECURITY;

-- Politiques très permissives pour conciergeries
CREATE POLICY "Allow all operations on conciergeries" ON public.conciergeries FOR ALL USING (true) WITH CHECK (true);

-- Politiques très permissives pour formules
CREATE POLICY "Allow all operations on formules" ON public.formules FOR ALL USING (true) WITH CHECK (true);

-- Politiques très permissives pour subscriptions
CREATE POLICY "Allow all operations on subscriptions" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);

-- Politiques très permissives pour profiles
CREATE POLICY "Allow all operations on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- Politiques très permissives pour leads
CREATE POLICY "Allow all operations on leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- Politiques très permissives pour avis
CREATE POLICY "Allow all operations on avis" ON public.avis FOR ALL USING (true) WITH CHECK (true);

-- Politiques très permissives pour contact_messages
CREATE POLICY "Allow all operations on contact_messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

-- Politiques très permissives pour articles
CREATE POLICY "Allow all operations on articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);

-- Politiques très permissives pour villes
CREATE POLICY "Allow all operations on villes" ON public.villes FOR ALL USING (true) WITH CHECK (true);