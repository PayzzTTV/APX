import { Resend } from 'resend'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Email sender configuration
const FROM_EMAIL = process.env.FROM_EMAIL || 'APX <onboarding@resend.dev>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export interface BookingEmailData {
  userName: string
  userEmail: string
  carName: string
  carImage: string
  startDate: string
  endDate: string
  bookingId: string
}

export interface WelcomeEmailData {
  userName: string
  userEmail: string
}

export interface ModificationEmailData extends BookingEmailData {
  oldStartDate: string
  oldEndDate: string
  newStartDate: string
  newEndDate: string
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: 'Réservation confirmée - APX',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #111111; color: #ffffff;">
          <h1 style="color: #ffffff; font-size: 28px; text-align: center; margin-bottom: 30px;">Réservation Confirmée ✓</h1>

          <p style="color: #e5e5e5; font-size: 16px; line-height: 24px;">
            Bonjour <strong>${data.userName}</strong>,
          </p>

          <p style="color: #e5e5e5; font-size: 16px; line-height: 24px;">
            Nous sommes ravis de confirmer votre réservation ! Votre véhicule vous attend.
          </p>

          <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #1a1a1a; border-radius: 8px;">
            ${data.carImage ? `<img src="${data.carImage}" alt="${data.carName}" style="width: 100%; max-width: 400px; border-radius: 8px; margin-bottom: 15px;" />` : ''}
            <h2 style="color: #ffffff; font-size: 22px; margin: 15px 0 0;">${data.carName}</h2>
          </div>

          <div style="margin: 30px 0; padding: 20px; background-color: #1a1a1a; border-radius: 8px;">
            <p style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0 0 15px;">📅 Détails de votre réservation</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #a3a3a3; font-size: 14px; padding: 8px 0;">Début de location :</td>
                <td style="color: #ffffff; font-size: 14px; font-weight: 500; padding: 8px 0; text-align: right;">${data.startDate}</td>
              </tr>
              <tr>
                <td style="color: #a3a3a3; font-size: 14px; padding: 8px 0;">Fin de location :</td>
                <td style="color: #ffffff; font-size: 14px; font-weight: 500; padding: 8px 0; text-align: right;">${data.endDate}</td>
              </tr>
              <tr>
                <td style="color: #a3a3a3; font-size: 14px; padding: 8px 0;">Numéro de réservation :</td>
                <td style="color: #ffffff; font-size: 14px; font-weight: 500; padding: 8px 0; text-align: right;">#${data.bookingId}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/bookings" style="display: inline-block; background-color: #ffffff; color: #000000; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 30px; border-radius: 6px;">
              Voir ma réservation
            </a>
          </div>

          <p style="color: #737373; font-size: 14px; text-align: center; margin-top: 30px;">
            À bientôt sur la route,<br>L'équipe APX
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending booking confirmation email:', error)
      return { success: false, error }
    }

    console.log('Booking confirmation email sent:', result?.id)
    return { success: true, id: result?.id }
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error)
    return { success: false, error }
  }
}

/**
 * Send booking modification email
 */
export async function sendBookingModificationEmail(data: ModificationEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: 'Réservation modifiée - APX',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #111111; color: #ffffff;">
          <h1 style="color: #ffffff; font-size: 28px; text-align: center; margin-bottom: 30px;">Réservation Modifiée ✓</h1>

          <p style="color: #e5e5e5; font-size: 16px; line-height: 24px;">
            Bonjour <strong>${data.userName}</strong>,
          </p>

          <p style="color: #e5e5e5; font-size: 16px; line-height: 24px;">
            Votre réservation a été modifiée avec succès.
          </p>

          <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #1a1a1a; border-radius: 8px;">
            <h2 style="color: #ffffff; font-size: 22px; margin: 0;">${data.carName}</h2>
          </div>

          <div style="margin: 30px 0; padding: 20px; background-color: #1a1a1a; border-radius: 8px;">
            <p style="color: #ffffff; font-size: 18px; font-weight: 600; text-align: center; margin: 0 0 20px;">📝 Modifications apportées</p>

            <div style="padding: 15px; background-color: #252525; border-radius: 6px; margin-bottom: 10px;">
              <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 5px;">Anciennes dates</p>
              <p style="color: #e5e5e5; font-size: 16px; margin: 0;">${data.oldStartDate} → ${data.oldEndDate}</p>
            </div>

            <p style="text-align: center; font-size: 24px; margin: 0;">↓</p>

            <div style="padding: 15px; background-color: #1a4d1a; border-radius: 6px; margin-top: 10px;">
              <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 5px;">Nouvelles dates</p>
              <p style="color: #4ade80; font-size: 16px; font-weight: 600; margin: 0;">${data.newStartDate} → ${data.newEndDate}</p>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/bookings" style="display: inline-block; background-color: #ffffff; color: #000000; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 30px; border-radius: 6px;">
              Voir ma réservation
            </a>
          </div>

          <p style="color: #737373; font-size: 14px; text-align: center; margin-top: 30px;">
            L'équipe APX
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending booking modification email:', error)
      return { success: false, error }
    }

    console.log('Booking modification email sent:', result?.id)
    return { success: true, id: result?.id }
  } catch (error) {
    console.error('Failed to send booking modification email:', error)
    return { success: false, error }
  }
}

/**
 * Send booking cancellation email
 */
export async function sendBookingCancellationEmail(data: BookingEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: 'Réservation annulée - APX',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #111111; color: #ffffff;">
          <h1 style="color: #ffffff; font-size: 28px; text-align: center; margin-bottom: 30px;">Réservation Annulée</h1>

          <p style="color: #e5e5e5; font-size: 16px; line-height: 24px;">
            Bonjour <strong>${data.userName}</strong>,
          </p>

          <p style="color: #e5e5e5; font-size: 16px; line-height: 24px;">
            Votre réservation a été annulée avec succès. Nous espérons vous revoir bientôt !
          </p>

          <div style="margin: 30px 0; padding: 20px; background-color: #1a1a1a; border-radius: 8px;">
            <p style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0 0 15px;">📋 Détails de la réservation annulée</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #a3a3a3; font-size: 14px; padding: 8px 0;">Véhicule :</td>
                <td style="color: #ffffff; font-size: 14px; font-weight: 500; padding: 8px 0; text-align: right;">${data.carName}</td>
              </tr>
              <tr>
                <td style="color: #a3a3a3; font-size: 14px; padding: 8px 0;">Période :</td>
                <td style="color: #ffffff; font-size: 14px; font-weight: 500; padding: 8px 0; text-align: right;">${data.startDate} → ${data.endDate}</td>
              </tr>
              <tr>
                <td style="color: #a3a3a3; font-size: 14px; padding: 8px 0;">Statut :</td>
                <td style="text-align: right; padding: 8px 0;">
                  <span style="background-color: #ef4444; color: #ffffff; font-size: 12px; font-weight: 600; padding: 4px 8px; border-radius: 4px;">ANNULÉE</span>
                </td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}" style="display: inline-block; background-color: #ffffff; color: #000000; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 30px; border-radius: 6px;">
              Découvrir nos véhicules
            </a>
          </div>

          <p style="color: #737373; font-size: 14px; text-align: center; margin-top: 30px;">
            À bientôt,<br>L'équipe APX
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending booking cancellation email:', error)
      return { success: false, error }
    }

    console.log('Booking cancellation email sent:', result?.id)
    return { success: true, id: result?.id }
  } catch (error) {
    console.error('Failed to send booking cancellation email:', error)
    return { success: false, error }
  }
}

/**
 * Send booking reminder email (24h before start date)
 */
export async function sendBookingReminderEmail(data: BookingEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: 'Rappel : Votre location commence demain ! - APX',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #111111; color: #ffffff;">
          <h1 style="color: #ffffff; font-size: 28px; text-align: center; margin-bottom: 30px;">🚗 Votre location commence demain !</h1>

          <p style="color: #e5e5e5; font-size: 16px; line-height: 24px;">
            Bonjour <strong>${data.userName}</strong>,
          </p>

          <p style="color: #e5e5e5; font-size: 16px; line-height: 24px;">
            C'est bientôt le grand jour ! Nous vous rappelons que votre location débute demain.
          </p>

          <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #1a1a1a; border-radius: 8px;">
            <h2 style="color: #ffffff; font-size: 22px; margin: 0;">${data.carName}</h2>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/bookings" style="display: inline-block; background-color: #ffffff; color: #000000; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 30px; border-radius: 6px;">
              Voir ma réservation
            </a>
          </div>

          <p style="color: #737373; font-size: 14px; text-align: center; margin-top: 30px;">
            Bon voyage,<br>L'équipe APX
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending booking reminder email:', error)
      return { success: false, error }
    }

    console.log('Booking reminder email sent:', result?.id)
    return { success: true, id: result?.id }
  } catch (error) {
    console.error('Failed to send booking reminder email:', error)
    return { success: false, error }
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: 'Bienvenue chez APX ! 🎉',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #111111; color: #ffffff;">
          <h1 style="color: #ffffff; font-size: 28px; text-align: center; margin-bottom: 30px;">Bienvenue chez APX ! 🎉</h1>

          <p style="color: #e5e5e5; font-size: 16px; line-height: 24px;">
            Bonjour <strong>${data.userName}</strong>,
          </p>

          <p style="color: #e5e5e5; font-size: 16px; line-height: 24px;">
            Nous sommes ravis de vous accueillir dans la communauté APX ! Vous avez désormais accès à notre flotte complète de véhicules premium en mode abonnement illimité.
          </p>

          <div style="margin: 30px 0; padding: 20px; background-color: #1a1a1a; border-radius: 8px;">
            <p style="color: #ffffff; font-size: 18px; font-weight: 600; text-align: center; margin: 0 0 20px;">✨ Vos avantages</p>

            <div style="margin: 15px 0;">
              <p style="color: #ffffff; font-size: 14px; margin: 5px 0;"><strong>🚗 Flotte Premium</strong></p>
              <p style="color: #a3a3a3; font-size: 12px; margin: 5px 0;">12 véhicules haut de gamme à votre disposition</p>
            </div>

            <div style="margin: 15px 0;">
              <p style="color: #ffffff; font-size: 14px; margin: 5px 0;"><strong>♾️ Abonnement Illimité</strong></p>
              <p style="color: #a3a3a3; font-size: 12px; margin: 5px 0;">Réservez autant de fois que vous le souhaitez</p>
            </div>

            <div style="margin: 15px 0;">
              <p style="color: #ffffff; font-size: 14px; margin: 5px 0;"><strong>🔄 Flexibilité Totale</strong></p>
              <p style="color: #a3a3a3; font-size: 12px; margin: 5px 0;">Modifiez ou annulez vos réservations facilement</p>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}" style="display: inline-block; background-color: #ffffff; color: #000000; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 30px; border-radius: 6px;">
              Découvrir la flotte
            </a>
          </div>

          <p style="color: #737373; font-size: 14px; text-align: center; margin-top: 30px;">
            Bienvenue à bord,<br>L'équipe APX
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      return { success: false, error }
    }

    console.log('Welcome email sent:', result?.id)
    return { success: true, id: result?.id }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error }
  }
}
