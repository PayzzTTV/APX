'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions/auth'

interface ProfileFormProps {
  profile: {
    email: string
    full_name: string | null
    phone: string | null
  }
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setMessage(null)

    try {
      const result = await updateProfile(formData)

      if (result?.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès' })
        setIsEditing(false)
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Une erreur est survenue' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500 text-green-400'
              : 'bg-red-500/10 border border-red-500 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <form action={handleSubmit}>
        {/* Email (non modifiable) */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Email</label>
          <div className="bg-[#252525] px-4 py-3 rounded-lg text-gray-500">
            {profile.email}
          </div>
          <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
        </div>

        {/* Nom complet */}
        <div className="mb-4">
          <label htmlFor="full_name" className="block text-sm text-gray-400 mb-2">
            Nom complet
          </label>
          {isEditing ? (
            <input
              type="text"
              id="full_name"
              name="full_name"
              defaultValue={profile.full_name || ''}
              className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-white"
              placeholder="Jean Dupont"
            />
          ) : (
            <div className="bg-[#252525] px-4 py-3 rounded-lg">
              {profile.full_name || 'Non renseigné'}
            </div>
          )}
        </div>

        {/* Téléphone */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm text-gray-400 mb-2">
            Téléphone
          </label>
          {isEditing ? (
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={profile.phone || ''}
              className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-white"
              placeholder="+33 6 12 34 56 78"
            />
          ) : (
            <div className="bg-[#252525] px-4 py-3 rounded-lg">
              {profile.phone || 'Non renseigné'}
            </div>
          )}
        </div>

        {/* Boutons */}
        <div className="pt-6 flex gap-4">
          {isEditing ? (
            <>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary-dark py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setMessage(null)
                }}
                className="px-6 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold transition-colors"
              >
                Annuler
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-primary hover:bg-primary-dark py-3 rounded-lg font-semibold transition-colors"
            >
              Modifier mon profil
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
