# Guide d'Installation Complet - APX

Ce guide détaille étape par étape comment installer et configurer ton application APX.

---

## Étape 1 : Configuration de Supabase

### 1.1 Créer un compte et un projet

1. Va sur [supabase.com](https://supabase.com)
2. Clique sur **Start your project** (ou Sign In si tu as déjà un compte)
3. Crée une nouvelle organisation si nécessaire
4. Clique sur **New Project**
5. Remplis les informations :
   - **Name:** APX (ou le nom que tu veux)
   - **Database Password:** Choisis un mot de passe fort (sauvegarde-le !)
   - **Region:** Choisis la région la plus proche (ex: Europe West)
6. Clique sur **Create new project**
7. Attends 2-3 minutes que le projet soit provisionné

### 1.2 Créer les tables de la base de données

1. Dans le menu de gauche, clique sur **SQL Editor**
2. Ouvre le fichier `supabase-schema.sql` qui se trouve à la racine de ce projet
3. Copie TOUT le contenu du fichier
4. Retourne sur Supabase et colle le code dans l'éditeur SQL
5. Clique sur le bouton **Run** (en bas à droite)
6. Tu devrais voir un message de succès ✅

### 1.3 Récupérer les clés API

1. Dans le menu de gauche, clique sur **Project Settings** (icône d'engrenage)
2. Dans le sous-menu, clique sur **API**
3. Tu verras plusieurs informations importantes :

   **Project URL** : C'est l'URL de ton projet
   ```
   Exemple : https://abcdefghijklmn.supabase.co
   ```

   **anon public key** : C'est ta clé publique
   ```
   Exemple : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **GARDE CES VALEURS** - tu en auras besoin pour l'étape suivante

---

## Étape 2 : Configuration du Projet Next.js

### 2.1 Installer Node.js (si ce n'est pas déjà fait)

1. Va sur [nodejs.org](https://nodejs.org)
2. Télécharge la version LTS (Long Term Support)
3. Installe-la en suivant les instructions
4. Vérifie l'installation dans ton terminal :
   ```bash
   node --version
   npm --version
   ```

### 2.2 Installer les dépendances

1. Ouvre un terminal dans le dossier du projet APX
2. Exécute :
   ```bash
   npm install
   ```
3. Attends que toutes les dépendances soient installées (peut prendre 1-2 minutes)

### 2.3 Configurer les variables d'environnement

1. À la racine du projet, tu trouveras un fichier `.env.local.example`
2. Crée un NOUVEAU fichier nommé `.env.local` (sans le `.example`)
3. Copie le contenu suivant dans `.env.local` :

   ```env
   NEXT_PUBLIC_SUPABASE_URL=COLLE_TON_PROJECT_URL_ICI
   NEXT_PUBLIC_SUPABASE_ANON_KEY=COLLE_TA_ANON_KEY_ICI
   ```

4. Remplace les valeurs par celles que tu as récupérées à l'étape 1.3

   **Exemple de fichier `.env.local` rempli :**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc4Njc2OTMsImV4cCI6MjAwMzQ0MzY5M30.abcdefg123456
   ```

5. **IMPORTANT** : Ne partage JAMAIS ce fichier publiquement !

---

## Étape 3 : Lancer l'Application

### 3.1 Mode Développement

1. Dans ton terminal, exécute :
   ```bash
   npm run dev
   ```

2. Attends quelques secondes jusqu'à voir :
   ```
   ✓ Ready in 2.3s
   ○ Local:   http://localhost:3000
   ```

3. Ouvre ton navigateur et va sur [http://localhost:3000](http://localhost:3000)

4. Tu devrais voir la page d'accueil avec la liste des voitures ! 🎉

### 3.2 Tester l'Application

1. **Page d'accueil** : Tu vois 4 voitures (Fiat 500, Peugeot 208, BMW Série 3, Tesla Model 3)
2. **Cliquer sur une voiture** : Tu arrives sur la page détail
3. **Calendrier** : Sélectionne une période en cliquant sur deux dates
4. **Réserver** : Clique sur "Confirmer la réservation"
   - Si tu n'es pas connecté, tu seras redirigé vers `/login`
   - Pour tester les réservations, tu devras d'abord implémenter l'authentification

---

## Étape 4 : Vérifier que Tout Fonctionne

### 4.1 Vérifier la connexion à Supabase

1. Sur la page d'accueil, ouvre la console du navigateur (F12)
2. Va dans l'onglet "Network" (Réseau)
3. Rafraîchis la page
4. Tu devrais voir des requêtes vers `supabase.co` avec le statut 200 ✅

### 4.2 Vérifier les données dans Supabase

1. Retourne sur ton dashboard Supabase
2. Clique sur **Table Editor** dans le menu de gauche
3. Sélectionne la table `cars`
4. Tu devrais voir 4 voitures avec leurs informations

---

## Étape 5 : Prochaines Étapes (Optionnel)

### 5.1 Activer l'Authentification Email

1. Dans Supabase, va dans **Authentication** > **Providers**
2. Active **Email** si ce n'est pas déjà fait
3. Configure les URLs de redirection si nécessaire

### 5.2 Ajouter des Voitures

1. Dans Supabase, va dans **Table Editor** > `cars`
2. Clique sur **Insert** > **Insert row**
3. Remplis les champs et clique sur **Save**
4. Rafraîchis ton application pour voir la nouvelle voiture

---

## Résolution de Problèmes

### Erreur : "Failed to fetch"
- Vérifie que tes variables d'environnement sont correctes dans `.env.local`
- Redémarre le serveur de développement (`Ctrl+C` puis `npm run dev`)

### Erreur : "relation does not exist"
- Le schéma SQL n'a pas été exécuté correctement
- Retourne sur Supabase SQL Editor et réexécute le fichier `supabase-schema.sql`

### Les images ne s'affichent pas
- C'est normal, les URLs Unsplash peuvent mettre du temps à charger
- Tu peux remplacer les URLs dans la table `cars` par tes propres images

### Le calendrier ne s'affiche pas
- Vérifie que tu as bien installé les dépendances (`npm install`)
- Vérifie qu'il n'y a pas d'erreurs dans la console du navigateur

---

## Support

Si tu bloques, voici les ressources utiles :
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)

Bon développement ! 🚀
