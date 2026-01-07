# 🚀 Démarrage Rapide - APX

## ⚡ 3 Étapes pour Lancer l'Application

---

### 1️⃣ Installer Supabase (Base de Données)

#### a) Créer un compte Supabase
1. Va sur **[supabase.com](https://supabase.com)**
2. Clique sur **"Start your project"**
3. Crée un nouveau projet :
   - **Nom :** APX
   - **Mot de passe DB :** Choisis un mot de passe fort
   - **Région :** Europe West (ou la plus proche)
4. Attends 2-3 minutes ⏳

#### b) Créer les tables
1. Dans le menu de gauche → **SQL Editor**
2. Copie TOUT le contenu du fichier `supabase-schema.sql`
3. Colle-le dans l'éditeur
4. Clique sur **"Run"** (en bas à droite)
5. ✅ Tu devrais voir "Success"

#### c) Récupérer tes clés API
1. Menu de gauche → **Project Settings** (engrenage ⚙️)
2. Sous-menu → **API**
3. Note ces 2 valeurs :
   ```
   Project URL : https://xxxxxxx.supabase.co
   anon public : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

### 2️⃣ Configurer le Projet Next.js

#### a) Créer le fichier `.env.local`
1. À la racine du projet APX, crée un fichier nommé `.env.local`
2. Colle ce contenu (remplace par TES valeurs) :

```env
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta-clé-anon-key-ici
```

**⚠️ IMPORTANT :** Remplace les valeurs par celles de l'étape 1c !

---

### 3️⃣ Lancer l'Application

#### Dans ton terminal :
```bash
npm run dev
```

#### Puis ouvre ton navigateur :
```
http://localhost:3000
```

**🎉 C'est tout ! Tu devrais voir la page d'accueil avec 4 voitures.**

---

## 🧪 Tester l'Application

### Page d'Accueil (`/`)
- ✅ Tu vois 4 voitures : Fiat 500, Peugeot 208, BMW Série 3, Tesla Model 3
- ✅ Clique sur une carte pour voir les détails

### Page Détail (`/cars/[id]`)
- ✅ Grande photo de la voiture
- ✅ Informations : nom, marque, description, note
- ✅ **Calendrier interactif** :
  - Clique sur 2 dates pour sélectionner une période
  - Les dates passées sont grisées
  - Le prix total se calcule automatiquement

### Réserver
- ✅ Clique sur "Confirmer la réservation"
- ⚠️ Si tu n'es pas connecté → redirection vers `/login`
- 💡 Pour tester, tu devras d'abord implémenter l'authentification

---

## 📋 Commandes Utiles

```bash
# Lancer en mode développement
npm run dev

# Build de production
npm run build

# Démarrer le build
npm start

# Vérifier le code
npm run lint
```

---

## 🐛 Problèmes Courants

### "Failed to fetch" ou "Network Error"
**Solution :**
1. Vérifie que ton fichier `.env.local` existe à la racine
2. Vérifie que les valeurs sont correctes (pas d'espaces)
3. Redémarre le serveur : `Ctrl+C` puis `npm run dev`

### Les voitures ne s'affichent pas
**Solution :**
1. Va sur Supabase → **Table Editor** → `cars`
2. Vérifie que tu as bien 4 lignes de données
3. Si non, réexécute le fichier SQL complet

### "relation does not exist"
**Solution :**
1. Le schéma SQL n'a pas été exécuté
2. Va sur Supabase → **SQL Editor**
3. Réexécute le contenu de `supabase-schema.sql`

### Le calendrier ne s'affiche pas
**Solution :**
1. Vérifie qu'il n'y a pas d'erreurs dans la console (F12)
2. Assure-toi que les dépendances sont installées : `npm install`

---

## 📖 Documentation Complète

Pour plus de détails, consulte :
- **[README.md](README.md)** - Vue d'ensemble du projet
- **[GUIDE_INSTALLATION.md](GUIDE_INSTALLATION.md)** - Guide complet illustré
- **[STRUCTURE_COMPLETE.md](STRUCTURE_COMPLETE.md)** - Explication de chaque fichier
- **[RECAP_FINAL.md](RECAP_FINAL.md)** - Récapitulatif exhaustif

---

## 🎯 Prochaines Étapes (Suggestions)

1. **Implémenter l'authentification**
   - Active Email Auth dans Supabase
   - Crée un formulaire de connexion/inscription
   - Utilise `supabase.auth.signInWithPassword()`

2. **Ajouter de nouvelles voitures**
   - Va sur Supabase → **Table Editor** → `cars`
   - Clique sur **Insert row**
   - Remplis les champs et sauvegarde

3. **Personnaliser le design**
   - Modifie les couleurs dans `tailwind.config.ts`
   - Ajuste les styles dans `app/globals.css`

4. **Déployer sur Vercel**
   - Push ton code sur GitHub
   - Va sur [vercel.com](https://vercel.com)
   - Connecte ton repo et déploie
   - Ajoute les variables d'env dans les settings Vercel

---

## 💡 Conseils

- 📖 **Lis la documentation** : Next.js, Supabase, Tailwind CSS
- 🔍 **Utilise la console** : F12 pour voir les erreurs
- 🧪 **Expérimente** : Modifie le code et vois ce qui se passe
- 🤝 **Communauté** : Rejoins les Discord de Next.js et Supabase

---

## ✅ Checklist de Démarrage

- [ ] Créer un projet Supabase
- [ ] Exécuter le fichier SQL dans Supabase
- [ ] Récupérer les clés API
- [ ] Créer le fichier `.env.local`
- [ ] Coller les clés dans `.env.local`
- [ ] Lancer `npm run dev`
- [ ] Ouvrir `http://localhost:3000`
- [ ] Tester la navigation
- [ ] Tester le calendrier
- [ ] Lire la documentation complète

---

**Besoin d'aide ?**
- Consulte le [GUIDE_INSTALLATION.md](GUIDE_INSTALLATION.md) pour des explications détaillées
- Vérifie les logs dans la console du navigateur (F12)
- Vérifie les logs du terminal

**Bon développement ! 🚀**
