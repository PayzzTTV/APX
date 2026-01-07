import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CarForm from '@/components/admin/CarForm'

export default async function NewCarPage() {
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Ajouter une Voiture</h1>
        <p className="text-gray-400">Remplissez les informations du véhicule</p>
      </div>

      <CarForm mode="create" />
    </div>
  )
}
