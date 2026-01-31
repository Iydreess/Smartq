'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { 
  Search, Filter, Star, Clock, DollarSign, User,
  Calendar, MapPin, Award, Heart, Eye, Plus,
  ChevronRight, Tag, Users, Zap, Shield, CheckCircle
} from 'lucide-react'

/**
 * Customer Services Page - Browse and book available services
 */
export default function CustomerServices() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  const services = [
    {
      id: 1,
      name: 'Strategy Consulting',
      category: 'Business Consulting',
      description: 'Comprehensive business strategy development and planning sessions to accelerate your growth',
      price: 300,
      duration: 90,
      rating: 4.9,
      reviews: 127,
      staff: ['James Wilson', 'Sarah Mitchell'],
      location: 'Conference Room A',
      tags: ['Popular', 'Premium', 'Expert'],
      features: ['Strategy Planning', 'Market Analysis', 'Growth Planning'],
      image: '/api/placeholder/300/200',
      availability: 'available',
      nextSlot: '2025-10-02 2:00 PM',
      isPopular: true,
      isRecommended: false
    },
    {
      id: 2,
      name: 'Cardiology Consultation',
      category: 'Healthcare',
      description: 'Expert cardiac evaluation and treatment planning with state-of-the-art equipment',
      price: 220,
      duration: 60,
      rating: 5.0,
      reviews: 89,
      staff: ['Dr. Emily Rodriguez', 'Dr. Michael Chen'],
      location: 'Medical Suite 2',
      tags: ['Medical', 'Specialist', 'Insurance'],
      features: ['ECG Testing', 'Heart Monitoring', 'Treatment Plans'],
      image: '/api/placeholder/300/200',
      availability: 'limited',
      nextSlot: '2025-10-03 10:30 AM',
      isPopular: false,
      isRecommended: true
    },
    {
      id: 3,
      name: 'Personal Training Session',
      category: 'Sports & Fitness',
      description: 'One-on-one fitness training and customized workout planning for all levels',
      price: 80,
      duration: 60,
      rating: 4.8,
      reviews: 203,
      staff: ['Alex Johnson', 'Lisa Martinez', 'Mike Thompson'],
      location: 'Gym Floor',
      tags: ['Fitness', 'Beginner Friendly', 'Group Available'],
      features: ['Custom Workouts', 'Nutrition Guidance', 'Progress Tracking'],
      image: '/api/placeholder/300/200',
      availability: 'available',
      nextSlot: '2025-10-02 6:00 AM',
      isPopular: true,
      isRecommended: false
    },
    {
      id: 4,
      name: 'Legal Consultation',
      category: 'Professional Services',
      description: 'Professional legal advice and consultation for business and personal matters',
      price: 250,
      duration: 60,
      rating: 4.8,
      reviews: 76,
      staff: ['David Wilson', 'Rachel Brown'],
      location: 'Law Office',
      tags: ['Legal', 'Confidential', 'Expert'],
      features: ['Legal Analysis', 'Document Review', 'Case Strategy'],
      image: '/api/placeholder/300/200',
      availability: 'available',
      nextSlot: '2025-10-04 1:00 PM',
      isPopular: false,
      isRecommended: true
    },
    {
      id: 5,
      name: 'Group Yoga Class',
      category: 'Sports & Fitness',
      description: 'Relaxing group yoga session for stress relief and flexibility improvement',
      price: 25,
      duration: 75,
      rating: 4.7,
      reviews: 145,
      staff: ['Sarah Williams', 'Emma Davis'],
      location: 'Studio B',
      tags: ['Group', 'Relaxation', 'All Levels'],
      features: ['Stress Relief', 'Flexibility', 'Mindfulness'],
      image: '/api/placeholder/300/200',
      availability: 'available',
      nextSlot: '2025-10-02 7:00 PM',
      isPopular: false,
      isRecommended: false
    },
    {
      id: 6,
      name: 'Tax Preparation',
      category: 'Professional Services',
      description: 'Complete tax filing and preparation services with expert guidance',
      price: 150,
      duration: 90,
      rating: 4.6,
      reviews: 94,
      staff: ['Robert Chang', 'Jennifer Lee'],
      location: 'Office 301',
      tags: ['Seasonal', 'Documents Required', 'Expert'],
      features: ['Tax Filing', 'Deduction Optimization', 'IRS Support'],
      image: '/api/placeholder/300/200',
      availability: 'seasonal',
      nextSlot: 'Available in Tax Season',
      isPopular: false,
      isRecommended: false
    }
  ]

  const categories = [
    { id: 'all', name: 'All Services', count: services.length },
    { id: 'Business Consulting', name: 'Business', count: services.filter(s => s.category === 'Business Consulting').length },
    { id: 'Healthcare', name: 'Healthcare', count: services.filter(s => s.category === 'Healthcare').length },
    { id: 'Sports & Fitness', name: 'Fitness', count: services.filter(s => s.category === 'Sports & Fitness').length },
    { id: 'Professional Services', name: 'Professional', count: services.filter(s => s.category === 'Professional Services').length }
  ]

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200'
      case 'limited': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'booked': return 'bg-red-100 text-red-800 border-red-200'
      case 'seasonal': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'popular': return b.reviews - a.reviews
      case 'rating': return b.rating - a.rating
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'duration': return a.duration - b.duration
      default: return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Services</h1>
          <p className="text-secondary-600">Discover and book our professional services</p>
        </div>
        <Link href="/customer/profile">
          <Button className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            My Favorites
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Shortest Duration</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-700 border border-secondary-300 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Featured Services */}
      {selectedCategory === 'all' && (
        <div>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Featured Services</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {services.filter(s => s.isPopular || s.isRecommended).slice(0, 2).map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-primary-500 to-blue-500"></div>
                  {service.isPopular && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-yellow-900 text-xs font-medium rounded-full">
                      🔥 Popular
                    </span>
                  )}
                  {service.isRecommended && (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      ⭐ Recommended
                    </span>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-secondary-900">{service.name}</h3>
                    <span className="text-xl font-bold text-primary-600">${service.price}</span>
                  </div>
                  <p className="text-secondary-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                  <div className="flex items-center gap-4 text-sm text-secondary-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span>{service.rating}</span>
                      <span>({service.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => alert(`Booking ${service.name}`)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedServices.map((service) => (
          <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200"></div>
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(service.availability)}`}>
                  {service.availability}
                </span>
              </div>
              {service.isPopular && (
                <span className="absolute top-3 right-3 px-2 py-1 bg-yellow-500 text-yellow-900 text-xs font-medium rounded-full">
                  🔥 Popular
                </span>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Service Header */}
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-1">{service.name}</h3>
                  <p className="text-xs text-secondary-500 uppercase tracking-wide">{service.category}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-secondary-600 line-clamp-2">{service.description}</p>

                {/* Pricing and Duration */}
                <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-600">${service.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600">{service.duration} min</span>
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{service.rating}</span>
                    </div>
                    <span className="text-sm text-secondary-500">({service.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-secondary-400" />
                    <span className="text-xs text-secondary-500">{service.staff.length} staff</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-secondary-700 uppercase tracking-wide">Includes</h4>
                  <div className="space-y-1">
                    {service.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-secondary-600">{feature}</span>
                      </div>
                    ))}
                    {service.features.length > 2 && (
                      <div className="text-xs text-secondary-500">+{service.features.length - 2} more features</div>
                    )}
                  </div>
                </div>

                {/* Next Available */}
                <div className="bg-blue-50 rounded p-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-blue-800">Next available: {service.nextSlot}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {service.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1" 
                    disabled={service.availability === 'seasonal'}
                    onClick={() => !service.availability === 'seasonal' && alert(`Booking ${service.name}`)}
                  >
                    {service.availability === 'seasonal' ? 'Seasonal' : 'Book Now'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="px-3"
                    onClick={() => alert(`View details for ${service.name}`)}
                    title="View details"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="px-3"
                    onClick={() => alert(`Added ${service.name} to favorites`)}
                    title="Add to favorites"
                  >
                    <Heart className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {sortedServices.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all') }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}