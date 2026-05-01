import React from 'react'
import CategoryCardS from '../_components/CategoryCard'

export default function CategoryListPage({ categories = [] }) {
  const hasCategories = Array.isArray(categories) && categories.length > 0

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold mb-16 justify-center text-center">Scholarship Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-20">
        {hasCategories ? (
          categories.map((category) => (
            <CategoryCardS key={category?.id ?? Math.random()} category={category} />
          ))
        ) : (
          <div className="col-span-full text-center text-muted">
            No categories available.
          </div>
        )}
      </div>
    </div>
  )
}