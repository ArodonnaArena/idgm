'use client'

import { useState } from 'react'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      })
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'Email Address',
      details: 'sanctuarymultipurpose@gmail.com',
      description: 'Send us an email anytime!',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    },
    {
      icon: PhoneIcon,
      title: 'Phone Number',
      details: '+234 800 IDGM (4346)',
      description: 'Mon-Fri from 8am to 6pm',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    },
    {
      icon: MapPinIcon,
      title: 'Office Address',
      details: 'Gowon Estate, 11th Road Shopping Centre',
      description: 'Lagos, Lagos State, Nigeria 100276',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      details: 'Monday - Friday: 8:00 AM - 6:00 PM',
      description: 'Saturday: 9:00 AM - 2:00 PM',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    }
  ]

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'products', label: 'Products & Orders' },
    { value: 'properties', label: 'Real Estate' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership' }
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircleIcon className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-orange-500 text-white px-8 py-3 rounded-md font-bold hover:bg-orange-600 transition"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Jumia-inspired Hero Section */}
      <section className="bg-orange-500 text-white">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-black/20 px-6 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold">Contact IDGM Universal</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Let's Talk Business
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed mb-8">
              Ready to experience excellence? Get in touch with our team today.
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 inline-block">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-black">24/7</div>
                  <div className="text-sm">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black">Fast</div>
                  <div className="text-sm">Response</div>
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

      {/* Contact Info Cards - Jumia style */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-800 mb-4">How to Reach Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Multiple ways to get in touch with our team</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div
                key={info.title}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-center"
              >
                <div className={`${info.bgColor} p-4 rounded-full inline-flex mb-4`}>
                  <info.icon className={`w-8 h-8 ${info.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{info.title}</h3>
                <p className="text-gray-800 font-semibold mb-2">{info.details}</p>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b bg-orange-500 text-white">
                <div className="flex items-center space-x-3">
                  <SparklesIcon className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Send us a Message</h2>
                </div>
                <p className="text-orange-100 mt-2">Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 text-white py-4 px-6 rounded-md font-bold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Visit Our Office</h3>
                  <p className="text-gray-600">
                    Gowon Estate, 11th Road Shopping Centre<br />
                    Lagos, Lagos State, Nigeria 100276
                  </p>
                  <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-orange-600 transition">
                    Get Directions
                  </button>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-800">What are your business hours?</h4>
                    <p className="text-gray-600 text-sm">Monday-Friday: 8AM-6PM, Saturday: 9AM-2PM</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Do you offer delivery?</h4>
                    <p className="text-gray-600 text-sm">Yes, we provide delivery across Lagos and nationwide shipping.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">How can I track my order?</h4>
                    <p className="text-gray-600 text-sm">You'll receive tracking details via email once your order ships.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">What payment methods do you accept?</h4>
                    <p className="text-gray-600 text-sm">We accept all major cards, bank transfers, and mobile payments.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Jumia style */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl font-black mb-4">Need Immediate Assistance?</h2>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Our customer support team is standing by to help with your questions and orders.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="tel:+2348004346"
              className="bg-orange-500 text-white px-8 py-4 rounded-md font-bold hover:bg-orange-600 transition inline-flex items-center space-x-2"
            >
              <PhoneIcon className="w-5 h-5" />
              <span>Call Now: +234 800 IDGM</span>
            </a>
            <a
              href="mailto:sanctuarymultipurpose@gmail.com"
              className="bg-white text-black px-8 py-4 rounded-md font-bold hover:bg-gray-100 transition inline-flex items-center space-x-2"
            >
              <EnvelopeIcon className="w-5 h-5" />
              <span>Send Email</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
