export const metadata = {
  title: 'About Us - IDGM Universal Limited',
  description: 'Learn about IDGM Universal Limited, a premier Nigerian company specializing in agricultural products, kitchenware, and estate management services.',
}

const leadership = [
  {
    name: 'Makanjuola Bolanle',
    role: 'Director',
    ownership: '50%',
    description: 'Co-founder and Director with extensive experience in agricultural business and real estate development.',
  },
  {
    name: 'Makanjuola Ebenezer',
    role: 'Director',
    ownership: '50%',
    description: 'Co-founder and Director specializing in operations management and strategic business development.',
  },
]

const companyDetails = [
  { label: 'Company Name', value: 'IDGM UNIVERSAL LIMITED' },
  { label: 'RC Number', value: '8559613' },
  { label: 'Date of Registration', value: '17 June 2025' },
  { label: 'Company Type', value: 'Private company limited by shares' },
  { label: 'Status', value: 'ACTIVE' },
  { label: 'Registration Location', value: 'Lagos, Nigeria' },
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Jumia-inspired Hero section */}
      <section className="bg-orange-500 text-white">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-black/20 px-6 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold">About IDGM Universal</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Nigeria's Leading Multi-Service Company
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed mb-8">
              Excellence in Agricultural Products, Premium Kitchenware & Professional Real Estate Services
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 inline-block">
              <div className="text-2xl font-black mb-2">RC: 8559613</div>
              <div className="text-sm">Verified & Active Since 2025</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story - Jumia style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black text-gray-800 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                IDGM Universal Limited was established in 2025 as a private company limited by shares, 
                registered in Lagos, Nigeria. Our company represents the culmination of years of 
                experience and dedication to serving the Nigerian market with premium products and services.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We specialize in three core areas: the sale and distribution of high-quality agricultural 
                products and kitchenware, as well as comprehensive real estate services including 
                development, brokerage, leasing, and facility management.
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
                  Established 2025
                </div>
                <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
                  Lagos, Nigeria
                </div>
              </div>
            </div>
            <div className="bg-orange-100 rounded-xl p-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-orange-500 rounded-full mx-auto flex items-center justify-center mb-6">
                  <span className="text-6xl">🏆</span>
                </div>
                <h3 className="text-3xl font-bold text-orange-600 mb-2">IDGM</h3>
                <p className="text-orange-800 font-semibold">UNIVERSAL LIMITED</p>
                <p className="text-gray-600 mt-4">Your trusted partner for excellence</p>
              </div>
            </div>
          </div>

          {/* Service highlights */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-800 mb-4">What We Do Best</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Three core areas where we deliver exceptional value to our customers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-3xl">🌾</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Agricultural Excellence</h3>
                <p className="text-gray-600">
                  Premium agricultural products sourced directly from Nigerian farms, 
                  ensuring quality and freshness for our customers.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-3xl">🍳</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quality Kitchenware</h3>
                <p className="text-gray-600">
                  Durable, high-quality kitchenware collection designed 
                  to meet the needs of modern Nigerian homes and businesses.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-3xl">🏢</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Estate Management</h3>
                <p className="text-gray-600">
                  Comprehensive real estate services from development and brokerage to 
                  leasing and facility management for all property types.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership section - Jumia style */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-800 mb-4">Meet Our Leadership</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experienced directors committed to excellence and driving growth across all business sectors
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leadership.map((person) => (
              <div key={person.name} className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800">{person.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {person.role}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {person.ownership} Owner
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{person.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company details - Jumia style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-800 mb-4">Official Company Information</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Verified registration and corporate details as recorded with the Corporate Affairs Commission
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-orange-500 text-white p-6">
                <h3 className="text-2xl font-bold">Registration Certificate</h3>
                <p className="text-orange-100">Corporate Affairs Commission - Nigeria</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {companyDetails.map((detail) => (
                    <div key={detail.label} className="bg-gray-50 rounded-lg p-4">
                      <dt className="text-sm font-semibold text-gray-600 mb-1">{detail.label}</dt>
                      <dd className="text-lg font-bold text-gray-800">{detail.value}</dd>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <dt className="text-sm font-semibold text-gray-600 mb-1">Registered Address</dt>
                    <dd className="text-gray-800 font-medium">
                      GOWON ESTATE, 11TH ROAD SHOPPING CENTRE<br />
                      LAGOS, LAGOS STATE, NIGERIA<br />
                      Post Code: 100276
                    </dd>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <dt className="text-sm font-semibold text-gray-600 mb-1">Principal Activities</dt>
                    <dd className="text-gray-800 font-medium">
                      Sale/distribution of agricultural products & kitchenware; real estate development, 
                      brokerage, leasing, facility management.
                    </dd>
                  </div>
                </div>
                
                <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="bg-green-500 w-3 h-3 rounded-full mr-3"></div>
                    <span className="text-green-800 font-bold">Status: ACTIVE & VERIFIED</span>
                  </div>
                  <p className="text-green-700 text-sm mt-2">This company is in good standing with all regulatory requirements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact section - Jumia style */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Work With Us?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Ready to experience excellence? Contact us today to learn more about our products and services.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="mailto:sanctuarymultipurpose@gmail.com"
              className="bg-orange-500 text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-orange-600 transition"
            >
              Contact Us Today
            </a>
            <a
              href="/shop"
              className="bg-white text-black px-8 py-4 rounded-md font-bold text-lg hover:bg-gray-100 transition"
            >
              Browse Products
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
