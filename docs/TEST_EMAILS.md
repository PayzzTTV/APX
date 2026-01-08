# Guide de Test - Notifications Email

Ce guide explique comment tester le système d'email en développement.

## 🧪 Configuration pour les tests

### 1. Obtenir une clé API Resend (Gratuit)

1. Créez un compte sur [resend.com](https://resend.com) (gratuit, 100 emails/jour)
2. Créez une clé API
3. Ajoutez-la à `.env.local` :

```env
RESEND_API_KEY=re_votre_cle_ici
FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note :** En mode gratuit, utilisez `onboarding@resend.dev` comme sender

### 2. Redémarrer le serveur

```bash
npm run dev
```

## ✅ Scénarios de test

### Test 1 : Email de bienvenue

**Action :** Créer un nouveau compte

1. Allez sur [http://localhost:3000/login](http://localhost:3000/login)
2. Cliquez sur "Créer un compte"
3. Remplissez le formulaire avec votre vrai email
4. Soumettez le formulaire

**Résultat attendu :**
- ✅ Compte créé avec succès
- ✅ Email de bienvenue reçu dans votre boîte mail
- ✅ Email contient votre nom et informations de compte

**Vérification :**
```bash
# Dans les logs du terminal
Welcome email sent: msg_xxxxx
```

---

### Test 2 : Confirmation de réservation

**Action :** Créer une nouvelle réservation

1. Connectez-vous avec votre compte
2. Allez sur la page d'accueil
3. Cliquez sur une voiture
4. Sélectionnez des dates dans le calendrier
5. Cliquez sur "Confirmer la réservation"

**Résultat attendu :**
- ✅ Réservation créée
- ✅ Toast "Un email de confirmation vous a été envoyé"
- ✅ Email de confirmation reçu avec :
  - Photo de la voiture
  - Dates de réservation
  - Numéro de réservation
  - Bouton "Voir ma réservation"

**Vérification :**
```bash
# Dans les logs
Booking confirmation email sent: msg_xxxxx
```

---

### Test 3 : Modification de réservation

**Action :** Modifier les dates d'une réservation

1. Allez sur [http://localhost:3000/bookings](http://localhost:3000/bookings)
2. Cliquez sur "Modifier" sur une réservation
3. Changez les dates
4. Confirmez

**Résultat attendu :**
- ✅ Réservation modifiée
- ✅ Email de modification reçu avec :
  - Anciennes dates (grisées)
  - Nouvelles dates (en vert)
  - Flèche de comparaison

**Vérification :**
```bash
# Dans les logs
Booking modification email sent: msg_xxxxx
```

---

### Test 4 : Annulation de réservation

**Action :** Annuler une réservation

1. Allez sur [http://localhost:3000/bookings](http://localhost:3000/bookings)
2. Cliquez sur "Annuler" sur une réservation
3. Confirmez l'annulation

**Résultat attendu :**
- ✅ Réservation annulée (statut "cancelled")
- ✅ Email d'annulation reçu avec :
  - Badge "ANNULÉE" en rouge
  - Récapitulatif de la réservation annulée
  - Bouton "Découvrir nos véhicules"

**Vérification :**
```bash
# Dans les logs
Booking cancellation email sent: msg_xxxxx
```

---

### Test 5 : Email de rappel (Manuel)

**Action :** Tester l'email de rappel 24h avant

Ce test nécessite d'appeler directement la fonction (pas encore de cron configuré).

Créez un fichier de test `test-reminder.ts` :

```typescript
import { sendBookingReminderEmail } from '@/lib/email'

async function testReminder() {
  await sendBookingReminderEmail({
    userName: 'Jean Test',
    userEmail: 'votre@email.com',
    carName: 'Mercedes Classe E',
    carImage: 'https://example.com/car.jpg',
    startDate: '15 janvier 2024',
    endDate: '20 janvier 2024',
    bookingId: '12345678',
  })
}

testReminder()
```

**Résultat attendu :**
- ✅ Email de rappel reçu avec :
  - "Votre location commence demain !"
  - Photo de la voiture
  - Checklist (permis, identité, confirmation)
  - Infos pratiques

---

## 🔍 Vérification dans Resend

1. Allez sur [resend.com/emails](https://resend.com/emails)
2. Vous verrez tous les emails envoyés
3. Cliquez sur un email pour voir :
   - Le contenu HTML
   - Le statut de délivrance
   - Les erreurs éventuelles

## 🐛 Dépannage

### Problème : Aucun email reçu

**Solutions :**
1. Vérifiez la clé API dans `.env.local`
2. Consultez les spams/promotions
3. Vérifiez le dashboard Resend pour les erreurs
4. Assurez-vous que le serveur dev est redémarré après modification de `.env.local`

### Problème : Erreur "Invalid API key"

```bash
Error sending welcome email: Invalid API key
```

**Solutions :**
1. La clé API est incorrecte
2. Copiez à nouveau la clé depuis Resend
3. Vérifiez qu'il n'y a pas d'espaces avant/après
4. Redémarrez le serveur

### Problème : Email mal formaté

**Solutions :**
1. Vérifiez les templates dans `emails/`
2. Testez avec React Email dev :
   ```bash
   npx react-email dev
   ```
3. Consultez les erreurs dans la console

### Problème : Logs indiquent "success" mais pas d'email

**Solutions :**
1. Attendez quelques minutes (délai de livraison)
2. Vérifiez les spams
3. Consultez le dashboard Resend pour le statut réel
4. Utilisez un autre email pour tester

## 📊 Checklist de test complète

Avant de considérer les emails comme fonctionnels :

- [ ] Email de bienvenue reçu lors de l'inscription
- [ ] Email de confirmation reçu lors d'une réservation
- [ ] Email de modification reçu lors d'un changement de dates
- [ ] Email d'annulation reçu lors d'une annulation
- [ ] Tous les emails sont bien formatés (images, texte, boutons)
- [ ] Les liens dans les emails fonctionnent
- [ ] Les emails s'affichent correctement sur mobile
- [ ] Les emails s'affichent correctement sur desktop
- [ ] Aucune erreur dans les logs de la console
- [ ] Dashboard Resend confirme la délivrance

## 🎨 Tester le design des emails

### Prévisualisation en local

```bash
# Installer React Email CLI
npm install -g react-email

# Lancer le serveur de preview
npx react-email dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) et testez :
- Tous les templates
- Sur différents clients email (Gmail, Outlook, etc.)
- Sur mobile et desktop

### Outils de test

- **[Litmus](https://litmus.com)** - Test sur 90+ clients email (payant)
- **[Email on Acid](https://www.emailonacid.com)** - Test et vérification (payant)
- **[mail-tester.com](https://www.mail-tester.com)** - Score spam (gratuit)
- **[Resend Preview](https://resend.com/emails)** - Preview dans le dashboard

## 💡 Astuces

### Tester avec plusieurs emails

Créez des alias Gmail pour tester :
- `votre.email+test1@gmail.com`
- `votre.email+test2@gmail.com`
- Tous arrivent dans `votre.email@gmail.com`

### Désactiver les emails en dev

Si vous ne voulez pas envoyer d'emails pendant le dev :

```typescript
// lib/email.ts

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  // Mode dev : logger seulement
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 [DEV] Email would be sent:', data)
    return { success: true }
  }

  // Production : envoyer vraiment
  // ... code existant
}
```

### Logger les emails dans un fichier

```typescript
// lib/email.ts
import fs from 'fs'

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const result = await resend.emails.send({ ... })

  // Logger dans un fichier
  fs.appendFileSync('email-log.txt',
    `${new Date().toISOString()} - Welcome email sent to ${data.userEmail}\n`
  )

  return result
}
```

---

**Bon test ! 🚀**
