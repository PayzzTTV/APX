# 🚀 Roadmap V4 - APX

**Version actuelle :** V3 (Janvier 2026)
**Prochaine version :** V4

---

## 📊 État Actuel du Projet (V3)

### ✅ Fonctionnalités Complètes

#### Core Features
- ✅ Authentification complète (signup, login, logout)
- ✅ Système de réservation avec calendrier
- ✅ Annulation de réservation
- ✅ Modification de réservation (EditBookingModal)
- ✅ Gestion de profil utilisateur
- ✅ 12 véhicules avec descriptions détaillées
- ✅ Navigation mobile iOS style

#### UX/UI Avancé
- ✅ **Toasts modernes** (Sonner) - Remplace tous les alerts
- ✅ **Animations** (Framer Motion) - Page transitions + composants
- ✅ **CarSpecs component** - Caractéristiques techniques visuelles
- ✅ **Niveaux de confort et finition** (barres de progression + étoiles)
- ✅ **SearchBar** - Recherche en temps réel
- ✅ **FilterPanel** - Filtres par catégorie et note minimum

#### Fonctionnalités Avancées
- ✅ **Système de favoris complet** :
  - ✅ Table `favorites` dans Supabase
  - ✅ FavoriteButton avec animations
  - ✅ Page "Mes Favoris" (`app/favorites/page.tsx`)
  - ✅ Server Actions (add/remove/check/list)

#### Interface Admin
- ✅ **Dashboard** avec statistiques (utilisateurs, voitures, réservations)
- ✅ **CRUD voitures** - Create, Read, Update, Delete
- ✅ **Gestion utilisateurs** - Modifier les rôles (admin/customer)
- ✅ **Gestion réservations** - Approuver, refuser, annuler

#### Emails (Code prêt, configuration requise)
- ✅ Templates créés (5 emails) :
  - ✅ Email de bienvenue
  - ✅ Confirmation de réservation
  - ✅ Modification de réservation
  - ✅ Annulation de réservation
  - ✅ Rappel 24h avant
- ✅ Intégration Resend dans Server Actions
- ✅ Documentation complète

---

## 🎯 Objectifs V4 - Ce qui reste à faire

### 🔴 PRIORITÉ HAUTE

#### 1. Configuration Email (30 minutes)
**Statut :** Code prêt, configuration manquante

**Actions requises :**
1. Créer un compte Resend ([resend.com](https://resend.com))
2. Générer une clé API
3. Ajouter à `.env.local` :
   ```env
   RESEND_API_KEY=re_your_api_key_here
   FROM_EMAIL=APX <noreply@yourdomain.com>
   ```
4. Redémarrer le serveur : `npm run dev`
5. Tester les emails (voir `docs/TEST_EMAILS.md`)

**Bénéfices :**
- ✅ Emails de confirmation automatiques
- ✅ Emails de modification/annulation
- ✅ Email de bienvenue pour nouveaux utilisateurs

**Estimation :** 30 minutes

---

#### 2. Galerie d'Images / Carousel (1-2 jours)
**Statut :** Seule fonctionnalité majeure manquante

**Problème actuel :**
- Une seule image statique par voiture sur la page détail
- Pas de galerie ou de carousel

**Solution proposée :**
Créer un composant `CarGallery.tsx` avec :
- 📸 Carousel d'images swipeable (touch-friendly)
- 🖼️ Thumbnails en bas pour navigation rapide
- 🔍 Zoom sur clic (modal fullscreen)
- ⬅️➡️ Boutons précédent/suivant
- 📱 Optimisé mobile (swipe gestures)

**Librairie recommandée :**
- `embla-carousel-react` (léger, performant)
- OU `swiper` (plus de features)
- OU custom avec Framer Motion (déjà installé)

**Modifications requises :**

**1. Schema SQL** - Ajouter support multi-images :
```sql
-- Option 1 : Colonne JSON
ALTER TABLE cars ADD COLUMN images JSONB DEFAULT '[]';

-- Exemple de données :
UPDATE cars SET images = '["url1.jpg", "url2.jpg", "url3.jpg"]' WHERE id = '...';

-- Option 2 : Table séparée (plus flexible)
CREATE TABLE car_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**2. Nouveau composant** `components/CarGallery.tsx` :
```typescript
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

interface CarGalleryProps {
  images: string[]
  carName: string
}

export default function CarGallery({ images, carName }: CarGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const next = () => setCurrentIndex((i) => (i + 1) % images.length)
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length)

  return (
    <div className="relative">
      {/* Image principale avec swipe gestures */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.x > 100) prev()
          else if (offset.x < -100) next()
        }}
      >
        <Image
          src={images[currentIndex]}
          alt={`${carName} - Image ${currentIndex + 1}`}
          width={800}
          height={600}
          className="rounded-lg"
        />
      </motion.div>

      {/* Boutons navigation */}
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2">
            <ChevronLeft />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2">
            <ChevronRight />
          </button>
        </>
      )}

      {/* Thumbnails */}
      <div className="flex gap-2 mt-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={currentIndex === i ? 'ring-2' : ''}
          >
            <Image src={img} width={80} height={60} />
          </button>
        ))}
      </div>
    </div>
  )
}
```

**3. Modifier** `app/cars/[id]/page.tsx` :
```typescript
import CarGallery from '@/components/CarGallery'

// Au lieu de :
<Image src={car.image_url} ... />

// Utiliser :
<CarGallery images={car.images || [car.image_url]} carName={car.name} />
```

**Estimation :** 1-2 jours

---

### 🟠 PRIORITÉ MOYENNE

#### 3. Optimisations Images (1 jour)

**Actions :**
- [ ] Migrer les images vers Supabase Storage ou Cloudinary
- [ ] Lazy loading avec `next/image` (déjà partiellement fait)
- [ ] Formats modernes (WebP, AVIF)
- [ ] Responsive images (différentes tailles)

**Fichiers à modifier :**
- `next.config.js` - Configuration remote patterns
- `components/CarCard.tsx` - Lazy loading
- `components/CarGallery.tsx` - Image optimization

**Estimation :** 1 jour

---

#### 4. Tests iPhone Réel (1-2 heures)

**Actions :**
- [ ] Tester sur iPhone physique (Safari)
- [ ] Vérifier les touch gestures
- [ ] Tester le bottom navigation
- [ ] Vérifier les animations
- [ ] Tester les formulaires (autocomplete, keyboard)

**Bugs potentiels iOS :**
- Animations 60fps
- Safe area pour notch
- Scroll bounce
- Input zoom sur focus

**Estimation :** 1-2 heures

---

#### 5. Notifications Email - Rappels Automatiques (1 jour)

**Statut :** Code prêt, cron job manquant

**Actions :**
1. Créer API route `/app/api/cron/send-reminders/route.ts` :
```typescript
import { sendBookingReminderEmail } from '@/lib/email'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  // Vérifier l'authentification (Vercel Cron secret)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  // Récupérer les réservations qui commencent demain
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const nextDay = new Date(tomorrow)
  nextDay.setDate(nextDay.getDate() + 1)

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      start_date,
      end_date,
      profiles!inner(email, full_name),
      cars!inner(name, image_url)
    `)
    .eq('status', 'confirmed')
    .gte('start_date', tomorrow.toISOString())
    .lt('start_date', nextDay.toISOString())

  // Envoyer un email pour chaque réservation
  for (const booking of bookings || []) {
    await sendBookingReminderEmail(
      booking.profiles.email,
      booking.profiles.full_name,
      booking.cars.name,
      booking.start_date,
      booking.end_date,
      booking.cars.image_url
    )
  }

  return Response.json({
    success: true,
    sent: bookings?.length || 0
  })
}
```

2. Configurer Vercel Cron Job dans `vercel.json` :
```json
{
  "crons": [{
    "path": "/api/cron/send-reminders",
    "schedule": "0 10 * * *"
  }]
}
```

3. Ajouter `CRON_SECRET` dans `.env.local` et Vercel

**Estimation :** 1 jour

---

### 🟢 PRIORITÉ BASSE (Nice to have)

#### 6. Domaine Personnalisé pour Emails (30 minutes)

**Actions :**
- [ ] Ajouter domaine dans Resend Dashboard
- [ ] Configurer DNS (SPF, DKIM, DMARC)
- [ ] Mettre à jour `FROM_EMAIL` dans `.env.local`

**Bénéfices :**
- Meilleur taux de délivrabilité
- Pas de spam folder
- Image de marque professionnelle

**Estimation :** 30 minutes (+ 24h propagation DNS)

---

#### 7. Mise en Cache avec React Query (2-3 jours)

**Objectif :** Améliorer les performances et l'expérience utilisateur

**Actions :**
- [ ] Installer `@tanstack/react-query`
- [ ] Wrapper App avec QueryClientProvider
- [ ] Convertir les fetch en useQuery
- [ ] Ajouter cache pour :
  - Liste des voitures
  - Détails voiture
  - Réservations utilisateur
  - Favoris

**Bénéfices :**
- Chargements instantanés
- Synchronisation automatique
- Optimistic updates
- Background refetching

**Estimation :** 2-3 jours

---

### 🔵 PRODUCTION READY

#### 8. Déploiement Vercel (1-2 heures)

**Actions :**
1. Push le code sur GitHub
2. Connecter le repo à Vercel
3. Configurer les variables d'environnement :
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   RESEND_API_KEY
   FROM_EMAIL
   NEXT_PUBLIC_APP_URL
   CRON_SECRET
   ```
4. Déployer

**Estimation :** 1-2 heures

---

#### 9. Analytics et Monitoring (1 jour)

**Actions :**
- [ ] Activer Vercel Analytics
- [ ] Ajouter Vercel Speed Insights
- [ ] (Optionnel) Google Analytics 4
- [ ] Monitoring des erreurs (Sentry ou Vercel)

**Bénéfices :**
- Tracking utilisateurs
- Performance monitoring
- Error tracking
- Conversion funnel

**Estimation :** 1 jour

---

#### 10. Tests (3-5 jours)

**Actions :**
- [ ] Tests unitaires (Jest + React Testing Library)
  - Composants CarCard, FavoriteButton, SearchBar
  - Utilitaires (filters.ts)
- [ ] Tests E2E (Playwright)
  - Parcours complet de réservation
  - Parcours admin
  - Système de favoris
- [ ] Tests de performance (Lighthouse)
  - Score > 90 sur mobile
  - Core Web Vitals

**Estimation :** 3-5 jours

---

#### 11. Documentation Utilisateur (1-2 jours)

**Actions :**
- [ ] Guide utilisateur (PDF ou page web)
- [ ] FAQ
- [ ] Politique de confidentialité
- [ ] Conditions Générales d'Utilisation (CGU)
- [ ] Vidéo démo (optionnel)

**Estimation :** 1-2 jours

---

## 📅 Planning Suggéré

### Semaine 1 - Essentiels
- [ ] Jour 1 : Configuration Email Resend (30 min) + Tests iPhone (2h)
- [ ] Jour 2-3 : Carousel d'images (2 jours)
- [ ] Jour 4 : Optimisations images (1 jour)
- [ ] Jour 5 : Rappels email automatiques (1 jour)

### Semaine 2 - Production
- [ ] Jour 1-2 : Tests (2 jours)
- [ ] Jour 3 : Déploiement Vercel + Analytics (1 jour)
- [ ] Jour 4-5 : Documentation utilisateur (2 jours)

### Semaine 3 (Optionnel) - Performance
- [ ] Jour 1-3 : React Query (3 jours)
- [ ] Jour 4 : Domaine personnalisé emails (1 jour)
- [ ] Jour 5 : Tests de charge et optimisations finales

---

## ✅ Checklist Finale de Production

Avant de lancer en production :

### Technique
- [x] Next.js 14 configuré
- [x] TypeScript sans erreurs
- [x] Supabase configuré (Auth + DB + RLS)
- [ ] 🔴 Emails configurés (Resend)
- [ ] 🟠 Carousel d'images implémenté
- [ ] 🟠 Tests iPhone réel
- [ ] 🟢 Images optimisées
- [ ] 🟢 React Query (optionnel)

### Déploiement
- [ ] 🔴 Déployé sur Vercel
- [ ] 🔴 Variables d'environnement configurées
- [ ] 🔴 Domaine personnalisé configuré
- [ ] 🟠 Analytics activé
- [ ] 🟠 Monitoring des erreurs actif

### Légal & Documentation
- [ ] 🟢 Politique de confidentialité
- [ ] 🟢 CGU rédigées
- [ ] 🟢 Documentation utilisateur
- [ ] 🟢 FAQ

### Performance
- [ ] 🟠 Lighthouse score > 90
- [ ] 🟠 Core Web Vitals optimisés
- [ ] 🟢 Tests E2E passants
- [ ] 🟢 Tests unitaires passants

---

## 🎯 Objectifs V4 - Résumé

### Must Have (Bloquants pour V4)
1. ✅ Configuration Email (30 min)
2. ✅ Carousel d'images (2 jours)
3. ✅ Tests iPhone (2h)

### Should Have (Recommandés)
4. ⚡ Optimisations images (1 jour)
5. ⚡ Rappels email automatiques (1 jour)
6. ⚡ Déploiement Vercel (2h)

### Nice to Have (Optionnels)
7. 💫 React Query (3 jours)
8. 💫 Tests automatisés (5 jours)
9. 💫 Analytics avancé (1 jour)
10. 💫 Documentation complète (2 jours)

---

## 📊 Métriques de Succès V4

### Performance
- ✅ Lighthouse Performance > 90
- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3s
- ✅ Cumulative Layout Shift < 0.1

### Fonctionnalités
- ✅ 100% emails envoyés avec succès
- ✅ Carousel d'images fluide (60fps)
- ✅ 0 bugs critiques iPhone
- ✅ Taux d'erreur < 0.1%

### Business
- ✅ Application déployée en production
- ✅ 0 downtime
- ✅ Documentation complète
- ✅ Monitoring actif

---

## 🚀 Après V4 - Futures Idées

### V5 Potentielle (Long terme)
- [ ] Application mobile native (React Native / Flutter)
- [ ] PWA avec mode offline
- [ ] Chat en temps réel (support client)
- [ ] Système de notation et avis
- [ ] Programme de fidélité
- [ ] Multi-langue (i18n)
- [ ] Géolocalisation des agences
- [ ] Intégration calendrier (Google Calendar, iCal)
- [ ] Notifications push
- [ ] Mode sombre/clair toggle

---

## 📝 Notes

### Ce qui est fait en V3
- ✅ Toutes les fonctionnalités utilisateur majeures
- ✅ Interface admin complète
- ✅ UX/UI moderne avec animations
- ✅ Système de favoris
- ✅ Recherche et filtres avancés
- ✅ Code email prêt

### Ce qui manque pour V4
- ❌ Configuration email (bloquant - 30 min)
- ❌ Carousel d'images (bloquant - 2 jours)
- ❌ Tests iPhone réel (recommandé - 2h)
- 🟠 Déploiement production (recommandé - 2h)
- 🟢 Optimisations diverses (nice to have)

### Timeline Réaliste
- **V4 MVP (Must Have)** : 3-4 jours
- **V4 Complet (Should Have)** : 1-2 semaines
- **V4 Production Ready (Nice to Have)** : 3-4 semaines

---

**Date de création :** Janvier 2026
**Dernière mise à jour :** Janvier 2026
**Status :** V3 stable, V4 en planification
