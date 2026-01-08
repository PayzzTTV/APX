// Script de test rapide pour vérifier que Resend fonctionne
// Utilisation: node test-email.js votre@email.com

const { Resend } = require('resend')

const resend = new Resend('re_hJj7ixRb_AerxaRFNRwHpkeNynnfN8VK7')

const emailTest = process.argv[2] || 'test@example.com'

async function testEmail() {
  console.log(`📧 Envoi d'un email de test à ${emailTest}...`)

  try {
    const { data, error } = await resend.emails.send({
      from: 'APX <onboarding@resend.dev>',
      to: emailTest,
      subject: '🎉 Test APX - Système d\'emails configuré !',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a0a; color: #ffffff;">
          <h1 style="color: #ffffff; text-align: center;">✅ Ça fonctionne !</h1>
          <p style="font-size: 16px; line-height: 1.5;">
            Félicitations ! Le système d'emails APX est correctement configuré avec Resend.
          </p>
          <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #4ade80; margin-top: 0;">🚀 Prochaines étapes</h2>
            <ul style="line-height: 2;">
              <li>Créer un compte sur l'app</li>
              <li>Réserver un véhicule</li>
              <li>Recevoir l'email de confirmation</li>
            </ul>
          </div>
          <p style="text-align: center; color: #737373; font-size: 14px; margin-top: 30px;">
            APX - Location de véhicules premium
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('❌ Erreur:', error)
      return
    }

    console.log('✅ Email envoyé avec succès !')
    console.log('📬 ID:', data.id)
    console.log('\n🔍 Vérifiez votre boîte mail (y compris les spams)')
    console.log('📊 Dashboard Resend: https://resend.com/emails')
  } catch (err) {
    console.error('❌ Erreur inattendue:', err.message)
  }
}

testEmail()
