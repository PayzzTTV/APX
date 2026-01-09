-- Script pour insérer les 12 voitures dans la base de données APX
-- À exécuter dans Supabase SQL Editor

-- 1. Vider la table cars (optionnel - à décommenter si nécessaire)
-- TRUNCATE cars CASCADE;

-- 2. Insérer les 12 voitures avec leurs images
INSERT INTO cars (name, brand, model, image_url, price_per_day, rating, category, description, images) VALUES
  (
    'Fiat 500',
    'Fiat',
    '500',
    'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800',
    45.00,
    4.5,
    'citadine',
    'Citadine idéale pour la ville, économique et maniable. Parfaite pour vos trajets quotidiens.',
    ARRAY[
      'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
    ]
  ),
  (
    'Peugeot 208',
    'Peugeot',
    '208',
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800',
    55.00,
    4.7,
    'citadine',
    'Compacte moderne avec équipements connectés et design élégant.',
    ARRAY[
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800'
    ]
  ),
  (
    'Renault Clio',
    'Renault',
    'Clio',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    50.00,
    4.6,
    'citadine',
    'Polyvalente et confortable, idéale pour tous vos déplacements urbains.',
    ARRAY[
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800'
    ]
  ),
  (
    'BMW Série 3',
    'BMW',
    'Série 3',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    120.00,
    4.9,
    'berline',
    'Berline premium pour vos déplacements professionnels. Confort et prestige garantis.',
    ARRAY[
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
      'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800'
    ]
  ),
  (
    'Audi A4',
    'Audi',
    'A4',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    110.00,
    4.8,
    'berline',
    'Élégance et performance réunies dans cette berline allemande de référence.',
    ARRAY[
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800',
      'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800'
    ]
  ),
  (
    'Mercedes Classe C',
    'Mercedes-Benz',
    'Classe C',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    130.00,
    4.9,
    'berline',
    'Le summum du luxe et du confort. Technologie de pointe et finitions exceptionnelles.',
    ARRAY[
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      'https://images.unsplash.com/photo-1617886322207-5059c1109d7d?w=800',
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800'
    ]
  ),
  (
    'Tesla Model 3',
    'Tesla',
    'Model 3',
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    150.00,
    5.0,
    'electrique',
    'Véhicule électrique haut de gamme, silencieux et performant. Autonomie exceptionnelle.',
    ARRAY[
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800'
    ]
  ),
  (
    'Renault Zoe',
    'Renault',
    'Zoe',
    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
    60.00,
    4.4,
    'electrique',
    'Citadine électrique pratique et économique. Parfaite pour la ville.',
    ARRAY[
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
      'https://images.unsplash.com/photo-1583267746897-f915af1a4a8e?w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
    ]
  ),
  (
    'Peugeot 3008',
    'Peugeot',
    '3008',
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    85.00,
    4.7,
    'suv',
    'SUV familial spacieux avec vue panoramique. Idéal pour les longs trajets.',
    ARRAY[
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
      'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=800'
    ]
  ),
  (
    'Volkswagen Tiguan',
    'Volkswagen',
    'Tiguan',
    'https://images.unsplash.com/photo-1621006652562-7b1c5ac0e14e?w=800',
    90.00,
    4.6,
    'suv',
    'SUV polyvalent et robuste. Confort optimal pour toute la famille.',
    ARRAY[
      'https://images.unsplash.com/photo-1621006652562-7b1c5ac0e14e?w=800',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
      'https://images.unsplash.com/photo-1597404294360-feeeda04612d?w=800'
    ]
  ),
  (
    'Range Rover Evoque',
    'Land Rover',
    'Range Rover Evoque',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    140.00,
    4.8,
    'suv',
    'SUV premium compact au design distinctif. Luxe et performance tout-terrain.',
    ARRAY[
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=800',
      'https://images.unsplash.com/photo-1583267746897-f915af1a4a8e?w=800'
    ]
  ),
  (
    'Porsche 911',
    'Porsche',
    '911',
    'https://images.unsplash.com/photo-1611821064430-f89d3a3e0535?w=800',
    250.00,
    5.0,
    'sportive',
    'Icône sportive légendaire. Performances exceptionnelles et design intemporel.',
    ARRAY[
      'https://images.unsplash.com/photo-1611821064430-f89d3a3e0535?w=800',
      'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800'
    ]
  )
ON CONFLICT (id) DO NOTHING;

-- 3. Vérifier l'insertion
SELECT COUNT(*) as total_cars FROM cars;
SELECT name, brand, price_per_day, rating, category FROM cars ORDER BY price_per_day;
