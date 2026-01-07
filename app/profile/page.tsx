import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'
import { signOut } from '@/app/actions/auth'

export default async function ProfilePage() {
  const supabase = await createClient()

  // Vérifier si l'utilisateur est connecté
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Récupérer le profil de l'utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Mon Profil</h1>

      <div className="bg-[#1a1a1a] rounded-xl p-8">
        {profile ? (
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-3xl font-bold">
                {profile.full_name
                  ? profile.full_name.charAt(0).toUpperCase()
                  : profile.email.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Rôle Badge */}
            <div className="text-center mb-4">
              <span
                className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                  profile.role === 'admin'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {profile.role === 'customer' ? 'Client' : 'Administrateur'}
              </span>
            </div>

            {/* Formulaire de profil */}
            <ProfileForm profile={profile} />

            {/* Bouton déconnexion */}
            <div className="pt-4 border-t border-gray-800">
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full bg-red-500/20 text-red-500 hover:bg-red-500/30 py-3 rounded-lg font-semibold transition-colors"
                >
                  Se déconnecter
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Impossible de charger votre profil.</p>
          </div>
        )}
      </div>
    </div>
  )
}
