# Configuration des Notifications Email

Ce guide explique comment configurer le système de notifications email avec Resend pour APX.

## 📧 Vue d'ensemble

APX utilise **Resend** et **React Email** pour envoyer automatiquement des emails lors des événements suivants :

1. **Email de bienvenue** - À l'inscription d'un nouveau utilisateur
2. **Confirmation de réservation** - Lors de la création d'une nouvelle réservation
3. **Modification de réservation** - Quand l'utilisateur modifie les dates
4. **Annulation de réservation** - Quand l'utilisateur annule
5. **Rappel avant location** - 24h avant le début de la location (à implémenter via cron)

## 🚀 Configuration

### 1. Créer un compte Resend

1. Allez sur [resend.com](https://resend.com)
2. Créez un compte gratuit (100 emails/jour)
3. Vérifiez votre email

### 2. Obtenir votre clé API

1. Dans le dashboard Resend, allez dans **API Keys**
2. Cliquez sur **Create API Key**
3. Donnez un nom (ex: "APX Production")
4. Copiez la clé (elle commence par `re_`)

### 3. Configurer les variables d'environnement

Ajoutez ces lignes à votre fichier `.env.local` :

```env
# Resend Email Configuration
RESEND_API_KEY=re_votre_cle_api_ici

# Email Sender (optionnel)
FROM_EMAIL=APX <noreply@votredomaine.com>

# Application URL (pour les liens dans les emails)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Notes :**
- En développement, utilisez `onboarding@resend.dev` comme `FROM_EMAIL` (par défaut)
- En production, configurez un domaine personnalisé dans Resend

### 4. Configurer un domaine personnalisé (Production)

Pour envoyer depuis votre propre domaine (ex: `noreply@apx.com`) :

1. Dans Resend, allez dans **Domains**
2. Cliquez sur **Add Domain**
3. Entrez votre domaine (ex: `apx.com`)
4. Ajoutez les enregistrements DNS fournis par Resend :
   - SPF record
   - DKIM record
   - DMARC record (optionnel mais recommandé)
5. Attendez la vérification (quelques minutes à quelques heures)
6. Mettez à jour `FROM_EMAIL` dans `.env.local` :
   ```env
   FROM_EMAIL=APX <noreply@apx.com>
   ```

## 📝 Templates d'email

Les templates sont dans le dossier `emails/` :

```
emails/
├── BookingConfirmation.tsx   # Confirmation de réservation
├── BookingModification.tsx   # Modification de dates
├── BookingCancellation.tsx   # Annulation
├── BookingReminder.tsx       # Rappel 24h avant
└── WelcomeEmail.tsx          # Bienvenue à l'inscription
```

### Personnaliser les templates

Tous les templates utilisent **React Email** et sont entièrement personnalisables.

Exemple de modification du template de confirmation :

```tsx
// emails/BookingConfirmation.tsx

// Modifier les couleurs
const button = {
  backgroundColor: '#votre_couleur', // Changer la couleur du bouton
  // ...
}

// Ajouter du contenu
<Text style={text}>
  Votre nouveau texte ici
</Text>
```

### Tester les templates localement

Pour prévisualiser les emails pendant le développement :

```bash
# Installer l'outil de preview React Email
npm install -g react-email

# Lancer le serveur de preview
email dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir tous vos templates.

## 🔧 Fonctionnement technique

### Server Actions

Les emails sont envoyés automatiquement via les Server Actions :

- **`app/actions/auth.ts`** :
  - `signUp()` → Envoie l'email de bienvenue
  - `cancelBooking()` → Envoie l'email d'annulation
  - `updateBooking()` → Envoie l'email de modification

- **`app/actions/bookings.ts`** :
  - `createBooking()` → Envoie l'email de confirmation

### Utilitaires d'envoi

Le fichier `lib/email.ts` contient toutes les fonctions d'envoi :

```typescript
// Exemple d'utilisation
import { sendBookingConfirmationEmail } from '@/lib/email'

await sendBookingConfirmationEmail({
  userName: 'Jean Dupont',
  userEmail: 'jean@example.com',
  carName: 'Mercedes Classe E',
  carImage: 'https://...',
  startDate: '15 janvier 2024',
  endDate: '20 janvier 2024',
  bookingId: '12345678',
})
```

## 📊 Suivi et monitoring

### Dashboard Resend

Dans le dashboard Resend, vous pouvez :
- Voir tous les emails envoyés
- Consulter les taux de délivrabilité
- Vérifier les erreurs d'envoi
- Analyser les opens/clicks (si activé)

### Logs

Les emails sont loggés dans la console :

```bash
# Succès
Booking confirmation email sent: abc123

# Erreur
Error sending booking confirmation email: [détails]
```

## 🚨 Gestion des erreurs

Les fonctions d'envoi d'email **ne bloquent pas** les actions principales :

```typescript
// L'email est envoyé de manière asynchrone
await sendBookingConfirmationEmail(data)

// Même si l'email échoue, la réservation est créée
return { success: true }
```

**Important :** Les erreurs d'envoi sont loggées mais n'empêchent pas la réservation.

## 📧 Rappels automatiques (à implémenter)

Pour envoyer des rappels 24h avant les réservations, vous pouvez :

### Option 1 : Vercel Cron Jobs (Recommandé)

Créez `app/api/cron/send-reminders/route.ts` :

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendBookingReminderEmail } from '@/lib/email'
import { addDays, format } from 'date-fns'
import { fr } from 'date-fns/locale'

export async function GET(request: Request) {
  // Vérifier le token de sécurité
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = await createClient()
  const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0]

  // Récupérer les réservations qui commencent demain
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, cars(*), profiles(*)')
    .eq('start_date', tomorrow)
    .in('status', ['pending', 'confirmed'])

  // Envoyer les rappels
  for (const booking of bookings || []) {
    await sendBookingReminderEmail({
      userName: booking.profiles?.full_name || 'Client',
      userEmail: booking.profiles?.email || '',
      carName: booking.cars?.name || '',
      carImage: booking.cars?.image_url || '',
      startDate: format(new Date(booking.start_date), 'd MMMM yyyy', { locale: fr }),
      endDate: format(new Date(booking.end_date), 'd MMMM yyyy', { locale: fr }),
      bookingId: booking.id.substring(0, 8),
    })
  }

  return NextResponse.json({ sent: bookings?.length || 0 })
}
```

Ajoutez dans `vercel.json` :

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 10 * * *"
    }
  ]
}
```

### Option 2 : Service externe

Utilisez un service comme :
- **EasyCron**
- **Cron-job.org**
- **AWS Lambda + EventBridge**

Configurez-le pour appeler votre API route quotidiennement.

## 🔒 Sécurité

### Variables d'environnement

**Ne JAMAIS** commiter votre `.env.local` dans Git !

Le fichier est déjà dans `.gitignore`.

### Protection des API routes

Pour les cron jobs, utilisez toujours un token secret :

```env
CRON_SECRET=votre_token_secret_unique
```

Vérifiez-le dans vos routes :

```typescript
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return new NextResponse('Unauthorized', { status: 401 })
}
```

## 📚 Ressources

- [Documentation Resend](https://resend.com/docs)
- [Documentation React Email](https://react.email/docs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Templates React Email](https://react.email/examples)

## ❓ Dépannage

### Les emails ne sont pas envoyés

1. Vérifiez que `RESEND_API_KEY` est bien configuré dans `.env.local`
2. Consultez les logs de la console Next.js
3. Vérifiez le dashboard Resend pour les erreurs
4. En dev, utilisez `onboarding@resend.dev` comme sender

### Les emails vont dans les spams

1. Configurez un domaine personnalisé dans Resend
2. Ajoutez les enregistrements SPF, DKIM, DMARC
3. Évitez les mots "spam" dans le subject/body
4. Testez avec [mail-tester.com](https://www.mail-tester.com)

### Limite d'emails dépassée

- **Plan gratuit** : 100 emails/jour
- **Plan Pro** : 50,000 emails/mois pour $20
- Utilisez un autre provider si nécessaire (SendGrid, Mailgun, etc.)

## ✅ Checklist de déploiement

Avant de déployer en production :

- [ ] Compte Resend créé et vérifié
- [ ] Clé API Resend ajoutée à Vercel/production
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] `FROM_EMAIL` et `NEXT_PUBLIC_APP_URL` configurés
- [ ] Templates testés avec des vraies données
- [ ] Cron job configuré pour les rappels (optionnel)
- [ ] Monitoring activé dans Resend dashboard

---

**Questions ?** Consultez la [documentation Resend](https://resend.com/docs) ou ouvrez une issue.
