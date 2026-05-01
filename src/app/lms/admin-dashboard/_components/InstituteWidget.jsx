import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const InstituteWidget = ({ data = [] }) => {
  const institutes = Array.isArray(data) ? data : []

  return (
    <Card className="w-full bg-gradient-to-tr from-white to-blue-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Institutes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-md p-2 max-h-48 overflow-auto">
            {institutes.length === 0 ? (
              <div className="text-sm text-muted-foreground px-2">No institutes found</div>
            ) : (
              <ul className="divide-y">
                {institutes.map((i) => (
                  <li key={i._id || i.id} className="px-2 py-2">
                    <div className="flex items-center gap-2 font-medium text-sm">
                      {i.logo ? (
                        <img src={i.logo} alt={i.name || 'Institute Logo'} className="h-10 w-10 object-contain rounded" />
                      ) : (
                        <span className="h-10 w-10 flex items-center justify-center bg-gray-200 rounded"></span>
                      )}
                      <span>{i.name || `${i.trade_name || ''} ${i.last_name || ''}`.trim() || '—'}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Institute Email: {i.email || i.user?.email || '—'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Address: {i.full_address || i.user?.full_address || '—'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InstituteWidget