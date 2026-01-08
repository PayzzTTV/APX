# ⚡ Quick Start - Authentification

## Test en 3 minutes

### 1. Lancer l'app (si pas déjà fait)

```bash
npm run dev
```

Ouvrir http://localhost:3000

---

### 2. Créer un compte

1. Aller sur **http://localhost:3000/login**
2. Cliquer sur l'onglet **"Inscription"**
3. Remplir :
   - **Email**: `test@apx.com`
   - **Password**: `test123`
   - **Nom**: `Test User`
   - **Téléphone**: `0612345678` (optionnel)
4. Cliquer **"S'inscrire"**

**Résultat attendu :**
- ✅ Redirection vers la page d'accueil
- ✅ Email `test@apx.com` affiché en haut à droite
- ✅ Bouton "Déconnexion" visible
- ✅ Menu "Mes Réservations" et "Profil" visibles

---

### 3. Modifier ton profil

1. Cliquer sur **"Profil"** dans la navbar
2. Cliquer sur **"Modifier mon profil"**
3. Changer le nom pour `John Doe`
4. Cliquer **"Enregistrer"**

**Résultat attendu :**
- ✅ Message vert "Profil mis à jour avec succès"
- ✅ Nom changé dans l'affichage
- ✅ Avatar mis à jour (initiale "J")

---

### 4. Tester une réservation

1. Retour sur **"Accueil"**
2. Cliquer sur une voiture (ex: Tesla Model 3)
3. Dans le calendrier, sélectionner :
   - **Début**: Demain
   - **Fin**: Dans 3 jours
4. Vérifier le récapitulatif (durée + prix)
5. Cliquer **"Confirmer la réservation"**

**Résultat attendu :**
- ✅ Message "Réservation créée avec succès!"
- ✅ Redirection vers "/bookings"
- ✅ Ta réservation apparaît avec statut "En attente"
- ✅ Prix total affiché

---

### 5. Se déconnecter et se reconnecter

**Déconnexion :**
1. Cliquer sur **"Déconnexion"** (en haut à droite)

**Résultat attendu :**
- ✅ Retour à la page d'accueil
- ✅ Menu "Mes Réservations" et "Profil" cachés
- ✅ Bouton "Connexion" visible

**Reconnexion :**
1. Cliquer sur **"Connexion"**
2. Rester sur l'onglet **"Connexion"**
3. Entrer :
   - **Email**: `test@apx.com`
   - **Password**: `test123`
4. Cliquer **"Se connecter"**

**Résultat attendu :**
- ✅ Redirection vers la page d'accueil
- ✅ Session restaurée
- ✅ Email affiché dans navbar
- ✅ Accès à "Mes Réservations" et "Profil"

---

### 6. Tester la protection des pages

**Déconnecter d'abord**, puis :

1. Essayer d'aller sur **http://localhost:3000/profile**
   - ✅ Devrait rediriger vers `/login`

2. Essayer d'aller sur **http://localhost:3000/bookings**
   - ✅ Devrait rediriger vers `/login`

3. Aller sur **http://localhost:3000** (accueil)
   - ✅ Devrait fonctionner (page publique)

4. Aller sur **http://localhost:3000/cars/[id]**
   - ✅ Devrait fonctionner (page publique)

---

## Vérification dans Supabase

### Voir les utilisateurs créés

1. Ouvrir **Supabase Dashboard**
2. Aller dans **Authentication** → **Users**
3. Vérifier :
   - ✅ Utilisateur `test@apx.com` est listé
   - ✅ Email confirmé ou non (selon config)

### Voir le profil dans la DB

1. Aller dans **Table Editor**
2. Ouvrir la table **`profiles`**
3. Vérifier :
   - ✅ Une ligne avec email `test@apx.com`
   - ✅ `full_name` = "John Doe" (si modifié)
   - ✅ `role` = "customer"

### Voir les réservations

1. Dans **Table Editor**
2. Ouvrir la table **`bookings`**
3. Vérifier :
   - ✅ Une ligne avec `user_id` correspondant
   - ✅ `car_id` correct
   - ✅ `start_date` et `end_date` corrects
   - ✅ `status` = "pending"
   - ✅ `total_price` correct

---

## Problèmes courants

### "Invalid login credentials"

**Cause :** Email ou mot de passe incorrect

**Solution :**
- Vérifier l'orthographe
- Créer un nouveau compte si oublié

### "Email not confirmed"

**Cause :** Confirmation email activée dans Supabase

**Solution :**
1. Supabase → Authentication → Settings
2. Désactiver "Confirm email" pour le développement
3. OU vérifier l'email de confirmation dans ta boîte

### Réservation ne se crée pas

**Cause possible :** RLS bloque la création

**Solution :**
1. Vérifier que tu es bien connecté
2. Vérifier les logs dans la console navigateur (F12)
3. Vérifier les policies RLS dans Supabase

### Profil ne s'affiche pas

**Cause :** Trigger SQL pas exécuté

**Solution :**
1. Aller dans Supabase → SQL Editor
2. Réexécuter le fichier `supabase-schema.sql` complet
3. Vérifier la table `profiles`

---

## Prochaines étapes

Une fois que tout fonctionne :

1. ✅ Lire [GUIDE_AUTHENTIFICATION.md](GUIDE_AUTHENTIFICATION.md) pour comprendre le code
2. 📖 Personnaliser l'interface (couleurs, textes, etc.)
3. 🎨 Ajouter ton propre design
4. 🚀 Implémenter les fonctionnalités avancées

---

## Commandes utiles

```bash
# Lancer le serveur
npm run dev

# Vérifier TypeScript
npx tsc --noEmit

# Build de production
npm run build

# Démarrer en production
npm start
```

---

## Aide

- **Documentation complète** : [GUIDE_AUTHENTIFICATION.md](GUIDE_AUTHENTIFICATION.md)
- **Résumé système** : [SYSTEME_AUTH_RESUME.md](SYSTEME_AUTH_RESUME.md)
- **Checklist** : [CHECKLIST.md](CHECKLIST.md)

---

**Bon test ! 🎉**

