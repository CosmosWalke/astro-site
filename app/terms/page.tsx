'use client'

import Link from 'next/link'

export default function TermsOfService() {
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

        <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">Terms of Service</h1>
        <p className="text-sm font-mono text-[#8b8b9b] mb-12">Last updated: April 14, 2026</p>

        <div className="space-y-8 text-[#8b8b9b] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#e8e8ec] mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Astro Universe website, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e8e8ec] mb-3">2. Use of Website</h2>
            <p>
              You may use this website for lawful purposes only. You agree not to use the site in any way that
              could damage, disable, or impair the website or interfere with any other party&apos;s use of the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e8e8ec] mb-3">3. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, audio, video, and software,
              is the property of ASTRO Protocol and is protected by copyright, trademark, and other intellectual
              property laws. You may not reproduce, distribute, or create derivative works without our express
              written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e8e8ec] mb-3">4. Digital Collectibles</h2>
            <p>
              ASTRO Universe digital collectibles (cards) are provided for entertainment purposes. Ownership of a
              digital collectible does not grant any rights to the underlying intellectual property. We reserve the
              right to modify the collectible system at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e8e8ec] mb-3">5. Age Requirement</h2>
            <p>
              You must be at least 21 years of age to use this website and purchase any products associated with
              the ASTRO brand. By using this site, you confirm that you meet this age requirement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e8e8ec] mb-3">6. Disclaimer</h2>
            <p>
              This website is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the website
              will be available at all times or that the content is accurate, complete, or current.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e8e8ec] mb-3">7. Limitation of Liability</h2>
            <p>
              ASTRO Protocol shall not be liable for any indirect, incidental, special, or consequential damages
              arising from or related to your use of the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e8e8ec] mb-3">8. Contact</h2>
            <p>
              For questions about these Terms, please contact us at{' '}
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
