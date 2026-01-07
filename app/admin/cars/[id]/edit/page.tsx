import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import CarForm from '@/components/admin/CarForm'

interface EditCarPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  const supabase = await createClient()
  const { id } = await params

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

  // Récupérer la voiture
  const { data: car } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()

  if (!car) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Modifier la Voiture</h1>
        <p className="text-gray-400">{car.name} - {car.brand} {car.model}</p>
      </div>

      <CarForm mode="edit" car={car} />
    </div>
  )
}
