# 🔔 Guide: Rappels Email Automatiques + Supabase Storage

## ✅ Ce qui a été ajouté

### 1. Cron Job pour Rappels Email 24h Avant 📧
- ✅ API Route `/api/cron/send-reminders`
- ✅ Configuration `vercel.json`
- ✅ Secret CRON pour sécurité
- ✅ Logs détaillés

### 2. Supabase Storage pour Images 📸
- ✅ Script SQL de configuration
- ✅ Bucket public `car-images`
- ✅ Politiques RLS (admins only pour upload)

---

## 🔔 PARTIE 1 : Rappels Email Automatiques

### Comment ça fonctionne ?

**Tous les jours à 10h**, Vercel appellera automatiquement :
```
GET /api/cron/send-reminders
```

Cette route :
1. Récupère les réservations qui commencent **demain**
2. Envoie un email de rappel à chaque utilisateur
3. Retourne un rapport (combien envoyés, combien échoués)

---

### Test en Local (Maintenant)

Tu peux tester immédiatement sans attendre le déploiement :

```bash
# Dans un nouveau terminal
curl http://localhost:3003/api/cron/send-reminders
```

**Résultat attendu** :
```json
{
  "success": true,
  "sent": 0,
  "failed": 0,
  "total": 0,
  "date": "10 janvier 2026",
  "message": "No bookings to remind"
}
```

Si tu as une réservation qui commence demain, tu verras :
```json
{
  "success": true,
  "sent": 1,
  "failed": 0,
  "total": 1,
  "date": "10 janvier 2026"
}
```

Et l'utilisateur recevra un email !

---

### Test avec une Réservation Fictive

Pour tester immédiatement, crée une réservation qui commence **demain** :

1. Va sur http://localhost:3003
2. Connecte-toi
3. Réserve une voiture avec :
   - Date début : **Demain**
   - Date fin : Dans 3 jours
4. Confirme la réservation
5. Exécute :
   ```bash
   curl http://localhost:3003/api/cron/send-reminders
   ```
6. ✅ Tu devrais recevoir un email de rappel !

---

### Déploiement sur Vercel

Une fois déployé sur Vercel :

#### 1. Configurer le Secret
Dans les **Settings** du projet Vercel :
```
Environment Variables:
CRON_SECRET = apx_cron_secret_2026_secure_key
```

#### 2. Vérifier le Cron
Vercel créera automatiquement le cron job en lisant `vercel.json`.

Tu peux voir les exécutions dans :
```
Vercel Dashboard → Project → Cron Jobs
```

#### 3. Format du Cron Schedule
```
"0 10 * * *"
```

Signifie : **Tous les jours à 10h00 (UTC)**

**Autres exemples** :
- `0 8 * * *` → 8h tous les jours
- `0 12 * * *` → Midi tous les jours
- `0 18 * * 5` → 18h tous les vendredis
- `0 */6 * * *` → Toutes les 6 heures

---

### Logs et Monitoring

#### En développement
Les logs apparaissent dans le terminal :
```
🔍 Recherche des réservations pour: 10 janvier 2026
📧 2 réservation(s) trouvée(s)
✅ Rappel envoyé à user1@example.com pour Tesla Model 3
✅ Rappel envoyé à user2@example.com pour BMW Série 3
📊 Résumé: { sent: 2, failed: 0, total: 2 }
```

#### En production (Vercel)
1. Va sur **Vercel Dashboard**
2. Clique sur ton projet
3. Va dans **Logs**
4. Filtre par `/api/cron/send-reminders`

Tu verras chaque exécution avec :
- Nombre d'emails envoyés
- Erreurs éventuelles
- Durée d'exécution

---

### Vérifier les Emails Envoyés

Sur **Resend Dashboard** : https://resend.com/emails

Filtre par sujet : `"Rappel : Votre location commence demain"`

---

## 📸 PARTIE 2 : Supabase Storage pour Images

### Pourquoi Supabase Storage ?

**Avantages** :
- ✅ Hébergement gratuit (1GB)
- ✅ CDN intégré (chargement rapide)
- ✅ Sécurisé avec RLS
- ✅ Pas de dépendance externe (Unsplash)
- ✅ Upload depuis l'admin

**vs Unsplash** :
- ❌ Limite API Unsplash
- ❌ Images non contrôlées
- ❌ Peuvent disparaître

---

### Configuration (5 minutes)

#### Étape 1 : Exécuter le SQL

1. Aller sur [supabase.com](https://supabase.com)
2. Ouvrir **SQL Editor**
3. Copier/coller le contenu de `supabase-storage-setup.sql`
4. Cliquer **Run**
5. ✅ Vérifier : "Success. No rows returned"

Cela crée :
- ✅ Bucket `car-images` (public, 5MB max par image)
- ✅ Politiques RLS (admins uniquement pour upload/delete)

---

#### Étape 2 : Vérifier le Bucket

1. Dans Supabase Dashboard, aller sur **Storage**
2. Tu devrais voir le bucket `car-images`
3. Il est vide pour l'instant

---

### Upload Manuel d'Images (Admin)

#### Via Interface Supabase

1. Aller sur **Storage → car-images**
2. Cliquer **Upload**
3. Sélectionner tes images de voitures
4. Organiser en dossiers :
   ```
   car-images/
   ├── fiat-500/
   │   ├── front.jpg
   │   ├── side.jpg
   │   └── interior.jpg
   ├── tesla-model-3/
   │   ├── exterior.jpg
   │   ├── dashboard.jpg
   │   └── trunk.jpg
   └── ...
   ```

---

#### Récupérer les URLs

Une fois uploadées, récupère les URLs publiques :

**Format** :
```
https://[PROJECT_ID].supabase.co/storage/v1/object/public/car-images/[CHEMIN]
```

**Exemple** :
```
https://afjjgdyojvsklyblojao.supabase.co/storage/v1/object/public/car-images/fiat-500/front.jpg
```

---

### Mettre à Jour la Base de Données

Une fois les images uploadées, mets à jour la table `cars` :

```sql
-- Exemple pour la Fiat 500
UPDATE cars
SET images = ARRAY[
  'https://afjjgdyojvsklyblojao.supabase.co/storage/v1/object/public/car-images/fiat-500/front.jpg',
  'https://afjjgdyojvsklyblojao.supabase.co/storage/v1/object/public/car-images/fiat-500/side.jpg',
  'https://afjjgdyojvsklyblojao.supabase.co/storage/v1/object/public/car-images/fiat-500/interior.jpg'
]
WHERE name = 'Fiat 500';

-- Pour toutes les voitures
UPDATE cars
SET images = ARRAY[
  'https://afjjgdyojvsklyblojao.supabase.co/storage/v1/object/public/car-images/' || LOWER(REPLACE(name, ' ', '-')) || '/1.jpg',
  'https://afjjgdyojvsklyblojao.supabase.co/storage/v1/object/public/car-images/' || LOWER(REPLACE(name, ' ', '-')) || '/2.jpg',
  'https://afjjgdyojvsklyblojao.supabase.co/storage/v1/object/public/car-images/' || LOWER(REPLACE(name, ' ', '-')) || '/3.jpg'
];
```

---

### Upload Programmatique (Future Feature)

Pour permettre l'upload via l'interface admin, tu pourras ajouter :

```typescript
// components/admin/ImageUpload.tsx (futur)
import { createClient } from '@/lib/supabase/client'

async function uploadCarImage(file: File, carId: string) {
  const supabase = createClient()

  const fileName = `${carId}/${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from('car-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  // Récupérer l'URL publique
  const { data: { publicUrl } } = supabase.storage
    .from('car-images')
    .getPublicUrl(fileName)

  return publicUrl
}
```

---

## 📊 Configuration Next.js

Les images Supabase sont déjà autorisées dans `next.config.js` :

```javascript
remotePatterns: [
  {
    protocol: 'https',
    hostname: '*.supabase.co',
  }
]
```

✅ Rien à faire !

---

## ✅ Checklist de Validation

### Rappels Email
- [x] API Route créée (`/api/cron/send-reminders`)
- [x] `vercel.json` configuré
- [x] `CRON_SECRET` ajouté dans `.env.local`
- [ ] Test en local effectué (curl)
- [ ] Réservation test créée pour demain
- [ ] Email de rappel reçu
- [ ] Déployé sur Vercel
- [ ] Variable `CRON_SECRET` ajoutée sur Vercel
- [ ] Cron job visible dans Vercel Dashboard

### Supabase Storage
- [ ] Script SQL `supabase-storage-setup.sql` exécuté
- [ ] Bucket `car-images` créé et visible
- [ ] Quelques images uploadées manuellement
- [ ] URLs publiques récupérées
- [ ] Table `cars` mise à jour avec nouvelles URLs
- [ ] Images s'affichent dans le carousel

---

## 🧪 Tests à Effectuer

### Test 1 : Cron Job Local
```bash
# Terminal 1 : Serveur en cours
# Terminal 2 : Test cron
curl http://localhost:3003/api/cron/send-reminders

# Résultat attendu :
# { "success": true, "sent": X, ... }
```

### Test 2 : Avec Réservation Demain
```
1. Créer une réservation qui commence demain
2. curl http://localhost:3003/api/cron/send-reminders
3. ✅ Recevoir l'email de rappel
4. ✅ Voir les logs dans le terminal
```

### Test 3 : Supabase Storage
```
1. Uploader une image dans car-images
2. Copier l'URL publique
3. Ouvrir l'URL dans le navigateur
4. ✅ L'image s'affiche
```

---

## 🚀 Déploiement Production

### Sur Vercel

1. **Push le code** :
   ```bash
   git add .
   git commit -m "Add cron reminders + Supabase Storage setup"
   git push
   ```

2. **Variables d'environnement** :
   - `CRON_SECRET` → `apx_cron_secret_2026_secure_key`
   - (Les autres sont déjà configurées)

3. **Vérifier le Cron** :
   - Vercel Dashboard → Cron Jobs
   - Tu devrais voir : `/api/cron/send-reminders` (daily at 10:00 UTC)

4. **Premier test** :
   - Attendre 10h UTC le lendemain
   - OU déclencher manuellement via Vercel CLI

---

## 📈 Métriques Attendues

### Rappels Email
- ✅ 1 exécution par jour à 10h
- ✅ Durée d'exécution : < 5 secondes
- ✅ Taux de succès : 99%+
- ✅ Emails envoyés : Variable selon réservations

### Supabase Storage
- ✅ 1GB gratuit (suffisant pour ~500 images haute résolution)
- ✅ Bande passante : 2GB/jour (gratuit)
- ✅ Temps de chargement : < 200ms (CDN)

---

## 🎯 Prochaines Étapes (Optionnel)

### Court Terme
- [ ] Ajouter upload d'images dans l'interface admin
- [ ] Compression automatique des images (Sharp)
- [ ] Génération de thumbnails (100x100, 400x400)
- [ ] Support WebP/AVIF pour performances

### Moyen Terme
- [ ] Cron job pour nettoyer les images non utilisées
- [ ] Analytics : images les plus vues
- [ ] Lazy loading progressif (blur placeholder)
- [ ] Mode offline (PWA)

---

## 📚 Documentation

- **Vercel Cron** : https://vercel.com/docs/cron-jobs
- **Supabase Storage** : https://supabase.com/docs/guides/storage
- **Resend API** : https://resend.com/docs

---

**Temps d'installation** :
- Cron Job : Déjà fait ✅
- Supabase Storage : 5 minutes (SQL + upload quelques images)
- Tests : 10 minutes

**Total : 15 minutes** ⚡
