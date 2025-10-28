'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Gunakan path relative karena sudah ada proxy di next.config.js
const API_BASE_URL = ''

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    no_badge: '',
    department: '',
    username: ''
  })
  const [agree, setAgree] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarType, setSnackbarType] = useState('success')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const images = ['/bg_seatrium 3.png', '/smoe_images2.png', '/offshore.jpg']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [images.length])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const showMessage = (message, type = 'success') => {
    setSnackbarMessage(message)
    setSnackbarType(type)
    setShowSnackbar(true)
    setTimeout(() => {
      setShowSnackbar(false)
    }, 3000)
  }

  const testBackendConnection = async () => {
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.ok
    } catch (error) {
      console.error('Backend connection test failed:', error)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!agree) {
      showMessage('Please agree to the terms & policy', 'error')
      return
    }

    // Validasi form tambahan
    if (!formData.no_badge || !formData.department || !formData.username) {
      showMessage('Please fill all required fields', 'error')
      return
    }

    setIsLoading(true)

    try {
      // Test koneksi backend dulu
      const isBackendConnected = await testBackendConnection()
      if (!isBackendConnected) {
        showMessage('Backend server is not running. Please start the backend server.', 'error')
        setIsLoading(false)
        return
      }

      console.log('Sending registration data:', formData)

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          no_badge: formData.no_badge,
          department: formData.department,
          username: formData.username
        })
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Response data:', data)

      showMessage('Registration successful! Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (error) {
      console.error('Registration error:', error)
      showMessage(error.message || 'Registration failed. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // JSX tetap sama seperti sebelumnya
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

            {/* Form */}
            <form className="mt-3 space-y-4 sm:mt-4 sm:space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-3 sm:space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-2 py-2 sm:px-3 sm:py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Username *
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-2 py-2 sm:px-3 sm:py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Choose a username"
                  />
                </div>

                {/* Badge Number */}
                <div>
                  <label
                    htmlFor="no_badge"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Badge Number *
                  </label>
                  <input
                    id="no_badge"
                    name="no_badge"
                    type="text"
                    required
                    value={formData.no_badge}
                    onChange={handleChange}
                    className="w-full px-2 py-2 sm:px-3 sm:py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your badge number"
                  />
                </div>

                {/* Department */}
                <div>
                  <label
                    htmlFor="department"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Department *
                  </label>
                  <input
                    id="department"
                    name="department"
                    type="text"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-2 py-2 sm:px-3 sm:py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your department"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
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
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
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
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-md text-white transition ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isLoading ? 'Registering...' : 'Signup'}
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

      {/* Snackbar */}
      {showSnackbar && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-3 sm:p-4 rounded-lg z-50 transition-all duration-300 ease-out animate-fade-in-up ${
          snackbarType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {snackbarMessage}
        </div>
      )}
    </div>
  )
}