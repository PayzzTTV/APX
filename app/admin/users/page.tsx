import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UserRow from '@/components/admin/UserRow'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // Vérifier l'authentification et le rôle admin
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Vérifier le rôle admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // Récupérer tous les utilisateurs
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  // Statistiques
  const totalUsers = users?.length || 0
  const adminUsers = users?.filter(u => u.role === 'admin').length || 0
  const regularUsers = users?.filter(u => u.role === 'user').length || 0

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Gestion des Utilisateurs</h1>
        <p className="text-gray-400">Voir et modifier les profils utilisateurs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <p className="text-blue-400 text-sm font-medium mb-1">Total</p>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-400 text-sm font-medium mb-1">Admins</p>
          <p className="text-3xl font-bold">{adminUsers}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <p className="text-green-400 text-sm font-medium mb-1">Utilisateurs</p>
          <p className="text-3xl font-bold">{regularUsers}</p>
        </div>
      </div>

      {/* Users Table */}
      {users && users.length > 0 ? (
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Rôle
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Inscrit le
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((userProfile: any) => (
                  <UserRow
                    key={userProfile.id}
                    user={userProfile}
                    currentUserId={user.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg">Aucun utilisateur trouvé.</p>
        </div>
      )}
    </div>
  )
}
