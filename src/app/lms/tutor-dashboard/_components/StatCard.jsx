"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ title, value, subtitle, trend, icon: Icon, trendUp = true }) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            {trend && (
              <p className={`text-sm flex items-center ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {trendUp ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {trend}% from last month
              </p>
            )}
          </div>
          <div className="p-4 bg-blue-50 rounded-full">
            <Icon className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
