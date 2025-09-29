import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui'
import { Check, X, Star, Crown, Zap, Shield } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      icon: Zap,
      description: 'Perfect for small businesses just getting started',
      price: '$29',
      period: '/month',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'from-primary-50 to-primary-100',
      features: [
        { name: 'Up to 100 customers/day', included: true },
        { name: 'Basic queue management', included: true },
        { name: 'SMS notifications', included: true },
        { name: 'Email support', included: true },
        { name: 'Mobile app access', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Multi-location support', included: false },
        { name: 'API access', included: false },
        { name: 'Priority support', included: false }
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      icon: Star,
      description: 'Ideal for growing businesses with multiple services',
      price: '$79',
      period: '/month',
      color: 'from-accent-500 to-luxury-600',
      bgColor: 'from-accent-50 to-luxury-100',
      features: [
        { name: 'Up to 500 customers/day', included: true },
        { name: 'Advanced queue management', included: true },
        { name: 'SMS & Email notifications', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Mobile & web app access', included: true },
        { name: 'Advanced analytics & reporting', included: true },
        { name: 'Appointment booking system', included: true },
        { name: 'Up to 3 locations', included: true },
        { name: 'Basic API access', included: true },
        { name: 'Phone support', included: false }
      ],
      popular: true,
      cta: 'Most Popular'
    },
    {
      name: 'Enterprise',
      icon: Crown,
      description: 'For large organizations with complex needs',
      price: 'Custom',
      period: '',
      color: 'from-luxury-500 to-warning-600',
      bgColor: 'from-luxury-50 to-warning-100',
      features: [
        { name: 'Unlimited customers', included: true },
        { name: 'Enterprise queue management', included: true },
        { name: 'All notification channels', included: true },
        { name: '24/7 dedicated support', included: true },
        { name: 'White-label solutions', included: true },
        { name: 'Custom analytics & dashboards', included: true },
        { name: 'Full appointment ecosystem', included: true },
        { name: 'Unlimited locations', included: true },
        { name: 'Full API access & webhooks', included: true },
        { name: 'Custom integrations', included: true }
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ]

  const addOns = [
    {
      name: 'Premium Analytics',
      price: '$19/month',
      description: 'Advanced reporting, custom dashboards, and business intelligence tools'
    },
    {
      name: 'White-Label Branding',
      price: '$49/month', 
      description: 'Remove Smartq branding and use your own logo and colors'
    },
    {
      name: 'API & Webhooks',
      price: '$29/month',
      description: 'Full API access with real-time webhooks for custom integrations'
    },
    {
      name: 'Priority Support',
      price: '$39/month',
      description: '24/7 phone support with dedicated account manager'
    }
  ]

  const faqs = [
    {
      question: 'Can I change plans at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and you\'ll be billed pro-rata for any differences.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'We offer a 14-day free trial for all plans. No credit card required, and you can cancel anytime during the trial period.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions.'
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Save up to 20% when you pay annually. The discount is automatically applied at checkout when you select annual billing.'
    },
    {
      question: 'What happens if I exceed my plan limits?',
      answer: 'We\'ll notify you when you approach your limits. You can upgrade your plan or purchase additional capacity as needed.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade security with end-to-end encryption, regular security audits, and GDPR compliance.'
    }
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-primary-50 to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Simple, Transparent
              <span className="block bg-gradient-to-r from-primary-600 via-accent-600 to-luxury-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              Choose the perfect plan for your business. Start with a 14-day free trial, 
              no credit card required. Scale as you grow.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <span className="text-secondary-700 mr-3">Monthly</span>
              <button className="relative w-12 h-6 bg-secondary-200 rounded-full transition-colors">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
              <span className="text-secondary-700 ml-3">
                Annual 
                <span className="ml-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                  Save 20%
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon
              return (
                <div 
                  key={index}
                  className={`relative rounded-2xl border-2 transition-all duration-300 hover:shadow-strong ${
                    plan.popular 
                      ? 'border-primary-500 shadow-strong scale-105' 
                      : 'border-secondary-200 shadow-soft hover:-translate-y-1'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className={`p-8 rounded-t-2xl bg-gradient-to-br ${plan.bgColor}`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                      {plan.name}
                    </h3>
                    
                    <p className="text-secondary-600 mb-6">
                      {plan.description}
                    </p>
                    
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold text-secondary-900">{plan.price}</span>
                      <span className="text-secondary-600 ml-1">{plan.period}</span>
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white' 
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                  
                  <div className="p-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-secondary-400 mr-3 flex-shrink-0" />
                          )}
                          <span className={feature.included ? 'text-secondary-900' : 'text-secondary-500'}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Optional Add-ons
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Enhance your plan with additional features and services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addOns.map((addon, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-soft border border-secondary-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {addon.name}
                  </h3>
                  <span className="text-primary-600 font-bold">
                    {addon.price}
                  </span>
                </div>
                <p className="text-secondary-600">
                  {addon.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-secondary-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-secondary-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-secondary-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-accent-600 to-luxury-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Start your free 14-day trial today. No credit card required, cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-primary-50">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-700">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}