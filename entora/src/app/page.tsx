import Link from "next/link";
import {
  GraduationCap,
  Users,
  School,
  BookOpen,
  Map,
  Search,
  MessageSquare,
  ArrowRight,
  Star,
  CheckCircle,
  Globe,
} from "lucide-react";

const stakeholders = [
  {
    label: "Students",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    description: "Free community, roadmap, school explorer, and resource library",
    href: "/community",
    cta: "Join the community",
  },
  {
    label: "Parents",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    description: "Track your child's progress and find affordable expert guidance",
    href: "/parents",
    cta: "Learn more",
  },
  {
    label: "Schools",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    description: "Free counselor tools and classroom resources for under-served schools",
    href: "/counselor",
    cta: "Counselor portal",
  },
];

const features = [
  {
    icon: MessageSquare,
    title: "Community Forum",
    description:
      "Open Q&A threads on essays, financial aid, international admissions, and more. Real answers from students who've been there.",
    href: "/community",
    color: "text-indigo-600",
  },
  {
    icon: Map,
    title: "Grade-by-Grade Roadmap",
    description:
      "Interactive timeline from grade 9-12 with milestone checklists. Know exactly what to do and when, localized for your country.",
    href: "/roadmap",
    color: "text-teal-600",
  },
  {
    icon: Search,
    title: "School Explorer",
    description:
      "Search and compare universities by acceptance rate, cost, location, and programs. Every school page shows community threads and guides who attend.",
    href: "/schools",
    color: "text-purple-600",
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description:
      'Free essay examples, financial aid checklists, visa guides, and \"how I got in\" stories from current students.',
    href: "/resources",
    color: "text-amber-600",
  },
];

const layers = [
  {
    label: "Free layer",
    color: "bg-indigo-600",
    description: "Community + resources + roadmap \u2014 all students, parents, schools",
  },
  {
    label: "Paid product",
    color: "bg-teal-600",
    description: "1-on-1 sessions, specialist bookings, AI tools \u2014 $35\u2013150/session",
  },
  {
    label: "B2B layer",
    color: "bg-amber-700",
    description: "University partnerships, analytics, branded profiles \u2014 SaaS pricing",
  },
];

const stats = [
  { value: "70+", label: "Universities indexed" },
  { value: "4", label: "Countries supported" },
  { value: "100%", label: "Free core features" },
  { value: "9-12", label: "Grades covered" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300">
                <Globe className="h-3.5 w-3.5 mr-1.5" />
                US &middot; UK &middot; India &middot; Nigeria
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
              Your complete college admissions{" "}
              <span className="text-indigo-600 dark:text-indigo-400">companion</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
              Free community, grade-by-grade roadmap, school explorer, and expert
              sessions. Everything you need \u2014 from first research to acceptance letter.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/community"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Browse community
              </Link>
            </div>
          </div>
        </div>
        {/* Gradient decoration */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-100 dark:bg-indigo-900/20 blur-3xl opacity-50" />
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform layers */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Three layers, one platform
            </h2>
            <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Every layer feeds the next \u2014 free users become paid users, paid
              users generate data that powers partnerships, and partnerships drive
              more free users.
            </p>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {layers.map((layer, i) => (
              <div key={layer.label} className="flex items-center gap-4">
                <span className="text-sm text-gray-400 dark:text-gray-500 w-24 text-right shrink-0">
                  {layer.label}
                </span>
                <div
                  className={`${layer.color} text-white rounded-xl px-5 py-3 text-sm font-medium flex-1`}
                  style={{ maxWidth: `${100 - i * 15}%` }}
                >
                  {layer.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free features */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-300 mb-4">
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              100% free
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Everything you need to get started
            </h2>
            <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              No paywall. No trial. The free layer is genuinely useful on its own \u2014
              not a teaser.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
              >
                <feature.icon className={`h-8 w-8 ${feature.color} mb-4`} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholders */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Built for everyone in the journey
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {stakeholders.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="group p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
              >
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mb-4 ${s.color}`}
                >
                  {s.label}
                </span>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {s.description}
                </p>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline inline-flex items-center gap-1">
                  {s.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              What students say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "The roadmap told me exactly when to start SAT prep. I would have missed the deadline without it.",
                name: "Priya K.",
                detail: "Grade 11, Mumbai",
              },
              {
                quote:
                  "Being able to compare schools by acceptance rate AND cost in one place saved me weeks of research.",
                name: "Marcus T.",
                detail: "Grade 12, Atlanta",
              },
              {
                quote:
                  "The community answered my financial aid question in 2 hours. My counselor took 2 weeks.",
                name: "Amara O.",
                detail: "Grade 11, Lagos",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-6 rounded-xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {testimonial.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {testimonial.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="h-12 w-12 text-indigo-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Start your college journey today
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of students using Entora&apos;s free tools to navigate
            college admissions with confidence.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Get started free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
