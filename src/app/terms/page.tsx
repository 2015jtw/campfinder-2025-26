import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | CampFinder',
  description: 'Read the terms and conditions for using CampFinder.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-teal-700 to-blue-600 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Legal Information
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              Terms of Service
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Please read these terms carefully before using our service
            </p>

            <div className="pt-4">
              <p className="text-white/80 text-sm">
                Last updated: <span className="font-semibold">November 3, 2025</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Agreement to Terms */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                  Agreement to Terms
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  By accessing or using CampFinder, you agree to be bound by these Terms of Service
                  and our Privacy Policy. If you disagree with any part of these terms, you may not
                  access the service.
                </p>
              </div>
            </div>
          </section>

          {/* Description of Service */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                    Description of Service
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    CampFinder is a platform that helps users discover, review, and share
                    information about campgrounds. The service includes features for searching
                    campgrounds, reading and writing reviews, uploading photos, and interacting with
                    other outdoor enthusiasts.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                  User Accounts
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                  When you create an account with us, you must provide accurate, complete, and
                  current information. Failure to do so constitutes a breach of the Terms.
                </p>
                <div className="space-y-3">
                  {[
                    'You are responsible for safeguarding your account credentials',
                    'You must not share your account with any third party',
                    'You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account',
                    "You may not use another user's account without their express permission",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    >
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* User Content */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                  User Content
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Our service allows you to post, link, store, share and otherwise make available
                  certain information, text, graphics, photos, or other material
                  (&quot;Content&quot;). You are responsible for the Content that you post to the
                  service.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                  By posting Content to the service, you grant us the right and license to use,
                  modify, publicly perform, publicly display, reproduce, and distribute such Content
                  on and through the service.
                </p>
              </div>
            </div>
          </section>

          {/* Prohibited Uses */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                    Prohibited Uses
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                    You may use the service only for lawful purposes and in accordance with these
                    Terms. You agree not to:
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Use the service in any way that violates any applicable national or international law or regulation',
                      'Transmit any material that is unlawful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable',
                      'Impersonate or attempt to impersonate another user, person, or entity',
                      "Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the service",
                      'Use any robot, spider, or other automatic device to access the service for any purpose without our express written permission',
                      'Introduce any viruses, trojan horses, worms, or other malicious code',
                      'Attempt to gain unauthorized access to any portion of the service or any other systems or networks',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Sections */}
          <div className="space-y-4 mb-12">
            {[
              {
                title: 'Reviews and Ratings',
                icon: '⭐',
                content:
                  'Users may post reviews and ratings of campgrounds. All reviews must be based on genuine experiences, honest and not misleading, free from offensive language, and respect privacy and intellectual property rights. We reserve the right to remove any review that violates these guidelines.',
              },
              {
                title: 'Intellectual Property',
                icon: '©️',
                content:
                  'The service and its original content (excluding user-generated content), features and functionality are and will remain the exclusive property of CampFinder and its licensors. The service is protected by copyright, trademark, and other laws.',
              },
              {
                title: 'Termination',
                icon: '🚪',
                content:
                  'We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, for any reason including breach of the Terms. If you wish to terminate your account, you may discontinue using the service or contact us.',
              },
              {
                title: 'Limitation of Liability',
                icon: '⚖️',
                content:
                  'In no event shall CampFinder be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, or goodwill, resulting from your access to or use of the service.',
              },
              {
                title: 'Disclaimer',
                icon: '⚠️',
                content:
                  'Your use of the service is at your sole risk. The service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind. User-generated content represents the opinions of individual users and not of CampFinder.',
              },
            ].map((section, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{section.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                      {section.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Governing Law */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                    Governing Law & Changes
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    These Terms shall be governed and construed in accordance with the laws of the
                    United States, without regard to its conflict of law provisions.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    We reserve the right to modify or replace these Terms at any time. If a revision
                    is material, we will provide at least 30 days&apos; notice. By continuing to use
                    our service after revisions become effective, you agree to be bound by the
                    revised terms.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-10 text-center text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10 space-y-6">
                <div className="inline-block p-4 bg-white/20 backdrop-blur-md rounded-2xl">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <h2 className="text-3xl font-bold">Questions About Our Terms?</h2>

                <p className="text-lg text-white/90 max-w-2xl mx-auto">
                  If you have any questions about these Terms of Service, we&apos;re here to help.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    Visit Contact Page
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
