import React from 'react'
import Link from 'next/link'
import CategoryListPage from './category-list/page'

const categories = [
  {
    id: 'phylonthropic-foundation',
    slug: 'phylonthropic-foundation',
    name: 'Phylonthropic & Foundation Scholarship',
    description: [
      'Support for students from underrepresented communities.',
      'Covers tuition and learning materials for eligible candidates.',
      'Includes mentoring and career guidance sessions.',
    ],
  },
  {
    id: 'aggregator',
    slug: 'aggregator',
    name: 'Aggregator Scholarship',
    description: [
      'Merit-based awards for high-performing students.',
      'Shortlisted candidates may be asked for a portfolio or sample work.',
      'Provides monthly stipends during the study period.',
    ],
  },
  {
    id: 'csr',
    slug: 'csr',
    name: 'CSR Scholarship',
    description: [
      'Funded by corporate social responsibility initiatives.',
      'Focuses on community uplift and skill development.',
      'Priority for applicants from partner organizations or regions.',
    ],
  },
]

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 flex flex-col">
        <CategoryListPage categories={categories} />
      </div>
  )
}

export default Page
