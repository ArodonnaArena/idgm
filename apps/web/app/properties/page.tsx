// import { prisma } from '@idgm/lib/src/prisma'
import Link from 'next/link'
import { 
  HomeIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  TrophyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export const metadata = {
  title: 'Properties - IDGM Universal Limited',
  description: 'Browse our premium real estate properties including residential, commercial, and land opportunities across Nigeria.',
}

export const dynamic = 'force-dynamic'

const propertyTypeIcons = {
  RESIDENTIAL: HomeIcon,
  COMMERCIAL: BuildingOfficeIcon,
  LAND: MapPinIcon
}

const propertyTypeColors = {
  RESIDENTIAL: 'bg-green-100 text-green-800 border-green-200',
  COMMERCIAL: 'bg-blue-100 text-blue-800 border-blue-200',
  LAND: 'bg-purple-100 text-purple-800 border-purple-200'
}

// Mock data for demonstration
const mockProperties = [
  {
    id: 1,
    title: "Luxury 4-Bedroom Duplex in Lekki",
    slug: "luxury-4bedroom-duplex-lekki",
    type: "RESIDENTIAL",
    address: "Lekki Phase 1, Lagos",
    description: "Modern duplex with swimming pool and garden",
    images: [{ url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop" }],
    units: [{ id: 1, rent: 2500000, bedrooms: 4, bathrooms: 3, sizeSqm: 250, status: 'AVAILABLE' }],
    landlord: { company: "Prime Properties Ltd", user: { name: "John Doe" } }
  },
  {
    id: 2,
    title: "Commercial Office Space - Victoria Island",
    slug: "commercial-office-victoria-island", 
    type: "COMMERCIAL",
    address: "Victoria Island, Lagos",
    description: "Prime office location with modern amenities",
    images: [{ url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop" }],
    units: [{ id: 2, rent: 5000000, bedrooms: 0, bathrooms: 2, sizeSqm: 180, status: 'AVAILABLE' }],
    landlord: { company: "Corporate Realty", user: { name: "Jane Smith" } }
  }
];

const mockPropertyTypes = [
  { type: 'RESIDENTIAL', _count: { type: 15 } },
  { type: 'COMMERCIAL', _count: { type: 8 } },
  { type: 'LAND', _count: { type: 5 } }
];

export default function PropertiesPage() {
  const properties = mockProperties;
  const propertyTypes = mockPropertyTypes;

  const stats = [
    { 
      label: 'Total Properties', 
      value: properties.length.toString(),
      icon: BuildingOfficeIcon,
      color: 'text-blue-600'
    },
    { 
      label: 'Available Units', 
      value: properties.reduce((sum, prop) => sum + prop.units.length, 0).toString(),
      icon: HomeIcon,
      color: 'text-green-600'
    },
    { 
      label: 'Property Types', 
      value: propertyTypes.length.toString(),
      icon: SparklesIcon,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* SPECTACULAR Hero Section with Animations */}
      <section className="relative bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-bounce" style={{animationDuration: '4s'}}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl mb-8 animate-bounce">
              <BuildingOfficeIcon className="w-12 h-12" />
            </div>
            <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight mb-6">
              🏢 Premium <span className="text-yellow-300">Properties</span>
            </h1>
            <p className="text-xl leading-8 text-green-100 mb-12 max-w-3xl mx-auto">
              ✨ Discover exceptional real estate opportunities across Nigeria. From luxury residences to prime commercial spaces - your dream property awaits!
            </p>
            
            {/* Quick Search Bar */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-0 bg-white/90 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <select className="px-4 py-3 rounded-xl border-0 bg-white/90 text-gray-900 focus:ring-2 focus:ring-green-500">
                  <option>All Types</option>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Land</option>
                </select>
                
                <select className="px-4 py-3 rounded-xl border-0 bg-white/90 text-gray-900 focus:ring-2 focus:ring-green-500">
                  <option>All Locations</option>
                  <option>Lagos</option>
                  <option>Abuja</option>
                  <option>Port Harcourt</option>
                </select>
                
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg">
                  🔍 Search
                </button>
              </div>
            </div>
            
            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-500 hover:rotate-3"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <stat.icon className="w-8 h-8 text-yellow-300 group-hover:animate-spin" style={{animationDuration: '2s'}} />
                    <span className="text-4xl font-extrabold text-white group-hover:text-yellow-300 transition-colors">{stat.value}</span>
                  </div>
                  <p className="text-blue-100 font-semibold">{stat.label}</p>
                  <div className="mt-2 flex justify-center">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="w-3 h-3 text-yellow-300 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-green-100">
              <div className="flex items-center space-x-2">
                <TrophyIcon className="w-6 h-6" />
                <span className="font-semibold">Award Winning Service</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-6 h-6" />
                <span className="font-semibold">100% Verified Properties</span>
              </div>
              <div className="flex items-center space-x-2">
                <StarIcon className="w-6 h-6 text-yellow-300" />
                <span className="font-semibold">5-Star Customer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DAZZLING Filters Section */}
      <section className="py-12 bg-white/80 backdrop-blur-sm border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🏠 Browse by <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Category</span>
            </h2>
            <p className="text-gray-600">Find the perfect property type that matches your needs</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/properties"
              className="group inline-flex items-center px-8 py-4 border-2 border-gray-300 text-sm font-bold rounded-2xl text-gray-700 bg-white hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 hover:text-white hover:border-transparent transition-all hover:scale-110 hover:rotate-2 shadow-lg hover:shadow-xl"
            >
              🏢 All Properties ({properties.length})
            </Link>
            {propertyTypes.map((type, index) => {
              const Icon = propertyTypeIcons[type.type as keyof typeof propertyTypeIcons]
              return (
                <Link
                  key={type.type}
                  href={`/properties?type=${type.type.toLowerCase()}`}
                  className={`group inline-flex items-center px-8 py-4 border-2 text-sm font-bold rounded-2xl transition-all hover:scale-110 hover:-rotate-2 shadow-lg hover:shadow-2xl ${
                    propertyTypeColors[type.type as keyof typeof propertyTypeColors]
                  } hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  {type.type === 'RESIDENTIAL' ? '🏠' : type.type === 'COMMERCIAL' ? '🏢' : '🌍'} {type.type.charAt(0) + type.type.slice(1).toLowerCase()} ({type._count.type})
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {properties.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <BuildingOfficeIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Properties Available</h3>
              <p className="text-gray-600 mb-6">Check back soon for new property listings!</p>
              <Link
                href="/"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => {
                const PropertyIcon = propertyTypeIcons[property.type as keyof typeof propertyTypeIcons]
                const minRent = property.units.length > 0 ? Math.min(...property.units.map(u => Number(u.rent || 0))) : Number(property.price || 0)
                const maxRent = property.units.length > 0 ? Math.max(...property.units.map(u => Number(u.rent || 0))) : Number(property.price || 0)
                
                return (
                  <div
                    key={property.id}
                    className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden hover:shadow-3xl transition-all duration-700 hover:-translate-y-6 hover:rotate-2 hover:scale-105"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="relative aspect-video bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
                      {property.images.length > 0 ? (
                        <img
                          src={property.images[0]?.url || '/placeholder-property.jpg'}
                          alt={property.images[0]?.alt || property.title}
                          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-3"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                          <PropertyIcon className="w-20 h-20 text-white/80 group-hover:animate-pulse" />
                        </div>
                      )}
                      
                      {/* Premium Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg animate-pulse">
                          ⭐ PREMIUM
                        </div>
                      </div>
                      
                      {/* Property Type Badge */}
                      <div className={`absolute top-16 left-4 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${
                        propertyTypeColors[property.type as keyof typeof propertyTypeColors]
                      }`}>
                        <PropertyIcon className="w-3 h-3 inline mr-1" />
                        {property.type === 'RESIDENTIAL' ? '🏠' : property.type === 'COMMERCIAL' ? '🏢' : '🌍'} {property.type}
                      </div>
                      
                      {/* Available Units Badge */}
                      {property.units.length > 0 && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg animate-bounce">
                          🔥 {property.units.length} Available
                        </div>
                      )}
                      
                      {/* Enhanced Action Buttons */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center space-x-4">
                        <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 rounded-2xl transition-all hover:scale-125 hover:rotate-12 shadow-lg">
                          <EyeIcon className="w-6 h-6" />
                        </button>
                        <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 rounded-2xl transition-all hover:scale-125 hover:-rotate-12 shadow-lg">
                          <HeartIcon className="w-6 h-6" />
                        </button>
                        <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 rounded-2xl transition-all hover:scale-125 hover:rotate-12 shadow-lg">
                          <ShareIcon className="w-6 h-6" />
                        </button>
                      </div>
                      
                      {/* Rating Overlay */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 flex items-center space-x-1">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white font-bold text-sm">4.9</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all line-clamp-1">
                          <Link href={`/properties/${property.slug}`}>
                            {property.title}
                          </Link>
                        </h3>
                        <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-yellow-700 font-bold text-sm">4.9</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        <span className="text-sm line-clamp-1">{property.address}, {property.city}, {property.state}</span>
                      </div>
                      
                      {property.description && (
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{property.description}</p>
                      )}
                      
                      {/* Enhanced Units Info */}
                      {property.units.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border border-blue-100">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-white rounded-xl p-3 shadow-sm">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-blue-600 text-sm font-bold">🛌</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-1">Bedrooms</p>
                              <p className="font-bold text-blue-600">
                                {property.units.length > 1 
                                  ? `${Math.min(...property.units.map(u => u.bedrooms || 0))}-${Math.max(...property.units.map(u => u.bedrooms || 0))}`
                                  : property.units[0]?.bedrooms || 'N/A'
                                }
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-3 shadow-sm">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-green-600 text-sm font-bold">🚿</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-1">Bathrooms</p>
                              <p className="font-bold text-green-600">
                                {property.units.length > 1 
                                  ? `${Math.min(...property.units.map(u => u.bathrooms || 0))}-${Math.max(...property.units.map(u => u.bathrooms || 0))}`
                                  : property.units[0]?.bathrooms || 'N/A'
                                }
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-3 shadow-sm">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-purple-600 text-sm font-bold">📏</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-1">Size (sqm)</p>
                              <p className="font-bold text-purple-600">
                                {property.units.length > 1 
                                  ? `${Math.min(...property.units.map(u => u.sizeSqm || 0))}-${Math.max(...property.units.map(u => u.sizeSqm || 0))}`
                                  : property.units[0]?.sizeSqm || 'N/A'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Enhanced Price Section */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <CurrencyDollarIcon className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                {property.units.length > 0 ? (
                                  minRent === maxRent ? (
                                    `₦${minRent.toLocaleString()}`
                                  ) : (
                                    `₦${minRent.toLocaleString()} - ₦${maxRent.toLocaleString()}`
                                  )
                                ) : (
                                  `₦${Number(property.price || 0).toLocaleString()}`
                                )}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                              {property.type === 'LAND' ? '💰 Total Price' : '📅 Monthly Rent'}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold mb-2">
                              🔥 HOT DEAL
                            </div>
                            <p className="text-xs text-gray-500">Best Price Guaranteed</p>
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        href={`/properties/${property.slug}`}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-2xl font-bold text-center hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-2 group"
                      >
                        <span>🏠 View Details</span>
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Looking for Something Specific?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Our team is here to help you find the perfect property that meets your needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 hover:shadow-lg"
              >
                Contact Our Team
              </Link>
              <Link
                href="/properties/search"
                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg border border-blue-500"
              >
                Advanced Search
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
