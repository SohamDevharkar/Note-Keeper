// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";
import { FaStickyNote } from "react-icons/fa";
import NotePadImage from '../assets/ed33a3cc-7df4-4ba8-9e65-993be9c814b3.jpg'

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-300 text-gray-800 dark:text-gray-100">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <FaStickyNote className="text-orange-500" />
          NoteKeeper
        </div>
        <div className="space-x-4">
          <Link to="/signin" className="text-gray-700 dark:text-gray-300 hover:underline">
            Sign In
          </Link>
          <Link to="/signup" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20 bg-gradient-to-br from-yellow-100 to-orange-200 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Take Notes <span className="text-orange-500">Effortlessly</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            NoteKeeper a offline first application that helps you jot down ideas, organize tasks, and stay productive.
            Simple. Fast. Sync across devices.
          </p>
          <Link to="/signup">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded shadow-lg transition">
              Create Your First Note
            </button>
          </Link>
        </div>
        <img
        //   src="https://cdn-icons-png.flaticon.com/512/3817/3817031.png"
        src = {NotePadImage}
          alt="notes illustration"
          className="w-64 md:w-96 mt-10 md:mt-0"
        />
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose NoteKeeper?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Easy to Use",
              desc: "Minimal, clean interface that just works. No learning curve.",
            },
            {
              title: "Organized",
              desc: "Tag, color-code, archive, and search notes quickly.",
            },
            {
              title: "Secure",
              desc: "Your notes stay private with secure authentication.",
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-gray-50 dark:bg-gray-800 rounded shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-orange-100 dark:bg-gray-800 py-12 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Capturing Your Ideas Now</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">Join thousands of users staying organized with NoteKeeper.</p>
        <Link to="/signup">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded shadow-lg transition">
            Get Started for Free
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} NoteKeeper. All rights reserved.
      </footer>
    </div>
  );
};
