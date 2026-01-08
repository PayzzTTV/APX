-- Migration pour ajouter le support de galeries d'images multiples
-- Exécuter ce script dans Supabase SQL Editor

-- Étape 1 : Ajouter la colonne images (array de URLs)
ALTER TABLE cars ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Étape 2 : Migrer les images existantes vers le nouveau format
-- Pour chaque voiture, copier image_url dans images[0] si images est vide
UPDATE cars
SET images = ARRAY[image_url]::TEXT[]
WHERE image_url IS NOT NULL AND (images IS NULL OR array_length(images, 1) IS NULL);

-- Étape 3 : Ajouter des images supplémentaires pour quelques voitures (exemples)
-- Fiat 500
UPDATE cars SET images = ARRAY[
  'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
] WHERE name = 'Fiat 500';

-- Peugeot 208
UPDATE cars SET images = ARRAY[
  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800',
  'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
  'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800'
] WHERE name = 'Peugeot 208';

-- BMW Série 3
UPDATE cars SET images = ARRAY[
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
  'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
  'https://images.unsplash.com/photo-1580414053347-c2e2f8b447f5?w=800'
] WHERE name = 'BMW Série 3';

-- Tesla Model 3
UPDATE cars SET images = ARRAY[
  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
  'https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=800'
] WHERE name = 'Tesla Model 3';

-- Renault Clio
UPDATE cars SET images = ARRAY[
  'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'
] WHERE name = 'Renault Clio';

-- Audi A4
UPDATE cars SET images = ARRAY[
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800',
  'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800'
] WHERE name = 'Audi A4';

-- Volkswagen Golf
UPDATE cars SET images = ARRAY[
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
  'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'
] WHERE name = 'Volkswagen Golf';

-- Mercedes Classe C
UPDATE cars SET images = ARRAY[
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
  'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
  'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800'
] WHERE name = 'Mercedes Classe C';

-- Peugeot 3008
UPDATE cars SET images = ARRAY[
  'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800',
  'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
] WHERE name = 'Peugeot 3008';

-- Mini Cooper
UPDATE cars SET images = ARRAY[
  'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800',
  'https://images.unsplash.com/photo-1621361365424-06f0e1eb5c49?w=800',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
] WHERE name = 'Mini Cooper';

-- Porsche Macan
UPDATE cars SET images = ARRAY[
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
  'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800',
  'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800'
] WHERE name = 'Porsche Macan';

-- Renault Zoe
UPDATE cars SET images = ARRAY[
  'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'
] WHERE name = 'Renault Zoe';

-- Étape 4 : Vérification
-- Afficher toutes les voitures avec leurs images
SELECT id, name, array_length(images, 1) as nb_images, images[1] as first_image
FROM cars
ORDER BY name;

-- Notes importantes :
-- 1. La colonne 'image_url' est conservée pour compatibilité ascendante
-- 2. La colonne 'images' est maintenant le tableau principal d'images
-- 3. Si 'images' est vide, le code peut fallback sur 'image_url'
-- 4. Les images sont des URLs Unsplash gratuites
