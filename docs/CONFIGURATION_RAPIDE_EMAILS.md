# ⚡ Configuration Rapide des Emails (5 minutes)

## 📧 Système d'Emails APX

Le système d'emails est **100% prêt**. Il ne manque que la clé API Resend.

### Emails automatiques inclus :
- ✅ **Bienvenue** - Lors de l'inscription
- ✅ **Confirmation de réservation** - Lors d'une nouvelle réservation
- ✅ **Modification de réservation** - Changement de dates
- ✅ **Annulation** - Réservation annulée
- ✅ **Rappel 24h avant** - À configurer avec cron job (optionnel)

---

## 🚀 Configuration en 3 étapes (5 minutes)

### Étape 1 : Créer un compte Resend (2 minutes)

1. **Aller sur [resend.com](https://resend.com)**

2. **Cliquer sur "Sign Up"**
   - Utiliser votre email professionnel ou personnel
   - Ou se connecter avec GitHub

3. **Vérifier votre email**
   - Consulter votre boîte mail
   - Cliquer sur le lien de confirmation

4. **Créer votre première clé API**
   - Une fois connecté, vous serez redirigé vers le dashboard
   - Cliquer sur **"API Keys"** dans le menu
   - Cliquer sur **"Create API Key"**
   - Nommer la clé : `APX Development`
   - Copier la clé (commence par `re_...`)
   - ⚠️ **IMPORTANT** : Sauvegarder immédiatement, elle ne sera plus visible !

---

### Étape 2 : Configurer les variables d'environnement (1 minute)

1. **Ouvrir le fichier `.env.local`** à la racine du projet

2. **Ajouter ces 2 lignes** :
   ```env
   RESEND_API_KEY=re_votre_cle_api_ici
   FROM_EMAIL=APX <onboarding@resend.dev>
   ```

3. **Remplacer `re_votre_cle_api_ici`** par votre vraie clé

**Exemple complet** :
```env
# Supabase (déjà configuré)
NEXT_PUBLIC_SUPABASE_URL=https://afjjgdyojvsklyblojao.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_YT9JfXyg59NIo2Pc5NKGSw_ARQ5yHqM

# Resend (NOUVEAU)
RESEND_API_KEY=re_abc123def456ghi789jkl
FROM_EMAIL=APX <onboarding@resend.dev>

# App URL (déjà configuré)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Sauvegarder le fichier**

---

### Étape 3 : Redémarrer le serveur (30 secondes)

```bash
# Arrêter le serveur (Ctrl+C dans le terminal)

# Relancer
npm run dev
```

---

## ✅ C'est fait ! Les emails fonctionnent maintenant

### Tester les emails

#### 1. Email de Bienvenue (Inscription)
1. Aller sur [http://localhost:3000/login](http://localhost:3000/login)
2. Créer un nouveau compte avec votre email
3. ✅ Vous recevrez un email de bienvenue dans quelques secondes

#### 2. Email de Confirmation (Réservation)
1. Se connecter avec votre compte
2. Choisir une voiture
3. Sélectionner des dates
4. Confirmer la réservation
5. ✅ Vous recevrez un email de confirmation

#### 3. Email de Modification
1. Aller sur [http://localhost:3000/bookings](http://localhost:3000/bookings)
2. Cliquer sur "Modifier les dates" d'une réservation
3. Changer les dates
4. Confirmer
5. ✅ Vous recevrez un email de modification

#### 4. Email d'Annulation
1. Aller sur [http://localhost:3000/bookings](http://localhost:3000/bookings)
2. Cliquer sur "Annuler la réservation"
3. Confirmer l'annulation
4. ✅ Vous recevrez un email d'annulation

---

## 📊 Vérifier les emails dans Resend

1. **Aller sur [resend.com/emails](https://resend.com/emails)**
2. Voir tous les emails envoyés
3. Statistiques :
   - ✅ Delivered (livrés)
   - ❌ Bounced (rebondis)
   - 📬 Opened (ouverts)
   - 🔗 Clicked (cliqués)

---

## 🎨 Aperçu des Emails

Tous les emails sont en **dark mode** pour correspondre à l'application :

### Email de Bienvenue
```
┌─────────────────────────────────────┐
│  🎉 Bienvenue sur APX !            │
│                                     │
│  Bonjour [Prénom],                 │
│                                     │
│  Votre compte a été créé avec      │
│  succès. Vous pouvez maintenant    │
│  réserver nos véhicules premium.   │
│                                     │
│  [Découvrir nos véhicules]         │
└─────────────────────────────────────┘
```

### Email de Confirmation
```
┌─────────────────────────────────────┐
│  ✅ Réservation confirmée          │
│                                     │
│  [Image de la voiture]             │
│                                     │
│  Véhicule : Fiat 500               │
│  Du : 15 janvier 2026              │
│  Au : 18 janvier 2026              │
│  Durée : 3 jours                   │
│  N° : #abc123                      │
│                                     │
│  [Voir ma réservation]             │
└─────────────────────────────────────┘
```

---

## 🔧 Configuration Avancée (Optionnel)

### 1. Utiliser un domaine personnalisé

**Pourquoi ?**
- Meilleur taux de délivrabilité
- Éviter le dossier spam
- Image de marque professionnelle

**Comment ?**
1. Aller sur [resend.com/domains](https://resend.com/domains)
2. Cliquer sur "Add Domain"
3. Entrer votre domaine : `apx-rental.com`
4. Configurer les DNS (SPF, DKIM, DMARC)
5. Attendre la vérification (24-48h)
6. Mettre à jour `.env.local` :
   ```env
   FROM_EMAIL=APX <noreply@apx-rental.com>
   ```

---

### 2. Configurer les rappels automatiques (Cron Job)

**Objectif** : Envoyer un email 24h avant chaque réservation

#### Sur Vercel (Production)

1. **Créer le fichier** `vercel.json` à la racine :
```json
{
  "crons": [{
    "path": "/api/cron/send-reminders",
    "schedule": "0 10 * * *"
  }]
}
```

2. **Créer l'API route** `app/api/cron/send-reminders/route.ts` :
```typescript
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendBookingReminderEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  // Vérifier le secret cron
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

  let sent = 0
  for (const booking of bookings || []) {
    try {
      await sendBookingReminderEmail(
        booking.profiles.email,
        booking.profiles.full_name,
        booking.cars.name,
        booking.start_date,
        booking.end_date,
        booking.cars.image_url
      )
      sent++
    } catch (error) {
      console.error('Error sending reminder:', error)
    }
  }

  return Response.json({ success: true, sent })
}
```

3. **Ajouter le secret** dans `.env.local` et Vercel :
```env
CRON_SECRET=votre_secret_aleatoire_ici
```

4. **Déployer sur Vercel**
```bash
git add .
git commit -m "Add email reminders cron job"
git push
```

Les emails de rappel seront envoyés **automatiquement tous les jours à 10h**.

---

## 🐛 Dépannage

### Problème : Les emails ne sont pas envoyés

**Vérification 1 : Clé API valide**
```bash
# Dans le terminal, vérifier que la variable existe
echo $RESEND_API_KEY
```

**Vérification 2 : Logs de l'application**
```bash
# Chercher les erreurs dans le terminal
# Si l'envoi échoue, vous verrez :
# "Error sending welcome email: ..."
```

**Vérification 3 : Dashboard Resend**
- Aller sur [resend.com/emails](https://resend.com/emails)
- Vérifier les erreurs (si aucun email n'apparaît, le problème vient de la clé API)

---

### Problème : Les emails vont dans les spams

**Causes possibles :**
- Utilisation de `onboarding@resend.dev` (domaine partagé)
- Pas de domaine personnalisé configuré

**Solutions :**
1. **Court terme** : Ajouter `noreply@resend.dev` aux contacts
2. **Long terme** : Configurer un domaine personnalisé (voir section avancée)

---

### Problème : Limite d'envoi dépassée

**Plan gratuit Resend :**
- ✅ 100 emails par jour
- ✅ 3,000 emails par mois

**Si vous dépassez :**
1. Passer au plan Pro ($20/mois = 50,000 emails/mois)
2. Ou créer plusieurs comptes (dev, staging, prod)

---

## 📊 Statistiques Emails

### Attendus avec Resend (moyenne industrie)

| Métrique | Taux attendu |
|----------|--------------|
| **Délivrabilité** | 99%+ |
| **Taux d'ouverture** | 20-30% |
| **Taux de clic** | 2-5% |
| **Bounces** | < 2% |
| **Spam** | < 0.1% |

---

## ✅ Checklist de Validation

- [ ] Compte Resend créé
- [ ] Clé API générée et copiée
- [ ] Variable `RESEND_API_KEY` ajoutée dans `.env.local`
- [ ] Variable `FROM_EMAIL` configurée
- [ ] Serveur redémarré
- [ ] Email de bienvenue testé (inscription)
- [ ] Email de confirmation testé (réservation)
- [ ] Email de modification testé
- [ ] Email d'annulation testé
- [ ] Dashboard Resend consulté (vérifier délivrabilité)
- [ ] 🟠 Domaine personnalisé configuré (optionnel)
- [ ] 🟠 Cron job rappels configuré (optionnel)

---

## 🎉 Félicitations !

Les emails fonctionnent maintenant ! Vos utilisateurs recevront :
- ✅ Un email de bienvenue chaleureux
- ✅ Des confirmations de réservation professionnelles
- ✅ Des notifications de modifications
- ✅ Des confirmations d'annulation

**Temps total d'installation :** 5 minutes

**Prochaine étape :** Tester tous les scénarios et vérifier le dashboard Resend !

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- [`docs/EMAILS_README.md`](EMAILS_README.md) - Vue d'ensemble du système
- [`docs/EMAIL_SETUP.md`](EMAIL_SETUP.md) - Configuration détaillée
- [`docs/TEST_EMAILS.md`](TEST_EMAILS.md) - Guide de test complet
- [Documentation Resend](https://resend.com/docs) - API officielle
