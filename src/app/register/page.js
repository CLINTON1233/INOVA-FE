'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const router = useRouter()

    const images = ['/bg_seatrium 3.png', '/smoe_images2.png', '/offshore.jpg']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [images.length])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Register attempt:', { name, email, password, agree })

    setShowSnackbar(true)
    setTimeout(() => {
      setShowSnackbar(false)
      // router.push('/login') // Saya biarkan ini ter-komentar dulu agar Anda bisa melihat snackbar
    }, 3000)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Logo pojok kiri atas */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
        <Image
          src="/seatrium.png"
          alt="Seatrium Logo"
          width={150}
          height={150}
          className="object-contain"
          priority
        />
      </div>

      {/* Carousel - mobile (atas) & desktop (kanan) */}
      <div className="relative w-full h-64 lg:h-auto lg:flex-1 overflow-hidden order-1 lg:order-2">
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt={`Carousel ${index}`}
            fill
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
            priority={index === 0}
          />
        ))}

        {/* Overlay gradient mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent lg:hidden" />

        {/* Indicator dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentImage ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Register Form */}
      <div className="flex-1 flex flex-col justify-between bg-white order-2 lg:order-1">
        <div className="flex items-start lg:items-center justify-center px-10 sm:px-12 lg:px-8 pt-6 pb-8 lg:py-0 flex-grow">
          <div className="w-full max-w-md space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                Get Started Now!
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm">
                Create your account to access the system
              </p>
            </div>

            {/* Form — margin atas dikurangi */}
            <form className="mt-3 space-y-4 sm:mt-4 sm:space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-3 sm:space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    // Fokus Ring (bukan shadow) tetap dipertahankan untuk usability
                    className="w-full px-2 py-2 sm:px-3 sm:py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // Fokus Ring (bukan shadow) tetap dipertahankan untuk usability
                    className="w-full px-2 py-2 sm:px-3 sm:py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // Fokus Ring (bukan shadow) tetap dipertahankan untuk usability
                    className="w-full px-2 py-2 sm:px-3 sm:py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Terms & Policy */}
              <div className="flex items-start sm:items-center">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 sm:mt-0"
                />
                <label htmlFor="agree" className="ml-2 block text-xs sm:text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    terms & policy
                  </a>
                </label>
              </div>

              {/* Signup Button */}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                >
                  Signup
                </button>
              </div>

              {/* Already have account */}
              <div className="text-center">
                <span className="text-gray-600 text-sm">
                  Have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign in
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-4 text-gray-500 text-sm border-t">
          IT Inventory System 2025 Created by Clinton Alfaro
        </footer>
      </div>

      {/* Snackbar (Telah dihilangkan shadownya) */}
      {showSnackbar && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-3 sm:p-4 bg-green-500 text-white rounded-lg z-50 transition-all duration-300 ease-out animate-fade-in-up">
          Registration successful! Redirecting to login...
        </div>
      )}
    </div>
  )
}