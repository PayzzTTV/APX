'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface DeleteCarButtonProps {
  carId: string
  carName: string
}

export default function DeleteCarButton({ carId, carName }: DeleteCarButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/cars/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId }),
      })

      if (response.ok) {
        toast.success('Voiture supprimée avec succès')
        router.refresh()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-md w-full border border-gray-700">
          <h3 className="text-xl font-bold mb-2">Confirmer la suppression</h3>
          <p className="text-gray-400 mb-6">
            Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-white">{carName}</span> ?
            Cette action est irréversible.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
      title="Supprimer"
    >
      <Trash2 className="w-4 h-4 text-red-400" />
    </button>
  )
}
