# Guide d'Authentification - APX

## Vue d'ensemble

Le système d'authentification APX utilise **Supabase Auth** pour gérer l'inscription, la connexion, et la gestion des profils utilisateurs. Voici tout ce qui a été mis en place.

---

## 1. Architecture du Système

### Composants créés

1. **[app/actions/auth.ts](app/actions/auth.ts)** - Actions serveur pour l'authentification
2. **[components/AuthForm.tsx](components/AuthForm.tsx)** - Formulaire d'inscription/connexion
3. **[components/ProfileForm.tsx](components/ProfileForm.tsx)** - Formulaire de modification du profil
4. **[components/Navbar.tsx](components/Navbar.tsx)** - Navigation avec état de connexion
5. **[app/login/page.tsx](app/login/page.tsx)** - Page de connexion/inscription
6. **[app/profile/page.tsx](app/profile/page.tsx)** - Page de profil utilisateur
7. **[app/bookings/page.tsx](app/bookings/page.tsx)** - Page des réservations (protégée)

### Base de données

La table `profiles` dans Supabase stocke les informations utilisateur :
- `id` (UUID) - Lié à `auth.users`
- `email` (TEXT) - Email de l'utilisateur
- `full_name` (TEXT) - Nom complet
- `phone` (TEXT) - Numéro de téléphone
- `role` (TEXT) - 'customer' ou 'admin'
- `avatar_url` (TEXT) - URL de la photo de profil
- `created_at` - Date de création
- `updated_at` - Date de dernière modification

---

## 2. Fonctionnalités Implémentées

### Inscription (`signUp`)

**Fichier:** [app/actions/auth.ts](app/actions/auth.ts#L7-L54)

```typescript
export async function signUp(formData: FormData)
```

**Ce qui se passe :**
1. Récupère email, password, full_name, phone depuis le formulaire
2. Validation : email et password requis, password minimum 6 caractères
3. Crée l'utilisateur avec `supabase.auth.signUp()`
4. Met à jour le profil dans la table `profiles`
5. Redirige vers la page d'accueil

**Champs du formulaire :**
- Email (requis)
- Mot de passe (requis, min 6 caractères)
- Nom complet (requis)
- Téléphone (optionnel)

### Connexion (`signIn`)

**Fichier:** [app/actions/auth.ts](app/actions/auth.ts#L56-L77)

```typescript
export async function signIn(formData: FormData)
```

**Ce qui se passe :**
1. Récupère email et password
2. Validation basique
3. Connexion avec `supabase.auth.signInWithPassword()`
4. Redirige vers la page d'accueil

**Champs du formulaire :**
- Email (requis)
- Mot de passe (requis)

### Déconnexion (`signOut`)

**Fichier:** [app/actions/auth.ts](app/actions/auth.ts#L79-L84)

```typescript
export async function signOut()
```

**Ce qui se passe :**
1. Appelle `supabase.auth.signOut()`
2. Revalide le cache
3. Redirige vers la page d'accueil

### Mise à jour du profil (`updateProfile`)

**Fichier:** [app/actions/auth.ts](app/actions/auth.ts#L86-L115)

```typescript
export async function updateProfile(formData: FormData)
```

**Ce qui se passe :**
1. Vérifie que l'utilisateur est connecté
2. Met à jour `full_name` et `phone` dans la table `profiles`
3. Revalide la page profil
4. Retourne un message de succès

---

## 3. Interface Utilisateur

### Page de Connexion/Inscription

**Fichier:** [app/login/page.tsx](app/login/page.tsx)

**Caractéristiques :**
- Onglets pour basculer entre Connexion et Inscription
- Validation côté client
- Messages d'erreur personnalisés
- Design responsive avec Tailwind CSS
- États de chargement (loading states)

**Utilisation :**
```
http://localhost:3000/login
```

### Page de Profil

**Fichier:** [app/profile/page.tsx](app/profile/page.tsx)

**Caractéristiques :**
- Affichage avatar avec première lettre du nom
- Badge de rôle (Client/Administrateur)
- Formulaire éditable pour nom et téléphone
- Email non modifiable (sécurité)
- Bouton de déconnexion
- Protection : redirige vers /login si non connecté

**Utilisation :**
```
http://localhost:3000/profile
```

### Navbar Dynamique

**Fichier:** [components/Navbar.tsx](components/Navbar.tsx)

**Caractéristiques :**
- Affiche l'email de l'utilisateur connecté
- Bouton "Connexion" si déconnecté
- Bouton "Déconnexion" si connecté
- Cache "Mes Réservations" et "Profil" si déconnecté
- Server Component (pas de client-side JS)

---

## 4. Protection des Pages

### Middleware de Protection

Les pages protégées vérifient l'authentification :

```typescript
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  redirect('/login')
}
```

**Pages protégées :**
- `/profile` - Page de profil
- `/bookings` - Mes réservations

**Pages publiques :**
- `/` - Accueil
- `/login` - Connexion/Inscription
- `/cars/[id]` - Détail d'une voiture

---

## 5. Flux Utilisateur

### Flux d'Inscription

1. L'utilisateur va sur `/login`
2. Clique sur l'onglet "Inscription"
3. Remplit le formulaire (email, password, nom, téléphone)
4. Soumet le formulaire
5. **Supabase Auth** crée le compte
6. Un **trigger SQL** crée automatiquement le profil dans `profiles`
7. L'utilisateur est redirigé vers la page d'accueil
8. **Email de confirmation** envoyé (à configurer dans Supabase)

### Flux de Connexion

1. L'utilisateur va sur `/login`
2. Reste sur l'onglet "Connexion"
3. Entre email et password
4. Soumet le formulaire
5. **Supabase Auth** vérifie les credentials
6. Session créée avec cookie
7. Redirige vers la page d'accueil
8. Navbar affiche l'email + bouton déconnexion

### Flux de Réservation (avec auth)

1. L'utilisateur visite `/cars/[id]`
2. Sélectionne des dates dans le calendrier
3. Clique sur "Confirmer la réservation"
4. **Si déconnecté :** Redirige vers `/login`
5. **Si connecté :** Crée la réservation dans la DB
6. Redirige vers `/bookings` pour voir la confirmation

---

## 6. Configuration Supabase Requise

### Activer l'Email Authentication

1. Aller sur [supabase.com](https://supabase.com)
2. Ouvrir votre projet APX
3. Aller dans **Authentication** → **Providers**
4. Vérifier que **Email** est activé

### Configuration Email (Optionnel mais recommandé)

Par défaut, Supabase envoie des emails de confirmation. Pour personnaliser :

1. Aller dans **Authentication** → **Email Templates**
2. Personnaliser les templates :
   - Confirmation signup
   - Reset password
   - Magic link

### Politique RLS (déjà configurée)

Les policies Row Level Security sont déjà dans [supabase-schema.sql](supabase-schema.sql) :

```sql
-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Les utilisateurs peuvent mettre à jour leur profil
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur profil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

---

## 7. Sécurité

### Mesures de Sécurité Implémentées

1. **Row Level Security (RLS)** activé sur toutes les tables
2. **Validation côté serveur** dans les Server Actions
3. **Passwords** gérés par Supabase Auth (bcrypt)
4. **Sessions** stockées dans cookies HTTP-only
5. **CSRF protection** via Next.js Server Actions
6. **Validation minimale** : password 6 caractères minimum

### Bonnes Pratiques

- Ne jamais exposer les mots de passe
- Les Server Actions sont executées côté serveur uniquement
- Les cookies de session sont HTTP-only (pas accessible en JS)
- Toujours vérifier `auth.uid()` dans les queries

---

## 8. Personnalisation

### Ajouter des Champs au Profil

1. Modifier le schéma SQL dans [supabase-schema.sql](supabase-schema.sql) :
   ```sql
   ALTER TABLE profiles ADD COLUMN birth_date DATE;
   ```

2. Mettre à jour [components/ProfileForm.tsx](components/ProfileForm.tsx) :
   ```tsx
   <input
     type="date"
     name="birth_date"
     defaultValue={profile.birth_date || ''}
   />
   ```

3. Mettre à jour [app/actions/auth.ts](app/actions/auth.ts) :
   ```typescript
   const birthDate = formData.get('birth_date') as string

   await supabase.from('profiles').update({
     birth_date: birthDate
   })
   ```

### Ajouter l'Authentification par Réseaux Sociaux

Supabase supporte OAuth (Google, GitHub, etc.) :

1. Dans Supabase Dashboard → **Authentication** → **Providers**
2. Activer le provider souhaité (ex: Google)
3. Ajouter les credentials OAuth
4. Utiliser dans le code :
   ```typescript
   await supabase.auth.signInWithOAuth({
     provider: 'google'
   })
   ```

---

## 9. Débogage

### Vérifier si l'utilisateur est connecté

```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)
```

### Voir les sessions actives

Dans Supabase Dashboard :
- **Authentication** → **Users**
- Voir tous les utilisateurs inscrits

### Erreurs Communes

| Erreur | Cause | Solution |
|--------|-------|----------|
| "Invalid login credentials" | Email/password incorrect | Vérifier les credentials |
| "Email not confirmed" | Email non vérifié | Désactiver confirmation ou vérifier email |
| "User already registered" | Email déjà utilisé | Utiliser un autre email |
| "Row Level Security" error | RLS bloque la query | Vérifier les policies SQL |

### Logs

```bash
# Logs serveur Next.js
npm run dev

# Vérifier dans la console :
- Erreurs de Supabase
- Erreurs de validation
```

---

## 10. Tests Recommandés

### Test d'Inscription

1. Aller sur `/login`
2. Cliquer sur "Inscription"
3. Remplir le formulaire :
   - Email: `test@example.com`
   - Password: `password123`
   - Nom: `Jean Dupont`
   - Téléphone: `+33 6 12 34 56 78`
4. Cliquer sur "S'inscrire"
5. Vérifier :
   - Redirection vers `/`
   - Email affiché dans la navbar
   - Bouton "Déconnexion" visible

### Test de Connexion

1. Se déconnecter
2. Aller sur `/login`
3. Rester sur "Connexion"
4. Entrer email et password
5. Cliquer sur "Se connecter"
6. Vérifier :
   - Redirection vers `/`
   - Session restaurée
   - Email affiché dans navbar

### Test de Modification de Profil

1. Se connecter
2. Aller sur `/profile`
3. Cliquer sur "Modifier mon profil"
4. Changer le nom
5. Cliquer sur "Enregistrer"
6. Vérifier :
   - Message de succès
   - Changements sauvegardés
   - Bouton revient à "Modifier mon profil"

### Test de Protection des Pages

1. Se déconnecter
2. Essayer d'aller sur `/profile`
3. Vérifier :
   - Redirection automatique vers `/login`
4. Même chose pour `/bookings`

### Test de Réservation avec Auth

1. Se connecter
2. Aller sur `/cars/[id]`
3. Sélectionner des dates
4. Cliquer sur "Confirmer la réservation"
5. Vérifier :
   - Réservation créée dans la DB
   - Redirection vers `/bookings`
   - Réservation affichée avec statut "En attente"

---

## 11. Prochaines Améliorations Possibles

### Court Terme
- [ ] Réinitialisation du mot de passe (forgot password)
- [ ] Changement de mot de passe depuis le profil
- [ ] Upload d'avatar (photo de profil)
- [ ] Confirmation par email obligatoire

### Moyen Terme
- [ ] Authentification 2FA (Two-Factor Authentication)
- [ ] OAuth (Google, GitHub, Facebook)
- [ ] Gestion des sessions actives
- [ ] Historique de connexions

### Long Terme
- [ ] Rôles et permissions avancés (Admin panel)
- [ ] API keys pour utilisateurs
- [ ] SSO (Single Sign-On)
- [ ] Audit logs pour actions sensibles

---

## 12. Ressources

### Documentation
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Fichiers Clés
- [app/actions/auth.ts](app/actions/auth.ts) - Actions serveur
- [components/AuthForm.tsx](components/AuthForm.tsx) - Formulaire auth
- [components/Navbar.tsx](components/Navbar.tsx) - Navigation
- [supabase-schema.sql](supabase-schema.sql) - Schéma DB

---

## Résumé

Le système d'authentification APX est maintenant **100% fonctionnel** avec :

✅ Inscription avec email/password
✅ Connexion sécurisée
✅ Gestion de profil
✅ Protection des pages
✅ Déconnexion
✅ Row Level Security
✅ Server Actions (sécurisé)
✅ Interface utilisateur complète

**Prêt à l'emploi !** 🚀

