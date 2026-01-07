'use client'

import { Car, Calendar, Users } from 'lucide-react'

export default function QuickActions() {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="/admin/cars"
          className="flex items-center gap-3 p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/30 transition-colors"
        >
          <Car className="w-6 h-6 text-blue-400" />
          <div>
            <p className="font-semibold text-white">Gérer les voitures</p>
            <p className="text-sm text-gray-400">Ajouter, modifier, supprimer</p>
          </div>
        </a>
        <a
          href="/admin/bookings"
          className="flex items-center gap-3 p-4 bg-green-500/10 hover:bg-green-500/20 rounded-lg border border-green-500/30 transition-colors"
        >
          <Calendar className="w-6 h-6 text-green-400" />
          <div>
            <p className="font-semibold text-white">Gérer les réservations</p>
            <p className="text-sm text-gray-400">Approuver, refuser</p>
          </div>
        </a>
        <a
          href="/admin/users"
          className="flex items-center gap-3 p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg border border-purple-500/30 transition-colors"
        >
          <Users className="w-6 h-6 text-purple-400" />
          <div>
            <p className="font-semibold text-white">Gérer les utilisateurs</p>
            <p className="text-sm text-gray-400">Voir, modifier</p>
          </div>
        </a>
      </div>
    </div>
  )
}
