'use client'

import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050508] text-[#e8e8ec]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-mono text-[#00d4ff] hover:text-[#00d4ff]/80 transition-colors mb-12"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          BACK TO ASTRO
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">Privacy Policy</h1>
        <p className="text-sm font-mono text-[#8b8b9b] mb-12">Last updated: April 14, 2026</p>

        <div className="space-y-8 text-[#8b8b9b] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#e8e8ec] mb-3">1. Information We Collect</h2>
            <p>
              When you visit Astro Universe, we may collect certain information automatically, including your IP address,
              browser type, device information, and browsing behavior through cookies and similar technologies.
              We use Vercel Analytics to understand how visitors interact with our site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e8e8ec] mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to operate and improve our website, analyze usage patterns,
              and enhance the user experience. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e8e8ec] mb-3">3. Cookies</h2>
            <p>
              Our website uses cookies and similar tracking technologies to enhance your browsing experience.
              You can control cookie preferences through your browser settings. Disabling cookies may affect
              certain features of the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e8e8ec] mb-3">4. Third-Party Services</h2>
            <p>
              We may use third-party services such as analytics providers and content delivery networks.
              These services may collect information about your use of our website in accordance with their
              own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e8e8ec] mb-3">5. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no method of
              transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e8e8ec] mb-3">6. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:hello@astroverse.com" className="text-[#00d4ff] hover:underline">
                hello@astroverse.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-[#1a1a24] text-sm font-mono text-[#8b8b9b]">
          &copy; 2026 ASTRO Protocol. All rights reserved.
        </div>
      </div>
    </div>
  )
}
