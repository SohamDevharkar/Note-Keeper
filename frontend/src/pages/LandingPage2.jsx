import { Link } from "react-router-dom";
import { Lock, Search, Tag, Zap, CheckCircle, Menu, X } from "lucide-react";
import { FaStickyNote } from "react-icons/fa";
import { SimpleStickyNote } from "../components/generated-components/SimpleStickyNote";
import { useState } from "react";

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-300 text-gray-800 dark:text-gray-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
              <FaStickyNote className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                NoteKeeper
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                How It Works
              </a>
              <Link to="/signin" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2 rounded-lg font-medium shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top">
              <a
                href="#features"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <Link
                to="/signin"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block mx-4 text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-lg font-medium shadow-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 dark:bg-orange-900/20 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-200 dark:bg-yellow-900/20 rounded-full blur-3xl opacity-60"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400 text-sm font-medium mx-auto lg:mx-0">
                <Zap className="w-4 h-4" />
                <span>Offline-first note taking</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Take Notes{" "}
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Effortlessly
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
                NoteKeeper is an offline-first application that helps you jot down ideas,
                organize tasks, and stay productive. Simple and User friendly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/signup">
                  <button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-semibold shadow-xl shadow-orange-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-105">
                    Create Your First Note
                  </button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">10k+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">50k+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Notes Created</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">99.9%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="flex justify-center lg:justify-end">
              <SimpleStickyNote />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                NoteKeeper?
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to capture ideas and stay organized, all in one place.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                desc: "Works offline-first with instant sync. No waiting, no lag, just pure productivity.",
                color: "orange",
              },
              {
                icon: <Tag className="w-8 h-8" />,
                title: "Organized",
                desc: "Tag, color-code, archive, and search notes quickly with powerful organization tools.",
                color: "yellow",
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "Secure & Private",
                desc: "Your notes stay private with secure authentication and encrypted storage.",
                color: "orange",
              },
              {
                icon: <Search className="w-8 h-8" />,
                title: "Powerful Search",
                desc: "Find any note instantly with our intelligent search that understands context.",
                color: "yellow",
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Easy to Use",
                desc: "Minimal, clean interface that just works. No learning curve, no complexity.",
                color: "orange",
              },
              {
                icon: <FaStickyNote className="w-8 h-8" />,
                title: "Rich Formatting",
                desc: "Format your notes with colors, tags, and organize them exactly how you want.",
                color: "yellow",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${
                  feature.color === "orange"
                    ? "from-orange-400 to-orange-600"
                    : "from-yellow-400 to-orange-500"
                } text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Get Started in{" "}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Start capturing your ideas in less than a minute
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Sign up in seconds with just your email. No credit card required.",
              },
              {
                step: "02",
                title: "Create Notes",
                desc: "Start writing immediately. Add tags, colors, and organize as you go.",
              },
              {
                step: "03",
                title: "Stay Synced",
                desc: "Access your notes from anywhere. Works offline, syncs when online.",
              },
            ].map((step, i) => (
              <div key={i} className="relative text-center md:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white text-2xl font-bold mb-6 shadow-lg shadow-orange-500/30">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.desc}
                </p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-6 w-12 h-0.5 bg-gradient-to-r from-orange-500 to-orange-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Start Capturing Your Ideas Now
          </h2>
          <p className="text-lg sm:text-xl mb-10 text-orange-50 max-w-2xl mx-auto">
            Join thousands of users staying organized with NoteKeeper.
            Free to start, no credit card required.
          </p>
          <Link to="/signup">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:bg-orange-50">
              Get Started for Free
            </button>
          </Link>
          <p className="mt-6 text-orange-100 text-sm">
            No credit card required • Free forever • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-xl font-bold text-white mb-4">
                <FaStickyNote className="w-6 h-6 text-orange-500" />
                NoteKeeper
              </div>
              <p className="text-sm text-gray-400">
                The simple, fast, and secure way to capture your ideas.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-orange-500 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-orange-500 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} NoteKeeper. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
