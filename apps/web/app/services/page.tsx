import Link from 'next/link'
import { 
  BuildingOfficeIcon,
  ShoppingBagIcon,
  HomeIcon,
  TruckIcon,
  CogIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const services = [
  {
    name: 'Agricultural Products',
    description: 'Premium quality agricultural products including crops, yams, rice, and other farm produce sourced directly from trusted farmers.',
    icon: ShoppingBagIcon,
    features: [
      'Fresh farm produce',
      'Bulk wholesale options',
      'Quality assured products',
      'Direct from farms',
      'Competitive pricing'
    ],
    cta: 'Shop Products',
    link: '/shop?category=agriculture'
  },
  {
    name: 'Kitchenware & Utensils',
    description: 'High-quality kitchen equipment, cookware, and utensils for both domestic and commercial use.',
    icon: CogIcon,
    features: [
      'Stainless steel cookware',
      'Kitchen appliances',
      'Commercial equipment',
      'Durable materials',
      'Warranty included'
    ],
    cta: 'Browse Kitchenware',
    link: '/shop?category=kitchenware'
  },
  {
    name: 'Real Estate Services',
    description: 'Comprehensive real estate solutions including property development, brokerage, leasing, and facility management.',
    icon: BuildingOfficeIcon,
    features: [
      'Property development',
      'Real estate brokerage',
      'Property leasing',
      'Facility management',
      'Investment consulting'
    ],
    cta: 'View Properties',
    link: '/properties'
  }
]

const additionalServices = [
  {
    name: 'Property Management',
    description: 'Full-service property management including tenant relations, maintenance, and rent collection.',
    icon: HomeIcon
  },
  {
    name: 'Logistics & Distribution',
    description: 'Efficient delivery and distribution services for our agricultural and kitchenware products.',
    icon: TruckIcon
  },
  {
    name: 'Consultation Services',
    description: 'Expert consultation for agricultural practices, kitchen setup, and real estate investments.',
    icon: UserGroupIcon
  }
]

export const metadata = {
  title: 'Our Services - IDGM Universal Limited',
  description: 'Discover our comprehensive services in agriculture, kitchenware, and real estate. Quality products and professional services since 2025.',
}

export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* Jumia-inspired Hero section */}
      <section className="bg-orange-500 text-white">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-black/20 px-6 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold">Our Services</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Complete Business Solutions
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed mb-8">
              Agricultural Products, Premium Kitchenware & Professional Real Estate Services
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 inline-block">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-black">3</div>
                  <div className="text-sm">Core Services</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black">24/7</div>
                  <div className="text-sm">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black">Expert</div>
                  <div className="text-sm">Team</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services - Jumia style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-800 mb-4">What We Offer</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Three specialized service areas designed to meet all your business and personal needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.name} className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <service.icon className="h-8 w-8 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  
                  <ul className="text-left space-y-2 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <span className="h-2 w-2 bg-orange-500 rounded-full mr-3"></span>
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href={service.link}
                    className="inline-block bg-orange-500 text-white px-6 py-3 rounded-md font-bold hover:bg-orange-600 transition"
                  >
                    {service.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services - Jumia style */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-800 mb-4">Additional Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Extended support services to complement our core offerings</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service) => (
              <div key={service.name} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <service.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Jumia style */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Experience Excellence?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Contact us today to learn more about how IDGM Universal Limited can serve your business needs.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/contact"
              className="bg-orange-500 text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-orange-600 transition"
            >
              Contact Us Today
            </Link>
            <Link
              href="/about"
              className="bg-white text-black px-8 py-4 rounded-md font-bold text-lg hover:bg-gray-100 transition"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}