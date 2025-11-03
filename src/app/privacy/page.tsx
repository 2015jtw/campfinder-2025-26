import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | CampFinder',
  description: 'Learn how CampFinder collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Your Privacy Matters
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              Privacy Policy
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              How we collect, use, and protect your personal information
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
          {/* Introduction */}
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                  Introduction
                </h2>
                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Welcome to CampFinder. We respect your privacy and are committed to protecting
                    your personal data. This privacy policy will inform you about how we look after
                    your personal data when you visit our website and tell you about your privacy
                    rights and how the law protects you.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Information We Collect */}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                  Information We Collect
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                  We may collect, use, store and transfer different kinds of personal data about
                  you:
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Identity Data',
                      desc: 'includes first name, last name, username or similar identifier',
                      icon: '👤',
                    },
                    {
                      title: 'Contact Data',
                      desc: 'includes email address',
                      icon: '📧',
                    },
                    {
                      title: 'Profile Data',
                      desc: 'includes your username, profile picture, preferences, feedback and survey responses',
                      icon: '⚙️',
                    },
                    {
                      title: 'Usage Data',
                      desc: 'includes information about how you use our website, products and services',
                      icon: '📊',
                    },
                    {
                      title: 'Technical Data',
                      desc: 'includes internet protocol (IP) address, browser type and version, time zone setting and location',
                      icon: '💻',
                    },
                    {
                      title: 'Marketing and Communications Data',
                      desc: 'includes your preferences in receiving marketing from us',
                      icon: '📢',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
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
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                  We will only use your personal data when the law allows us to. Most commonly, we
                  will use your personal data in the following circumstances:
                </p>
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                  <ul className="space-y-3">
                    {[
                      'To register you as a new user',
                      'To provide and maintain our service',
                      'To manage your account and provide customer support',
                      'To send you important information regarding the service',
                      'To improve and personalize your experience',
                      'To analyze usage and trends to improve our service',
                      'To send you marketing communications (only with your consent where required by law)',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
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

          {/* Data Security */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                    Data Security
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    We have put in place appropriate security measures to prevent your personal data
                    from being accidentally lost, used or accessed in an unauthorized way, altered
                    or disclosed. In addition, we limit access to your personal data to those
                    employees, agents, contractors and other third parties who have a business need
                    to know.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Sections in Accordion Style */}
          <div className="space-y-4 mb-12">
            {[
              {
                title: 'Cookies',
                icon: '🍪',
                color: 'orange',
                content:
                  'Our website uses cookies to distinguish you from other users. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. A cookie is a small file of letters and numbers that we store on your browser or the hard drive of your computer if you agree.',
              },
              {
                title: 'Third-Party Services',
                icon: '🔗',
                color: 'indigo',
                content:
                  'We may use third-party service providers to help us operate our service and administer activities on our behalf. These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.',
              },
              {
                title: 'Data Retention',
                icon: '⏱️',
                color: 'teal',
                content:
                  'We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.',
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

          {/* Your Legal Rights */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
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
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                    Your Legal Rights
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                    Under certain circumstances, you have rights under data protection laws in
                    relation to your personal data, including the right to:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      'Request access to your personal data',
                      'Request correction of your personal data',
                      'Request erasure of your personal data',
                      'Object to processing of your personal data',
                      'Request restriction of processing',
                      'Request transfer of your personal data',
                      'Withdraw consent at any time',
                    ].map((right, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-white dark:bg-slate-800/50 rounded-lg p-4"
                      >
                        <svg
                          className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-slate-700 dark:text-slate-300">{right}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <div className="bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl p-10 text-center text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-300 rounded-full blur-3xl"></div>
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

                <h2 className="text-3xl font-bold">Have Questions?</h2>

                <p className="text-lg text-white/90 max-w-2xl mx-auto">
                  If you have any questions about this Privacy Policy, we&apos;re here to help.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <a
                    href="mailto:privacy@campfinder.com"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    privacy@campfinder.com
                  </a>

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
