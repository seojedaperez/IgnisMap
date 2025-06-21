import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Map as MapIcon, 
  AlertTriangle, 
  Cloud, 
  Settings,
  Menu,
  X,
  Flame,
  Leaf
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Mapa', href: '/map', icon: MapIcon },
    { name: 'Alertas', href: '/alerts', icon: AlertTriangle },
    { name: 'Clima', href: '/weather', icon: Cloud },
    { name: 'Biodiversidad', href: '/biodiversity', icon: Leaf },
    { name: 'Configuración', href: '/settings', icon: Settings },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <Flame className="h-7 w-7 text-ember-coral fire-icon mr-2" />
              <h1 className="text-lg sm:text-xl font-bold text-ember-navy">IgnisMap</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4 lg:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-ember-coral bg-ember-50'
                        : 'text-gray-600 hover:text-ember-burgundy hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-1.5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-ember-burgundy hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-ember-coral bg-ember-50'
                        : 'text-gray-600 hover:text-ember-burgundy hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
