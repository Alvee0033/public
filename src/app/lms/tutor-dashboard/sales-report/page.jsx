"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, Clock, TrendingUp, ChevronDown } from 'lucide-react';

const TutorSalesDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6');
  
  // Sample data
  const monthlyData = [
    { month: 'Jan', revenue: 2400, students: 15, hours: 45, completionRate: 92 },
    { month: 'Feb', revenue: 3200, students: 18, hours: 52, completionRate: 88 },
    { month: 'Mar', revenue: 2800, students: 16, hours: 48, completionRate: 95 },
    { month: 'Apr', revenue: 3600, students: 20, hours: 60, completionRate: 90 },
    { month: 'May', revenue: 4000, students: 22, hours: 65, completionRate: 93 },
    { month: 'Jun', revenue: 3800, students: 21, hours: 62, completionRate: 91 }
  ];

  // Subject distribution data
  const subjectData = [
    { name: 'Mathematics', value: 35 },
    { name: 'Science', value: 25 },
    { name: 'English', value: 20 },
    { name: 'History', value: 15 },
    { name: 'Other', value: 5 }
  ];

  const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#eab308', '#9333ea'];

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <Card className="h-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-xl sm:text-2xl font-bold">{value}</h3>
            {trend && (
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                +{trend}% from last month
              </p>
            )}
          </div>
          <div className="p-3 sm:p-4 bg-blue-50 rounded-full">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ChartCard = ({ title, children }) => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Sales Dashboard</h1>
        <div className="flex items-center gap-2">
          <select 
            className="p-2 border rounded-md text-sm sm:text-base bg-white"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="6">Last 6 months</option>
            <option value="3">Last 3 months</option>
            <option value="1">Last month</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${monthlyData[monthlyData.length-1].revenue}`}
          icon={DollarSign}
          trend="12"
        />
        <StatCard 
          title="Active Students" 
          value={monthlyData[monthlyData.length-1].students}
          icon={Users}
          trend="8"
        />
        <StatCard 
          title="Hours Taught" 
          value={monthlyData[monthlyData.length-1].hours}
          icon={Clock}
          trend="5"
        />
        <StatCard 
          title="Avg. Rate/Hr" 
          value={`$${Math.round(monthlyData[monthlyData.length-1].revenue / monthlyData[monthlyData.length-1].hours)}`}
          icon={TrendingUp}
          trend="3"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <ChartCard title="Revenue Trend">
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Subject Distribution */}
        <ChartCard title="Subject Distribution">
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {subjectData.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Teaching Hours */}
        <ChartCard title="Teaching Hours">
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Completion Rate */}
        <ChartCard title="Class Completion Rate">
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="completionRate" 
                  stroke="#dc2626" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default TutorSalesDashboard;