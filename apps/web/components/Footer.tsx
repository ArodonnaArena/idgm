import Link from 'next/link'
import { ArrowUpRightIcon, GlobeAltIcon, GlobeAmericasIcon, GlobeEuropeAfricaIcon } from '@heroicons/react/24/outline'

const navigation = {
  shop: [
    { name: 'All Products', href: '/shop' },
    { name: 'Agriculture', href: '/shop?category=agriculture' },
    { name: 'Kitchenware', href: '/shop?category=kitchenware' },
    { name: 'Hot Deals', href: '/shop?sort=deals' },
  ],
  services: [
    { name: 'Properties', href: '/properties' },
    { name: 'Property Management', href: '/services' },
    { name: 'Leasing', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Blog', href: '/services' },
    { name: 'Brands', href: '/about' },
    { name: 'Careers', href: '/contact' },
  ],
  support: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Refund Policy', href: '/refunds' },
    { name: 'Help Centre', href: '/contact' },
  ],
}

const socialLinks = [
  { label: 'Facebook', icon: GlobeAltIcon, href: 'https://facebook.com' },
  { label: 'Instagram', icon: GlobeAmericasIcon, href: 'https://instagram.com' },
  { label: 'Twitter', icon: GlobeEuropeAfricaIcon, href: 'https://twitter.com' },
  { label: 'LinkedIn', icon: GlobeAltIcon, href: 'https://linkedin.com' },
]

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 border-b border-gray-800 pb-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500 text-xl font-black text-white">ID</span>
              <span>
                <span className="block text-xl font-black">IDGM Universal</span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-orange-400">Limited</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-400">
              Premium agricultural products, kitchenware, and real estate solutions for businesses and families across Nigeria.
            </p>
            <div className="mt-6 flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-300 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Shop', links: navigation.shop },
            { title: 'Services', links: navigation.services },
            { title: 'Company', links: navigation.company },
            { title: 'Support', links: navigation.support },
          ].map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-black uppercase tracking-wide text-white">{column.title}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="group inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-orange-500">
                      {item.name}
                      <ArrowUpRightIcon className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5 border-t border-gray-800 pt-7 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p>© 2026 IDGM Universal Limited. All rights reserved.</p>
            <p className="mt-1 text-xs text-gray-500">RC 8559613 · ACTIVE · Lagos, Nigeria</p>
          </div>
          <div className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
            <span className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 font-bold text-gray-200">VISA</span>
            <span className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 font-bold text-gray-200">MC</span>
            <span className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 font-bold text-gray-200">VERVE</span>
            <span className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 font-bold text-gray-200">PAY</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
