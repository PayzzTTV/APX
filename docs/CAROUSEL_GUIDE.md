# 🎠 Guide d'Installation du Carousel d'Images

## ✅ Ce qui a été ajouté

### 1. Nouveau Composant `CarGallery.tsx`
Un carousel d'images complet avec :
- ✅ Swipe gestures (tactile et souris)
- ✅ Boutons de navigation (précédent/suivant)
- ✅ Thumbnails cliquables
- ✅ Indicateurs de position
- ✅ Compteur d'images
- ✅ Mode plein écran (fullscreen)
- ✅ Animations fluides avec Framer Motion
- ✅ Responsive (mobile et desktop)
- ✅ Touches clavier (← →) pour naviguer

### 2. Mise à Jour du Schéma TypeScript
- Ajout du champ `images: string[] | null` dans `database.types.ts`
- Compatible avec l'ancien champ `image_url` (fallback automatique)

### 3. Migration SQL
- Script SQL pour ajouter la colonne `images` à la table `cars`
- Migration automatique des images existantes
- Ajout de 3 images par voiture (exemples Unsplash)

---

## 🚀 Installation (2 étapes)

### Étape 1 : Exécuter la Migration SQL (2 minutes)

1. **Ouvrir Supabase Dashboard**
   - Aller sur [supabase.com](https://supabase.com)
   - Sélectionner votre projet APX

2. **Ouvrir SQL Editor**
   - Cliquer sur **SQL Editor** dans le menu de gauche
   - Cliquer sur **New query**

3. **Copier et exécuter le script**
   - Ouvrir le fichier `supabase-images-migration.sql`
   - Copier TOUT le contenu
   - Coller dans l'éditeur SQL
   - Cliquer sur **Run** (bouton en bas à droite)

4. **Vérifier le résultat**
   - Vous devriez voir : `Success. No rows returned`
   - Vérifier dans **Table Editor → cars** que la colonne `images` existe
   - Chaque voiture devrait avoir 3 images dans le champ `images`

---

### Étape 2 : Redémarrer le Serveur (30 secondes)

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

---

## 🎉 C'est fait !

Le carousel est maintenant actif ! Rendez-vous sur une page détail de voiture :
- [http://localhost:3000/cars/[id]](http://localhost:3000)

### Fonctionnalités à tester :

#### Sur Desktop
- ✅ **Swipe avec la souris** : Cliquer et glisser l'image principale
- ✅ **Boutons navigation** : Apparaissent au survol (← →)
- ✅ **Thumbnails** : Cliquer sur les miniatures en bas
- ✅ **Indicateurs** : Points en bas de l'image
- ✅ **Plein écran** : Icône en haut à droite (Maximize)
- ✅ **Compteur** : "1 / 3" en haut à gauche

#### Sur Mobile
- ✅ **Swipe tactile** : Glisser l'image vers la gauche/droite
- ✅ **Thumbnails scrollables** : Défiler horizontalement
- ✅ **Responsive** : S'adapte à tous les écrans

#### En Mode Plein Écran
- ✅ **Navigation** : Boutons larges sur les côtés
- ✅ **Fermeture** : Cliquer sur X ou cliquer à l'extérieur
- ✅ **Swipe** : Glisser pour changer d'image
- ✅ **Échap** : Fermer avec la touche Échap (ESC)

---

## 🔧 Configuration Avancée (Optionnel)

### Ajouter des images personnalisées

#### Option 1 : Via SQL
```sql
UPDATE cars
SET images = ARRAY[
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg'
]
WHERE id = 'votre-id-voiture';
```

#### Option 2 : Via l'interface Admin
Modifier le composant `components/admin/CarForm.tsx` pour permettre l'ajout de plusieurs URLs d'images.

---

### Utiliser Supabase Storage (Recommandé pour production)

Au lieu d'URLs Unsplash, héberger les images sur Supabase Storage :

1. **Créer un bucket**
   ```sql
   -- Dans Supabase SQL Editor
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('car-images', 'car-images', true);
   ```

2. **Upload des images**
   - Aller sur **Storage** dans Supabase
   - Sélectionner le bucket `car-images`
   - Upload les images

3. **Récupérer les URLs**
   ```typescript
   const { data } = supabase.storage
     .from('car-images')
     .getPublicUrl('fiat-500-front.jpg')

   // URL : https://[project].supabase.co/storage/v1/object/public/car-images/fiat-500-front.jpg
   ```

4. **Mettre à jour la DB**
   ```sql
   UPDATE cars
   SET images = ARRAY[
     'https://[project].supabase.co/storage/v1/object/public/car-images/fiat-500-front.jpg',
     'https://[project].supabase.co/storage/v1/object/public/car-images/fiat-500-side.jpg',
     'https://[project].supabase.co/storage/v1/object/public/car-images/fiat-500-rear.jpg'
   ]
   WHERE name = 'Fiat 500';
   ```

---

### Personnaliser le Carousel

Modifier `components/CarGallery.tsx` :

#### Changer le ratio d'aspect
```typescript
// Ligne 18 : aspect-[16/10] → aspect-[4/3] ou aspect-square
<div className="relative w-full aspect-[4/3] bg-[#252525] rounded-lg overflow-hidden group">
```

#### Désactiver le mode plein écran
```typescript
// Ligne 110-117 : Supprimer le bouton Maximize2
```

#### Changer la vitesse d'animation
```typescript
// Ligne 73-77 : transition configuration
transition={{
  x: { type: "spring", stiffness: 500, damping: 40 }, // Plus rapide
  opacity: { duration: 0.1 }
}}
```

#### Désactiver les thumbnails
```typescript
// Ligne 168-189 : Supprimer la section thumbnails
```

---

## 🐛 Dépannage

### Problème : Les images ne s'affichent pas

**Solution 1 : Vérifier la migration SQL**
```sql
-- Vérifier que la colonne existe
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'cars' AND column_name = 'images';

-- Vérifier les données
SELECT id, name, images FROM cars LIMIT 5;
```

**Solution 2 : Vérifier Next.js Image domains**
Ajouter les domaines dans `next.config.js` :
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: '*.supabase.co',
    }
  ]
}
```

### Problème : Le swipe ne fonctionne pas

**Cause** : Conflit avec d'autres event listeners

**Solution** : Vérifier qu'aucun autre composant ne capture les événements drag

### Problème : Les thumbnails ne défilent pas sur mobile

**Cause** : Scrollbar cachée

**Solution** : Déjà implémentée avec la classe `scrollbar-hide`

---

## 📊 Performance

### Optimisations implémentées
- ✅ `priority` sur la première image (chargement rapide)
- ✅ `sizes` attribute pour responsive images
- ✅ Lazy loading des thumbnails
- ✅ AnimatePresence pour des transitions fluides
- ✅ `object-cover` pour éviter les déformations

### Métriques attendues
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Animation Frame Rate** : 60 FPS

---

## 🎨 Styles Personnalisables

### Couleurs
```typescript
// Fond du carousel : bg-[#252525]
// Boutons : bg-black/50 hover:bg-black/70
// Ring active : ring-blue-500
// Indicateurs : bg-white et bg-white/50
```

### Tailles
```typescript
// Thumbnails : w-20 h-16
// Boutons navigation : p-2 (desktop) et p-4 (fullscreen)
// Icônes : w-5 h-5 (desktop) et w-8 h-8 (fullscreen)
```

---

## ✅ Checklist de Validation

Avant de considérer le carousel comme terminé :

- [x] Composant `CarGallery.tsx` créé
- [x] Migration SQL `supabase-images-migration.sql` créée
- [x] Types TypeScript mis à jour (`database.types.ts`)
- [x] Page détail mise à jour (`app/cars/[id]/page.tsx`)
- [ ] Migration SQL exécutée dans Supabase
- [ ] Serveur redémarré
- [ ] Test sur desktop (swipe, boutons, fullscreen)
- [ ] Test sur mobile (touch, responsive)
- [ ] Vérification des performances (Lighthouse)

---

## 🚀 Prochaines Améliorations (Optionnel)

### Court terme
- [ ] Upload d'images via interface admin
- [ ] Zoom sur les images (pinch to zoom)
- [ ] Support vidéos (intégrer YouTube/Vimeo)

### Moyen terme
- [ ] Lazy loading progressif (blur placeholder)
- [ ] Compression automatique des images
- [ ] Support des formats AVIF/WebP
- [ ] Galerie 360° (vue panoramique)

### Long terme
- [ ] Intelligence artificielle (auto-tagging)
- [ ] Comparaison côte à côte de voitures
- [ ] Réalité augmentée (visualiser la voiture chez soi)

---

## 📚 Ressources

- **Framer Motion** : [framer.com/motion](https://www.framer.com/motion/)
- **Next.js Image** : [nextjs.org/docs/api-reference/next/image](https://nextjs.org/docs/api-reference/next/image)
- **Unsplash** : [unsplash.com](https://unsplash.com) (images gratuites)
- **Supabase Storage** : [supabase.com/docs/guides/storage](https://supabase.com/docs/guides/storage)

---

**Le carousel est prêt à l'emploi ! Il ne reste qu'à exécuter la migration SQL.** 🎉

**Temps total d'installation :** 2-3 minutes
