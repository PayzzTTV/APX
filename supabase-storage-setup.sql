-- Configuration Supabase Storage pour APX
-- Exécuter ce script dans Supabase SQL Editor

-- 1. Créer le bucket pour les images de voitures (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'car-images',
  'car-images',
  true,
  5242880, -- 5MB max par image
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Politique: Tout le monde peut voir les images (lecture publique)
CREATE POLICY "Public Access - Read car images"
ON storage.objects FOR SELECT
USING (bucket_id = 'car-images');

-- 3. Politique: Seuls les admins peuvent uploader des images
CREATE POLICY "Admin Only - Upload car images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'car-images'
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- 4. Politique: Seuls les admins peuvent supprimer des images
CREATE POLICY "Admin Only - Delete car images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'car-images'
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- 5. Politique: Seuls les admins peuvent mettre à jour des images
CREATE POLICY "Admin Only - Update car images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'car-images'
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Vérification
SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'car-images';
