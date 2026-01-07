'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface UserRowProps {
  user: {
    id: string
    email: string
    full_name: string | null
    role: string
    created_at: string
  }
  currentUserId: string
}

export default function UserRow({ user, currentUserId }: UserRowProps) {
  const [role, setRole] = useState(user.role)
  const [loading, setLoading] = useState(false)

  const handleRoleChange = async (newRole: string) => {
    // Ne pas permettre de modifier son propre rôle
    if (user.id === currentUserId) {
      toast.error('Vous ne pouvez pas modifier votre propre rôle')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/users/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          role: newRole,
        }),
      })

      if (response.ok) {
        setRole(newRole)
        toast.success('Rôle mis à jour avec succès')
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const isCurrentUser = user.id === currentUserId

  return (
    <tr className="hover:bg-gray-800/30 transition-colors">
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold">
            {user.full_name || 'Non renseigné'}
            {isCurrentUser && (
              <span className="ml-2 text-xs text-blue-400">(Vous)</span>
            )}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-gray-400 text-sm">{user.email}</p>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            role === 'admin'
              ? 'bg-yellow-500/20 text-yellow-500'
              : 'bg-blue-500/20 text-blue-500'
          }`}
        >
          {role === 'admin' ? 'Admin' : 'Utilisateur'}
        </span>
      </td>
      <td className="px-6 py-4">
        <p className="text-gray-400 text-sm">
          {new Date(user.created_at).toLocaleDateString('fr-FR')}
        </p>
      </td>
      <td className="px-6 py-4">
        {!isCurrentUser && (
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            disabled={loading}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm disabled:opacity-50"
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Admin</option>
          </select>
        )}
      </td>
    </tr>
  )
}
