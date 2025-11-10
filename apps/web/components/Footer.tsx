import Link from 'next/link'

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Shop', href: '/shop' },
    { name: 'Properties', href: '/properties' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ],
  support: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Refund Policy', href: '/refunds' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <span className="text-2xl font-bold text-orange-500">IDGM</span>
              <span className="text-sm text-gray-300 ml-1">UNIVERSAL LIMITED</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Nigeria's premier destination for agricultural products, 
              premium kitchenware, and professional real estate services.
            </p>
            <div className="bg-orange-500/10 rounded-lg p-4">
              <p className="text-orange-300 font-semibold text-sm">RC: 8559613 | Active Since 2025</p>
              <p className="text-gray-400 text-xs mt-1">Lagos, Nigeria</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-orange-500 transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-orange-500 transition-colors flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Contact Support
                </Link>
              </li>
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-orange-500 transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Get In Touch</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></span>
                <div>
                  <p className="font-semibold text-white">Office Address</p>
                  <p>Gowon Estate, 11th Road Shopping Centre</p>
                  <p>Lagos, Lagos State, Nigeria 100276</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></span>
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <a href="mailto:sanctuarymultipurpose@gmail.com" className="hover:text-orange-500 transition-colors">
                    sanctuarymultipurpose@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></span>
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <p>+234 800 IDGM (4346)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-300 text-sm">Subscribe for exclusive deals, new products, and company updates.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow px-4 py-3 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-orange-500 focus:outline-none" 
              />
              <button className="bg-orange-500 text-white px-6 py-3 rounded-md font-bold hover:bg-orange-600 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                &copy; 2025 IDGM Universal Limited. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                RC: 8559613 | Status: ACTIVE | Private Company Limited by Shares
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-orange-500 font-semibold text-sm">
                🏆 Nigeria's Trusted Business Partner
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
