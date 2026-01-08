-- =====================================================
-- FIX: Ajouter la policy INSERT pour les profils
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- 1. Supprimer la policy INSERT si elle existe déjà
DROP POLICY IF EXISTS "Les utilisateurs peuvent créer leur profil" ON profiles;

-- 2. Créer la policy qui permet aux users de créer leur profil
CREATE POLICY "Les utilisateurs peuvent créer leur profil"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. Vérifier que ça fonctionne
SELECT 'Policy INSERT créée avec succès pour profiles !' as message;
