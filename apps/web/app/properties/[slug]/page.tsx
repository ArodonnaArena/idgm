import { prisma } from '../../../lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  MinusIcon,
  CameraIcon,
  TrophyIcon,
  ShieldCheckIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface PropertyPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug }
  })
  
  if (!property) {
    return {
      title: 'Property Not Found - IDGM Universal Limited'
    }
  }
  
  return {
    title: `${property.title} - IDGM Universal Limited`,
    description: property.description || `View details for ${property.title} in ${property.city}, ${property.state}. Premium property management by IDGM Universal Limited.`,
  }
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      images: true,
      units: {
        where: { status: 'AVAILABLE' },
        orderBy: { rent: 'asc' }
      },
      landlord: {
        include: {
          user: {
            select: { name: true, email: true, phone: true }
          }
        }
      }
    }
  })

  if (!property) {
    notFound()
  }

  const minRent = property.units.length > 0 ? Math.min(...property.units.map(u => Number(u.rent || 0))) : Number(property.price || 0)
  const maxRent = property.units.length > 0 ? Math.max(...property.units.map(u => Number(u.rent || 0))) : Number(property.price || 0)

  const amenities = [
    { name: 'Swimming Pool', icon: '🏊‍♂️', available: true },
    { name: '24/7 Security', icon: '🔒', available: true },
    { name: 'Parking Space', icon: '🚗', available: true },
    { name: 'Generator', icon: '⚡', available: true },
    { name: 'Air Conditioning', icon: '❄️', available: true },
    { name: 'Gym/Fitness Center', icon: '💪', available: false },
    { name: 'Elevator', icon: '🛗', available: true },
    { name: 'Garden/Green Space', icon: '🌳', available: true },
    { name: 'CCTV Surveillance', icon: '📹', available: true },
    { name: 'Internet/WiFi', icon: '📶', available: true },
    { name: 'Water Supply', icon: '💧', available: true },
    { name: 'Waste Management', icon: '🗑️', available: true }
  ]

  const nearbyPlaces = [
    { name: 'Victoria Island Business District', distance: '2.5km', type: 'Business' },
    { name: 'Tafawa Balewa Square', distance: '3.2km', type: 'Recreation' },
    { name: 'Lagos Island Hospital', distance: '1.8km', type: 'Healthcare' },
    { name: 'CMS Grammar School', distance: '2.1km', type: 'Education' },
    { name: 'Apapa Port', distance: '5.4km', type: 'Transport' },
    { name: 'National Theatre', distance: '4.7km', type: 'Entertainment' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* SPECTACULAR Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative">
          {/* Navigation */}
          <div className="flex items-center justify-between p-6">
            <Link 
              href="/properties" 
              className="group flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl hover:bg-white/30 transition-all"
            >
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
              <span className="font-semibold">Back to Properties</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl hover:bg-white/30 transition-all hover:scale-110">
                <HeartIcon className="w-6 h-6" />
              </button>
              <button className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl hover:bg-white/30 transition-all hover:scale-110">
                <ShareIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Property Header */}
          <div className="px-6 pb-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="bg-yellow-400 text-black px-4 py-2 rounded-2xl font-bold animate-pulse">
                  ⭐ PREMIUM PROPERTY
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl">
                  🏢 {property.type}
                </div>
                <div className="bg-green-500 text-white px-4 py-2 rounded-2xl font-bold">
                  🔥 {property.units.length} Units Available
                </div>
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-extrabold mb-4">
                {property.title}
              </h1>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-6 h-6" />
                  <span className="text-xl">{property.address}, {property.city}, {property.state}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-6 h-6 text-yellow-300 fill-current" />
                  <span className="text-xl font-bold">4.9</span>
                  <span className="text-green-200">(127 reviews)</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-green-400 to-blue-400 px-6 py-3 rounded-2xl">
                  <span className="text-3xl font-extrabold">
                    ₦{minRent === maxRent ? minRent.toLocaleString() : `${minRent.toLocaleString()} - ${maxRent.toLocaleString()}`}
                  </span>
                  <span className="text-green-100 ml-2">/month</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="w-6 h-6 text-yellow-300" />
                  <span>Award Winning Property</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AMAZING Image Gallery Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Image */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-3xl overflow-hidden group">
                {property.images.length > 0 ? (
                  <img
                    src={property.images[0]?.url || '/placeholder-property.jpg'}
                    alt={property.images[0]?.alt || property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HomeIcon className="w-24 h-24 text-white/80" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div>
                      <h3 className="text-white text-2xl font-bold">Main View</h3>
                      <p className="text-gray-200">Property exterior and surrounding area</p>
                    </div>
                    <button className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl hover:bg-white/30 transition-all">
                      <CameraIcon className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gallery Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden group cursor-pointer">
                  <div className="w-full h-full bg-gradient-to-br from-blue-300 via-purple-400 to-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <div className="text-center text-white">
                      <CameraIcon className="w-12 h-12 mx-auto mb-2" />
                      <p className="font-semibold">View {index + 1}</p>
                    </div>
                  </div>
                  
                  {index === 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center text-white">
                        <PlusIcon className="w-16 h-16 mx-auto mb-2" />
                        <p className="text-xl font-bold">+12 More</p>
                        <p className="text-gray-200">View Gallery</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Property Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border">
              <h2 className="text-3xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Property Overview
                </span>
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                {property.description || 'This premium property offers exceptional living spaces with modern amenities and stunning views. Located in a prime area with easy access to business districts, shopping centers, and recreational facilities.'}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">🛌</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mb-1">
                    {property.units.length > 0 
                      ? `${Math.min(...property.units.map(u => u.bedrooms || 0))}-${Math.max(...property.units.map(u => u.bedrooms || 0))}`
                      : 'N/A'
                    }
                  </p>
                  <p className="text-gray-600 font-medium">Bedrooms</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">🚿</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mb-1">
                    {property.units.length > 0 
                      ? `${Math.min(...property.units.map(u => u.bathrooms || 0))}-${Math.max(...property.units.map(u => u.bathrooms || 0))}`
                      : 'N/A'
                    }
                  </p>
                  <p className="text-gray-600 font-medium">Bathrooms</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">📏</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 mb-1">
                    {property.units.length > 0 
                      ? `${Math.min(...property.units.map(u => u.sizeSqm || 0))}-${Math.max(...property.units.map(u => u.sizeSqm || 0))}`
                      : 'N/A'
                    }
                  </p>
                  <p className="text-gray-600 font-medium">Sqm</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl">
                  <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">🏠</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600 mb-1">{property.units.length}</p>
                  <p className="text-gray-600 font-medium">Available Units</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border">
              <h3 className="text-3xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Premium Amenities
                </span> ✨
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {amenities.map((amenity) => (
                  <div 
                    key={amenity.name} 
                    className={`flex items-center space-x-3 p-4 rounded-2xl transition-all hover:scale-105 ${
                      amenity.available 
                        ? 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200' 
                        : 'bg-gray-50 border border-gray-200 opacity-60'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      amenity.available ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      <span className="text-2xl text-white">{amenity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{amenity.name}</p>
                      <p className={`text-sm ${amenity.available ? 'text-green-600' : 'text-gray-500'}`}>
                        {amenity.available ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                    {amenity.available && (
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Places */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border">
              <h3 className="text-3xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Nearby Attractions
                </span> 📍
              </h3>
              
              <div className="space-y-4">
                {nearbyPlaces.map((place, index) => (
                  <div 
                    key={place.name} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl hover:from-blue-50 hover:to-purple-50 transition-all hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">📍</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{place.name}</h4>
                        <p className="text-gray-600 text-sm">{place.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{place.distance}</p>
                      <p className="text-gray-500 text-sm">away</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Booking Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border sticky top-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Book a Viewing
                  </span>
                </h3>
                <div className="flex items-center justify-center space-x-2">
                  <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">4.9/5 Rating</span>
                  <span className="text-gray-500">(127 reviews)</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="date" 
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                  <div className="relative">
                    <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>Morning (9AM - 12PM)</option>
                      <option>Afternoon (12PM - 4PM)</option>
                      <option>Evening (4PM - 7PM)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="tel" 
                      placeholder="+234 XXX XXX XXXX"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg mb-4">
                📅 Schedule Viewing
              </button>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Need immediate assistance?</p>
                <div className="flex items-center justify-center space-x-4">
                  <a href="tel:+2348123456789" className="flex items-center space-x-2 text-green-600 hover:text-green-700">
                    <PhoneIcon className="w-4 h-4" />
                    <span className="font-medium">Call Now</span>
                  </a>
                  <a href="mailto:info@idgmuniversal.com" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span className="font-medium">Email Us</span>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-6 border">
              <h4 className="text-xl font-bold mb-4 text-center">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Why Choose Us?
                </span>
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700 font-medium">100% Verified Properties</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrophyIcon className="w-6 h-6 text-yellow-600" />
                  <span className="text-gray-700 font-medium">Award-Winning Service</span>
                </div>
                <div className="flex items-center space-x-3">
                  <StarIcon className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700 font-medium">5-Star Customer Rating</span>
                </div>
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700 font-medium">Professional Agents</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 mt-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Make This Your Home? 🏠
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Don't miss out on this premium property. Schedule a viewing today and experience luxury living at its finest!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="bg-white text-green-600 px-10 py-4 text-lg font-bold rounded-2xl shadow-2xl hover:bg-green-50 transform hover:scale-105 transition-all">
              📞 Call Agent Now
            </button>
            <button className="bg-transparent border-2 border-white text-white px-10 py-4 text-lg font-bold rounded-2xl hover:bg-white hover:text-green-600 transform hover:scale-105 transition-all">
              💬 Start Live Chat
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
