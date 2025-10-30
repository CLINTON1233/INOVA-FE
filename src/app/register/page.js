'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

// URL backend - sesuaikan dengan environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!agree) {
      Swal.fire({
        title: 'Agreement Required',
        text: 'Please agree to the terms & policy before proceeding.',
        icon: 'warning',
        iconColor: '#fa4315ff',
        confirmButtonColor: '#28a745',
        confirmButtonText: 'OK',
        background: '#ffffff',
        color: '#333333',
        customClass: {
          popup: 'rounded-xl font-poppins',
          confirmButton: 'px-6 py-2 rounded-lg font-medium'
        }
      })
      return
    }

    setIsLoading(true)

    try {
      // Show loading
      Swal.fire({
        title: 'Registering...',
        text: 'Please wait while we create your account.',
        icon: 'info',
        iconColor: '#2794ecff',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      // Kirim request ke backend
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Success
        Swal.fire({
          title: 'Registration Successful!',
          text: 'Your account has been successfully created.',
          icon: 'success',
          iconColor: '#28a745',
          confirmButtonColor: '#28a745',
          confirmButtonText: 'Go to Login',
          background: '#ffffff',
          color: '#333333',
          customClass: {
            popup: 'rounded-xl font-poppins',
            confirmButton: 'px-6 py-2 rounded-lg font-medium'
          }
        }).then(() => {
          router.push('/login')
        })
      } else {
        // Error dari backend
        throw new Error(result.message || 'Registration failed')
      }

    } catch (error) {
      console.error('Registration error:', error)
      
      let errorMessage = 'Registration failed. Please try again.'
      
      if (error.message.includes('already exists')) {
        errorMessage = error.message
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.'
      } else if (error.message.includes('Password must be')) {
        errorMessage = 'Password must be at least 6 characters long.'
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please check your connection.'
      }

      Swal.fire({
        title: 'Registration Failed',
        text: errorMessage,
        icon: 'error',
        iconColor: '#dc3545',
        confirmButtonColor: '#28a745',
        confirmButtonText: 'OK',
        background: '#ffffff',
        color: '#333333',
        customClass: {
          popup: 'rounded-xl font-poppins',
          confirmButton: 'px-6 py-2 rounded-lg font-medium'
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ... (rest of your JSX remains the same)
  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Logo */}
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

      {/* Carousel */}
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
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                Get Started Now!
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm">
                Create your account to access the system
              </p>
            </div>

            <form className="mt-3 space-y-4 sm:mt-4 sm:space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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

                         <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Email address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-2 py-2 sm:px-3 sm:py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>


                <div>
                  <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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

                <div>
                  <label htmlFor="no_badge" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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

                <div>
                  <label htmlFor="department" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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

                <div>
                  <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-2 py-2 sm:px-3 sm:py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password (min. 6 characters)"
                    minLength={6}
                  />
                </div>
              </div>

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

        <footer className="text-center py-4 text-gray-500 text-sm border-t">
          IT Inventory System 2025 Created by Clinton Alfaro
        </footer>
      </div>
    </div>
  )
}