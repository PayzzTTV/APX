-- ====================================
-- SCHEMA SQL POUR LES FAVORIS
-- Table favorites + RLS policies
-- À exécuter dans Supabase SQL Editor
-- ====================================

-- 1. Créer la table FAVORITES
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contrainte : un utilisateur ne peut ajouter une voiture en favori qu'une seule fois
  UNIQUE(user_id, car_id)
);

-- 2. Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_car_id ON favorites(car_id);

-- 3. Activer RLS sur la table favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 4. Policies pour FAVORITES

-- Les utilisateurs peuvent voir leurs propres favoris
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leurs favoris" ON favorites;
CREATE POLICY "Les utilisateurs peuvent voir leurs favoris"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent ajouter un favori
DROP POLICY IF EXISTS "Les utilisateurs peuvent ajouter un favori" ON favorites;
CREATE POLICY "Les utilisateurs peuvent ajouter un favori"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs favoris
DROP POLICY IF EXISTS "Les utilisateurs peuvent supprimer leurs favoris" ON favorites;
CREATE POLICY "Les utilisateurs peuvent supprimer leurs favoris"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ====================================
-- FIN DU SCHEMA FAVORIS
-- ====================================
