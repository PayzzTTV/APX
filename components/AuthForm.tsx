'use client'

import { useState } from 'react'
import { signIn, signUp } from '@/app/actions/auth'

export default function AuthForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setLoading(true)

    try {
      const result = mode === 'signin'
        ? await signIn(formData)
        : await signUp(formData)

      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-[#1a1a1a] rounded-xl p-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setMode('signin')
              setError(null)
            }}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              mode === 'signin'
                ? 'bg-primary text-white'
                : 'bg-[#252525] text-gray-400 hover:text-white'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => {
              setMode('signup')
              setError(null)
            }}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              mode === 'signup'
                ? 'bg-primary text-white'
                : 'bg-[#252525] text-gray-400 hover:text-white'
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2 text-center">
          {mode === 'signin' ? 'Connexion' : 'Inscription'}
        </h1>
        <p className="text-gray-400 text-center mb-8">
          {mode === 'signin'
            ? 'Connectez-vous pour réserver une voiture'
            : 'Créez votre compte pour commencer'}
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form action={handleSubmit} className="space-y-4">
          {/* Nom complet (inscription uniquement) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium mb-2">
                Nom complet
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                required
                className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-white"
                placeholder="Jean Dupont"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-white"
              placeholder="ton@email.com"
            />
          </div>

          {/* Téléphone (inscription uniquement) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Téléphone (optionnel)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-white"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-white"
              placeholder="••••••••"
            />
            {mode === 'signup' && (
              <p className="text-gray-500 text-xs mt-1">
                Minimum 6 caractères
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Chargement...'
              : mode === 'signin'
              ? 'Se connecter'
              : "S'inscrire"}
          </button>
        </form>

        {/* Info Box pour l'inscription */}
        {mode === 'signup' && (
          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4 mt-6">
            <p className="text-blue-400 text-sm">
              <strong>Note :</strong> Un email de confirmation sera envoyé à votre adresse.
              Vérifiez votre boîte de réception.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
