# Structure Complète du Projet APX

## Vue d'Ensemble

Voici la structure complète de ton projet APX avec l'explication de chaque fichier.

```
APX/
├── app/                          # Dossier principal de Next.js (App Router)
│   ├── cars/
│   │   └── [id]/
│   │       └── page.tsx         # 📄 Page détail d'une voiture avec calendrier
│   ├── bookings/
│   │   └── page.tsx             # 📄 Page "Mes Réservations"
│   ├── login/
│   │   └── page.tsx             # 📄 Page de connexion (placeholder)
│   ├── profile/
│   │   └── page.tsx             # 📄 Page profil utilisateur
│   ├── layout.tsx               # 🎨 Layout global (Navbar + structure)
│   ├── page.tsx                 # 🏠 Page d'accueil (liste des voitures)
│   └── globals.css              # 🎨 Styles globaux + styles du calendrier
│
├── components/                   # Composants React réutilisables
│   ├── BookingCalendar.tsx      # 📅 Calendrier avec logique de réservation
│   ├── CarCard.tsx              # 🚗 Carte d'affichage d'une voiture
│   └── Navbar.tsx               # 🧭 Barre de navigation
│
├── lib/                          # Librairies et utilitaires
│   ├── supabase/
│   │   ├── client.ts            # 🔌 Client Supabase (côté client)
│   │   └── server.ts            # 🔌 Client Supabase (côté serveur)
│   └── types/
│       └── database.types.ts    # 📝 Types TypeScript pour la DB
│
├── public/                       # Assets publics (images, favicon, etc.)
│   └── .gitkeep
│
├── node_modules/                 # Dépendances installées (ne pas modifier)
│
├── .env.local.example           # 🔐 Template des variables d'environnement
├── .env.local                   # 🔐 TES variables d'environnement (à créer)
├── .gitignore                   # 📝 Fichiers à ignorer par Git
├── GUIDE_INSTALLATION.md        # 📖 Guide complet d'installation
├── README.md                    # 📖 Documentation principale
├── STRUCTURE_COMPLETE.md        # 📖 Ce fichier
├── next.config.js               # ⚙️ Configuration Next.js
├── next-env.d.ts                # 📝 Types Next.js (généré automatiquement)
├── package.json                 # 📦 Dépendances et scripts npm
├── package-lock.json            # 📦 Versions exactes des dépendances
├── postcss.config.js            # ⚙️ Configuration PostCSS (pour Tailwind)
├── supabase-schema.sql          # 🗄️ Schéma SQL à exécuter dans Supabase
├── tailwind.config.ts           # 🎨 Configuration Tailwind CSS
└── tsconfig.json                # ⚙️ Configuration TypeScript
```

---

## Détail des Fichiers Clés

### 📄 `app/page.tsx` - Page d'Accueil

**Ce que fait ce fichier :**
- Récupère toutes les voitures depuis Supabase
- Affiche un titre "Hero" avec un dégradé bleu
- Affiche une grille de cartes de voitures (composant `CarCard`)

**Concepts utilisés :**
- Server Component (récupération côté serveur)
- Fetch de données avec Supabase
- Mapping de tableau pour afficher les voitures

---

### 📄 `app/cars/[id]/page.tsx` - Page Détail Voiture

**Ce que fait ce fichier :**
- Route dynamique : `[id]` est remplacé par l'ID de la voiture dans l'URL
- Récupère les détails de la voiture depuis Supabase
- Récupère les réservations existantes pour cette voiture
- Affiche l'image, la description, la note, le prix
- Affiche le composant `BookingCalendar` avec les dates bloquées

**Concepts utilisés :**
- Routes dynamiques Next.js (`[id]`)
- `notFound()` pour gérer les voitures inexistantes
- Passage de props au composant calendrier
- Async/await pour les requêtes DB

---

### 📅 `components/BookingCalendar.tsx` - Calendrier de Réservation

**Ce que fait ce fichier :**
- Composant Client (`'use client'`)
- Affiche un calendrier interactif avec `react-day-picker`
- Calcule les dates désactivées (déjà réservées)
- Permet de sélectionner une période (date début/fin)
- Calcule automatiquement le prix total
- Valide que les dates sélectionnées ne chevauchent pas une réservation
- Envoie la réservation à Supabase
- Redirige vers `/bookings` après succès

**Concepts utilisés :**
- Client Component (interactivité)
- Hooks React : `useState`, `useEffect`
- Manipulation de dates avec `date-fns`
- Requêtes client-side avec Supabase
- Vérification d'authentification
- Navigation avec `useRouter`

**Logique importante :**
```typescript
// Désactiver les dates passées ET les dates réservées
disabled={[
  { before: new Date() },  // Dates passées
  ...disabledDates,        // Dates déjà réservées
]}
```

---

### 🚗 `components/CarCard.tsx` - Carte Voiture

**Ce que fait ce fichier :**
- Affiche une carte avec : photo, nom, marque, note (étoiles), prix
- Effet hover avec un ring bleu
- Lien cliquable vers la page détail

**Concepts utilisés :**
- Composant réutilisable avec props typées
- `next/image` pour l'optimisation des images
- `next/link` pour la navigation
- Mapping de tableau pour afficher les étoiles

---

### 🧭 `components/Navbar.tsx` - Navigation

**Ce que fait ce fichier :**
- Barre de navigation sticky (reste en haut au scroll)
- Logo APX cliquable
- Liens : Accueil, Mes Réservations, Profil
- Bouton "Connexion" à droite

**Style :**
- Background `#1a1a1a` avec bordure grise
- Effet hover sur les liens
- Bouton bleu pour la connexion

---

### 🔌 `lib/supabase/client.ts` - Client Supabase (Côté Client)

**Quand l'utiliser :**
- Dans les composants Client (`'use client'`)
- Pour les requêtes initiées par l'utilisateur (clic sur un bouton)
- Exemple : BookingCalendar.tsx

**Code :**
```typescript
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

---

### 🔌 `lib/supabase/server.ts` - Client Supabase (Côté Serveur)

**Quand l'utiliser :**
- Dans les Server Components
- Pour les requêtes au chargement de la page
- Exemple : page.tsx, cars/[id]/page.tsx

**Code :**
```typescript
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

---

### 📝 `lib/types/database.types.ts` - Types TypeScript

**Ce que fait ce fichier :**
- Définit les types TypeScript pour toutes les tables
- Assure la sécurité des types (autocomplétion, erreurs de typage)
- Export des types `Car`, `Booking`, `Profile`

**Exemple d'utilisation :**
```typescript
import { Car } from '@/lib/types/database.types'

const car: Car = {
  id: '...',
  name: 'Fiat 500',
  // ...
}
```

---

## Flux de Données

### 1. Page d'Accueil (`/`)

```
Serveur Next.js
    ↓
Requête Supabase : SELECT * FROM cars
    ↓
Rendu côté serveur avec les données
    ↓
HTML envoyé au navigateur
```

### 2. Page Détail Voiture (`/cars/123`)

```
Serveur Next.js
    ↓
Requête 1 : SELECT * FROM cars WHERE id = '123'
Requête 2 : SELECT * FROM bookings WHERE car_id = '123'
    ↓
Rendu côté serveur avec les données
    ↓
HTML envoyé au navigateur (avec le calendrier)
    ↓
Utilisateur sélectionne des dates
    ↓
Clic sur "Confirmer la réservation"
    ↓
Requête client-side : INSERT INTO bookings
    ↓
Redirection vers /bookings
```

---

## Scripts npm

Dans `package.json`, tu as ces scripts :

```json
"dev": "next dev"          // Lance le serveur de développement
"build": "next build"      // Build de production
"start": "next start"      // Lance le build de production
"lint": "next lint"        // Vérifie le code
```

**Commandes :**
```bash
npm run dev      # Développement (port 3000)
npm run build    # Build de production
npm run start    # Démarre le build
npm run lint     # Lint le code
```

---

## Variables d'Environnement

**Fichier `.env.local` (à créer) :**
```env
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta-clé-anon-key
```

**Pourquoi `NEXT_PUBLIC_` ?**
- Les variables avec ce préfixe sont accessibles côté client
- Sans ce préfixe, elles sont seulement accessibles côté serveur

---

## Schéma SQL

**Fichier `supabase-schema.sql` :**

Ce fichier contient :
1. Création de la table `profiles` (liée à `auth.users`)
2. Trigger pour créer automatiquement un profil à l'inscription
3. Création de la table `cars`
4. Création de la table `bookings` avec contraintes
5. Row Level Security (RLS) policies
6. Données de test (4 voitures)

**Important :** Ce fichier doit être exécuté dans le **SQL Editor** de Supabase.

---

## Configuration Tailwind

**Fichier `tailwind.config.ts` :**
- Thème personnalisé avec couleurs :
  - `background: #111111` (noir)
  - `foreground: #ffffff` (blanc)
  - `primary: #3B82F6` (bleu)

**Classes personnalisées :**
- Toutes les classes Tailwind sont disponibles
- Exemple : `bg-background`, `text-primary`, `rounded-xl`, etc.

---

## Prochaines Améliorations

1. **Authentification complète**
   - Formulaire de connexion fonctionnel
   - Formulaire d'inscription
   - Gestion de session

2. **Middleware Supabase**
   - Rafraîchir automatiquement les sessions
   - Protéger les routes privées

3. **Gestion des réservations**
   - Annuler une réservation
   - Modifier les dates
   - Statut "confirmé" vs "en attente"

4. **Interface Admin**
   - Gérer les voitures (CRUD)
   - Voir toutes les réservations
   - Statistiques

5. **Paiement**
   - Intégration Stripe
   - Paiement à la réservation

6. **Recherche & Filtres**
   - Filtrer par prix, marque, note
   - Recherche par nom

---

## Ressources Utiles

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [react-day-picker](https://react-day-picker.js.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Bon développement ! 🚀
