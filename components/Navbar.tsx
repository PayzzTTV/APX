import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Vérifier si l'utilisateur est admin
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    isAdmin = profile?.role === 'admin'
  }

  return (
    <>
      {/* Top bar - Logo only on mobile, full nav on desktop */}
      <nav className="bg-[#1a1a1a] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-primary">APX</div>
              </Link>
            </div>

            {/* Navigation Links - Centré */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center space-x-8">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Accueil
                </Link>
                {user && (
                  <>
                    <Link
                      href="/favorites"
                      className="text-gray-300 hover:text-white transition-colors font-medium"
                    >
                      Mes Favoris
                    </Link>
                    <Link
                      href="/bookings"
                      className="text-gray-300 hover:text-white transition-colors font-medium"
                    >
                      Mes Réservations
                    </Link>
                    <Link
                      href="/profile"
                      className="text-gray-300 hover:text-white transition-colors font-medium"
                    >
                      Profil
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                      >
                        Admin
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Auth Button */}
            <div className="flex-shrink-0">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm">{user.email}</span>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Déconnexion
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-primary hover:bg-primary-dark px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>

          {/* Mobile - Logo centré */}
          <div className="md:hidden flex items-center justify-center h-14">
            <div className="text-2xl font-bold text-primary">APX</div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation - Mobile only (iOS style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          <Link
            href="/"
            className="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-primary transition-colors"
          >
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs">Accueil</span>
          </Link>

          {user ? (
            <>
              <Link
                href="/favorites"
                className="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-primary transition-colors"
              >
                <svg
                  className="w-6 h-6 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="text-xs">Favoris</span>
              </Link>

              <Link
                href="/bookings"
                className="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-primary transition-colors"
              >
                <svg
                  className="w-6 h-6 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-xs">Réservations</span>
              </Link>

              <Link
                href="/profile"
                className="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-primary transition-colors"
              >
                <svg
                  className="w-6 h-6 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-xs">Profil</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex flex-col items-center justify-center flex-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <svg
                    className="w-6 h-6 mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-xs">Admin</span>
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-primary transition-colors"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span className="text-xs">Connexion</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  )
}
