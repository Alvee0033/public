import { Info } from 'lucide-react'
import React from 'react'

export default function InfoCard({children}) {
  return (
    <div className="flex gap-2 items-center text-xs text-orange-500 border border-gray-100 rounded p-2"><Info className="size-4" />{children}</div>
  )
}
