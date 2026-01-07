  -- ====================================
  -- SCHEMA SQL POUR APX (Location de voitures)
  -- À exécuter dans Supabase SQL Editor
  -- ====================================

  -- 1. Table PROFILES (liée à auth.users)
  CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Trigger pour créer automatiquement un profil quand un user s'inscrit
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

  -- 2. Table CARS (voitures disponibles)
  CREATE TABLE cars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    image_url TEXT,
    price_per_day DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 3. Table BOOKINGS (réservations)
  CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    car_id UUID REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    total_price DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Contrainte : end_date doit être après start_date
    CONSTRAINT valid_date_range CHECK (end_date > start_date)
  );

  -- Index pour améliorer les performances
  CREATE INDEX idx_bookings_car_id ON bookings(car_id);
  CREATE INDEX idx_bookings_user_id ON bookings(user_id);
  CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);

  -- ====================================
  -- ROW LEVEL SECURITY (RLS)
  -- ====================================

  -- Activer RLS sur toutes les tables
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
  ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

  -- Policies pour PROFILES
  CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

  CREATE POLICY "Les utilisateurs peuvent mettre à jour leur profil"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

  -- Policies pour CARS (tout le monde peut voir les voitures)
  CREATE POLICY "Tout le monde peut voir les voitures"
    ON cars FOR SELECT
    TO authenticated, anon
    USING (true);

  -- Policies pour BOOKINGS
  CREATE POLICY "Les utilisateurs peuvent voir leurs propres réservations"
    ON bookings FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Les utilisateurs peuvent créer une réservation"
    ON bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs réservations"
    ON bookings FOR UPDATE
    USING (auth.uid() = user_id);

  -- ====================================
  -- DONNÉES DE TEST (Optionnel)
  -- ====================================

  -- Quelques voitures pour tester
  INSERT INTO cars (name, brand, model, image_url, price_per_day, rating, description) VALUES
    ('Fiat 500', 'Fiat', '500', 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800', 45.00, 4.5, 'Citadine idéale pour la ville, économique et maniable'),
    ('Peugeot 208', 'Peugeot', '208', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800', 55.00, 4.7, 'Compacte moderne avec équipements connectés'),
    ('BMW Série 3', 'BMW', 'Série 3', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 120.00, 4.9, 'Berline premium pour vos déplacements professionnels'),
    ('Tesla Model 3', 'Tesla', 'Model 3', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', 150.00, 5.0, 'Véhicule électrique haut de gamme, silencieux et performant');
