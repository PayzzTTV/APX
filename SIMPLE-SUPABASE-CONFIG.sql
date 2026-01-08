-- =====================================================
-- CONFIGURATION SUPABASE SIMPLIFIÉE POUR APX
-- Exécutez ce fichier dans Supabase SQL Editor
-- =====================================================

-- 1. SUPPRIMER le trigger et la fonction (on n'en a plus besoin)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Vérifier que les policies RLS existent sur profiles
-- Ces policies permettent au code de créer/lire/modifier les profils

-- Policy SELECT
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON profiles;
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy INSERT (CRITIQUE pour la création de compte)
-- Permet l'insertion si l'ID existe dans auth.users (même sans session active)
DROP POLICY IF EXISTS "Les utilisateurs peuvent créer leur profil" ON profiles;
CREATE POLICY "Les utilisateurs peuvent créer leur profil"
  ON profiles FOR INSERT
  WITH CHECK (
    id IN (SELECT id FROM auth.users)
  );

-- Policy UPDATE
DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur profil" ON profiles;
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur profil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 3. Activer RLS sur la table profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Vérification finale
SELECT 'Configuration Supabase simplifiée terminée ! ✅' as message;
