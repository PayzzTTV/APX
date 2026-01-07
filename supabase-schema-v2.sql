-- ====================================
-- SCHEMA SQL V2 POUR APX (Application Mobile)
-- Modèle d'abonnement illimité
-- À exécuter dans Supabase SQL Editor
-- ====================================

-- 1. Table PROFILES (liée à auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pour créer automatiquement un profil quand un user s'inscrit
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_status)
  VALUES (NEW.id, NEW.email, 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Table CARS (voitures disponibles) - VERSION ENRICHIE
-- Supprimer et recréer la table pour ajouter les nouvelles colonnes
DROP TABLE IF EXISTS cars CASCADE;
CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  image_url TEXT,
  price_per_day DECIMAL(10, 2) DEFAULT 0, -- Gardé pour compatibilité mais non affiché
  rating DECIMAL(2, 1) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),

  -- Description
  description TEXT,

  -- Caractéristiques techniques
  weight_kg INTEGER, -- Poids en kg
  length_cm INTEGER, -- Longueur en cm
  width_cm INTEGER, -- Largeur en cm
  height_cm INTEGER, -- Hauteur en cm

  -- Expérience utilisateur
  comfort_level INTEGER CHECK (comfort_level >= 1 AND comfort_level <= 5), -- Niveau de confort (1-5)
  finish_level INTEGER CHECK (finish_level >= 1 AND finish_level <= 5), -- Niveau de finition (1-5)

  -- Catégorie
  category TEXT CHECK (category IN ('citadine', 'compacte', 'berline', 'suv', 'sportive', 'electrique', 'luxe')),

  -- Disponibilité
  is_available BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table BOOKINGS (réservations) - VERSION MISE À JOUR
-- Supprimer et recréer pour gérer les nouvelles relations
DROP TABLE IF EXISTS bookings CASCADE;
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_price DECIMAL(10, 2) DEFAULT 0, -- Toujours 0 dans le modèle abonnement
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contrainte : end_date doit être après start_date
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_cars_category ON cars(category);
CREATE INDEX IF NOT EXISTS idx_cars_available ON cars(is_available);

-- ====================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies pour PROFILES
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON profiles;
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur profil" ON profiles;
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur profil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies pour CARS (tout le monde peut voir les voitures)
DROP POLICY IF EXISTS "Tout le monde peut voir les voitures" ON cars;
CREATE POLICY "Tout le monde peut voir les voitures"
  ON cars FOR SELECT
  TO authenticated, anon
  USING (true);

-- Policies pour BOOKINGS
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leurs propres réservations" ON bookings;
CREATE POLICY "Les utilisateurs peuvent voir leurs propres réservations"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Les utilisateurs peuvent créer une réservation" ON bookings;
CREATE POLICY "Les utilisateurs peuvent créer une réservation"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leurs réservations" ON bookings;
CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs réservations"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- ====================================
-- DONNÉES DE TEST - 12 VÉHICULES VARIÉS
-- ====================================

-- Supprimer les anciennes données
DELETE FROM bookings;
DELETE FROM cars;

-- 1. FIAT 500 - Citadine du garagiste
INSERT INTO cars (name, brand, model, year, image_url, rating, description, weight_kg, length_cm, width_cm, height_cm, comfort_level, finish_level, category, is_available) VALUES
('Fiat 500', 'Fiat', '500', 2022, 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800', 4.5,
'La Fiat 500 est une citadine emblématique alliant charme italien et praticité urbaine. Parfaite pour se faufiler dans les rues étroites, elle offre une expérience de conduite agréable avec son style rétro-moderne unique. Idéale pour vos trajets quotidiens en ville.',
1135, 357, 163, 149, 3, 4, 'citadine', true);

-- 2. PEUGEOT 208 - Compacte polyvalente
INSERT INTO cars (name, brand, model, year, image_url, rating, description, weight_kg, length_cm, width_cm, height_cm, comfort_level, finish_level, category, is_available) VALUES
('Peugeot 208', 'Peugeot', '208', 2023, 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800', 4.7,
'Compacte moderne dotée d''un i-Cockpit 3D innovant et d''équipements connectés de pointe. Son design affûté et ses technologies embarquées en font une alliée parfaite pour la ville comme pour les escapades. Confort et modernité garantis.',
1220, 406, 175, 143, 4, 4, 'compacte', true);

-- 3. BMW SÉRIE 3 - Berline premium
INSERT INTO cars (name, brand, model, year, image_url, rating, description, weight_kg, length_cm, width_cm, height_cm, comfort_level, finish_level, category, is_available) VALUES
('BMW Série 3', 'BMW', 'Série 3', 2023, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 4.9,
'Berline premium par excellence, la Série 3 combine performances dynamiques et raffinement haut de gamme. Dotée de technologies de pointe et d''un habitacle luxueux, elle transforme chaque trajet professionnel en expérience premium. Élégance et puissance.',
1665, 472, 182, 143, 5, 5, 'berline', true);

-- 4. TESLA MODEL 3 - Électrique haut de gamme
INSERT INTO cars (name, brand, model, year, image_url, rating, description, weight_kg, length_cm, width_cm, height_cm, comfort_level, finish_level, category, is_available) VALUES
('Tesla Model 3', 'Tesla', 'Model 3', 2024, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', 5.0,
'Véhicule électrique révolutionnaire alliant performances exceptionnelles et zéro émission. Son pilote automatique avancé et son écran tactile central géant redéfinissent l''expérience de conduite. Silence, puissance et innovation technologique.',
1847, 469, 185, 144, 5, 5, 'electrique', true);

-- 5. RENAULT CLIO - Citadine fiable
INSERT INTO cars (name, brand, model, year, image_url, rating, description, weight_kg, length_cm, width_cm, height_cm, comfort_level, finish_level, category, is_available) VALUES
('Renault Clio', 'Renault', 'Clio', 2023, 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800', 4.6,
'Best-seller français reconnu pour sa fiabilité et son habitabilité remarquable. Dotée de technologies modernes et d''un design dynamique, la Clio offre un confort optimal pour 5 passagers. Pratique et économique pour tous vos déplacements.',
1245, 406, 172, 144, 4, 4, 'citadine', true);

-- 6. AUDI A4 - Berline sportive
INSERT INTO cars (name, brand, model, year, image_url, rating, description, weight_kg, length_cm, width_cm, height_cm, comfort_level, finish_level, category, is_available) VALUES
('Audi A4', 'Audi', 'A4', 2023, 'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=800', 4.8,
'Berline sportive au design racé combinant élégance germanique et technologies Quattro. Son habitacle haut de gamme et ses performances dynamiques séduisent les conducteurs exigeants. Luxe discret et efficacité sportive.',
1640, 475, 184, 141, 5, 5, 'berline', true);

-- 7. VOLKSWAGEN GOLF - Compacte iconique
INSERT INTO cars (name, brand, model, year, image_url, rating, description, weight_kg, length_cm, width_cm, height_cm, comfort_level, finish_level, category, is_available) VALUES
('Volkswagen Golf', 'Volkswagen', 'Golf', 2023, 'https://images.unsplash.com/photo-1622353219448-46a9d809950' ||
'1?w=800', 4.7,
'Référence des compactes depuis des décennies, la Golf allie polyvalence et qualité de construction exemplaire. Son équilibre parfait entre confort et dynamisme en fait un choix sûr pour tous types de trajets. Fiabilité légendaire.',
1355, 427, 179, 145, 4, 4, 'compacte', true);

-- 8. MERCEDES CLASSE C - Luxe sportif
INSERT INTO cars (name, brand, model, year, image_url, rating, description, weight_kg, length_cm, width_cm, height_cm, comfort_level, finish_level, category, is_available) VALUES
('Mercedes Classe C', 'Mercedes', 'Classe C', 2024, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 4.9,
'Incarnation du luxe sportif à l''allemande avec un habitacle digne d''une limousine et des performances dignes d''une sportive. Technologie MBUX et finitions irréprochables. Le raffinement à l''état pur.',
1735, 477, 183, 144, 5, 5, 'luxe', true);

-- 9. PEUGEOT 3008 - SUV familial
INSERT INTO cars (name, brand, model, year, image_url, rating, description, weight_kg, length_cm, width_cm, height_cm, comfort_level, finish_level, category, is_available) VALUES
('Peugeot 3008', 'Peugeot', '3008', 2023, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800', 4.7,
'SUV français au design audacieux offrant espace et confort pour toute la famille. Son i-Cockpit panoramique et sa position de conduite surélevée procurent une expérience unique. Polyvalence et élégance.',
1610, 447, 184, 162, 4, 4, 'suv', true);

-- 10. MINI COOPER - Citadine premium
INSERT INTO cars (name, brand, model, year, image_url, rating, description, weight_kg, length_cm, width_cm, height_cm, comfort_level, finish_level, category, is_available) VALUES
('Mini Cooper', 'Mini', 'Cooper', 2023, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800', 4.8,
'Icône britannique alliant style rétro et agrément de conduite incomparable. Compacte mais étonnamment spacieuse, elle offre une expérience de conduite unique grâce à son châssis affûté. Fun et caractère.',
1270, 382, 172, 141, 4, 5, 'citadine', true);

-- 11. PORSCHE MACAN - SUV sportif
INSERT INTO cars (name, brand, model, year, image_url, rating, description, weight_kg, length_cm, width_cm, height_cm, comfort_level, finish_level, category, is_available) VALUES
('Porsche Macan', 'Porsche', 'Macan', 2024, 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800', 5.0,
'SUV sportif par excellence combinant le savoir-faire Porsche et la praticité d''un SUV compact. Performances époustouflantes et finitions haut de gamme. Quand le sport rencontre le luxe.',
2020, 469, 192, 162, 5, 5, 'suv', true);

-- 12. RENAULT ZOE - Électrique urbaine
INSERT INTO cars (name, brand, model, year, image_url, rating, description, weight_kg, length_cm, width_cm, height_cm, comfort_level, finish_level, category, is_available) VALUES
('Renault Zoe', 'Renault', 'Zoe', 2023, 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800', 4.6,
'Citadine 100% électrique accessible et pratique, parfaite pour la ville. Avec une autonomie de 395 km, elle offre une conduite silencieuse et économique sans compromis sur l''habitabilité. L''électrique pour tous.',
1577, 408, 173, 156, 4, 4, 'electrique', true);

-- ====================================
-- FIN DU SCHEMA V2
-- ====================================
