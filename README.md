# APX - Application de Location de Voitures

MVP d'une application de location de voitures construite avec **Next.js 14 (App Router)** et **Supabase**.

## Stack Technique

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS (Dark Mode)
- **Backend:** Supabase (PostgreSQL + Auth)
- **Calendrier:** react-day-picker
- **Dates:** date-fns

---

## Installation & Configuration

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer Supabase

#### a) Créer un projet Supabase

1. Va sur [supabase.com](https://supabase.com) et crée un nouveau projet
2. Attends que la base de données soit provisionnée

#### b) Exécuter le schéma SQL

1. Dans le dashboard Supabase, va dans **SQL Editor**
2. Ouvre le fichier `supabase-schema.sql` à la racine du projet
3. Copie tout le contenu et colle-le dans l'éditeur SQL
4. Clique sur **Run** pour créer les tables et les données de test

#### c) Récupérer les clés API

1. Va dans **Project Settings** > **API**
2. Copie les valeurs suivantes :
   - **Project URL** (ressemble à `https://xxxxx.supabase.co`)
   - **anon public key**

### 3. Configurer les variables d'environnement

1. Crée un fichier `.env.local` à la racine du projet :

```bash
cp .env.local.example .env.local
```

2. Édite `.env.local` et remplace par tes vraies valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta-clé-publique-anon-key-ici
```

### 4. Lancer l'application

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

---

## Structure du Projet

```
APX/
├── app/
│   ├── cars/
│   │   └── [id]/
│   │       └── page.tsx        # Page détail voiture + calendrier
│   ├── globals.css             # Styles globaux + calendrier
│   ├── layout.tsx              # Layout principal avec Navbar
│   └── page.tsx                # Page d'accueil (liste des voitures)
├── components/
│   ├── BookingCalendar.tsx     # Calendrier de réservation
│   ├── CarCard.tsx             # Carte d'affichage d'une voiture
│   └── Navbar.tsx              # Barre de navigation
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Client Supabase (côté client)
│   │   └── server.ts           # Client Supabase (côté serveur)
│   └── types/
│       └── database.types.ts   # Types TypeScript pour la DB
├── supabase-schema.sql         # Schéma SQL à exécuter dans Supabase
├── .env.local.example          # Template pour les variables d'environnement
├── next.config.js              # Configuration Next.js
├── tailwind.config.ts          # Configuration Tailwind (Dark Mode)
└── package.json
```

---

## Fonctionnalités Implémentées

### 1. Page d'Accueil (`/`)
- Affiche la liste de toutes les voitures disponibles
- Carte avec : Photo, Nom, Note, Prix/jour
- Clic sur une carte → Redirection vers la page détail

### 2. Page Détail Voiture (`/cars/[id]`)
- Grande photo de la voiture
- Informations détaillées (nom, marque, modèle, description, note)
- **Calendrier interactif** avec :
  - Sélection d'une période (date début/fin)
  - Dates déjà réservées **grisées/bloquées**
  - Calcul automatique du prix total
  - Bouton "Confirmer la réservation"

### 3. Réservation
- Insertion d'une ligne dans la table `bookings`
- Vérification que l'utilisateur est connecté
- Blocage des dates qui chevauchent des réservations existantes

---

## Base de Données (Supabase)

### Tables

1. **profiles**
   - `id` (uuid, lié à `auth.users`)
   - `email`, `full_name`, `phone`
   - `role` ('customer', 'admin')
   - `avatar_url`

2. **cars**
   - `id`, `name`, `brand`, `model`
   - `image_url`, `price_per_day`, `rating`
   - `description`

3. **bookings**
   - `id`, `user_id`, `car_id`
   - `start_date`, `end_date`
   - `status` ('pending', 'confirmed', 'cancelled')
   - `total_price`

### Policies (RLS)
- Les utilisateurs peuvent voir leur propre profil
- Tout le monde peut voir les voitures (public)
- Les utilisateurs peuvent créer/voir leurs propres réservations

---

## Prochaines Étapes (Améliorations)

- [ ] Implémenter l'authentification complète (login/signup)
- [ ] Page "Mes Réservations" pour voir l'historique
- [ ] Page "Profil" pour éditer les infos utilisateur
- [ ] Interface Admin pour gérer les voitures et réservations
- [ ] Système de paiement (Stripe)
- [ ] Notifications par email
- [ ] Système de recherche/filtres
- [ ] Upload d'images pour les voitures

---

## Commandes Utiles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint
```

---

## Support

Si tu rencontres des problèmes :
1. Vérifie que tes variables d'environnement sont correctes
2. Assure-toi que le schéma SQL a été exécuté dans Supabase
3. Vérifie les logs dans la console du navigateur
4. Consulte la documentation Supabase : https://supabase.com/docs

---

## Licence

MIT - Projet personnel
