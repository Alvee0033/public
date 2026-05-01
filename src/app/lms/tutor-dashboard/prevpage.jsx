// 



"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle,
  Clock,
  DollarSign,
  GraduationCap,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAppSelector } from "@/redux/hooks";
import { useState, useEffect, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import axios from "axios";

// Constants
const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#eab308', '#9333ea'];
const REVENUE_DATA = [
  { month: "Jan", courses: 1200, mentorship: 800 },
  { month: "Feb", courses: 1500, mentorship: 900 },
  { month: "Mar", courses: 1700, mentorship: 1100 },
  { month: "Apr", courses: 1400, mentorship: 950 },
  { month: "May", courses: 1800, mentorship: 1200 },
  { month: "Jun", courses: 2000, mentorship: 1300 },
];
const TRENDS = {
  revenue: 12,
  students: 8,
  rating: 2,
  completion: 3
};

const StatCard = ({ title, value, subtitle, trend, icon: Icon, trendUp = true }) => (
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

const TutorSummaryDashboard = () => {
  const user = useAppSelector((state) => state.auth.user);

  const [activeTab] = useState("overview");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tutorId = user?.tutor_id;
        if (!tutorId) throw new Error("Tutor ID not found");

        const coursesRes = await axios.get(`/courses?filter=${encodeURIComponent(JSON.stringify({ primary_tutor: tutorId }))}`);
        // Always set courses as an array from the API response
        setCourses(Array.isArray(coursesRes.data?.data) ? coursesRes.data.data : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.tutor_id) {
      fetchData();
    }
  }, [user?.tutor_id]);

  // Memoized calculations to avoid recomputing on every render
  const { totalRevenue, totalStudents, avgRating, avgCompletion, totalCourses, totalCourseHours, courseStats } = useMemo(() => {

    const totalRev = courses.reduce((sum, c) => sum + (c.course_sales_revenue || 0), 0);
    const totalStuds = courses.reduce((sum, c) => sum + (c.enrolled_students || 0), 0);
    const avgRate = courses.length
      ? (courses.reduce((sum, c) => sum + (c.rating_score || 0), 0) / courses.length).toFixed(1)
      : 0;
    const avgComp = courses.length && courses[0].completion_rate !== undefined
      ? (courses.reduce((sum, c) => sum + (c.completion_rate || 0), 0) / courses.length).toFixed(0)
      : 0;

    return {
      totalRevenue: totalRev,
      totalStudents: totalStuds,
      avgRating: avgRate,
      avgCompletion: avgComp,
      totalCourses: courses.length,
      totalCourseHours: courses.reduce((sum, c) => sum + (parseFloat(c.course_duration) || 0), 0),
      courseStats: [
        { name: "Published", value: courses.filter(c => c.published_on_public_site).length },
        { name: "Draft", value: courses.filter(c => !c.published_on_public_site).length },
      ]
    };
  }, [courses]);

  const renderLoadingValue = (value) => loading ? "..." : value;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" defaultValue="overview">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Tutor Summary</h1>
          <p className="text-gray-500">Comprehensive overview of your tutoring business</p>
        </div>
      </div>

      <section value="overview" className="space-y-6 mt-0">
        <h2 className="text-xl font-semibold">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={renderLoadingValue(`$${totalRevenue.toLocaleString()}`)}
            subtitle="All time earnings"
            trend={TRENDS.revenue}
            icon={DollarSign}
          />
          <StatCard
            title="Total Students"
            value={renderLoadingValue(totalStudents)}
            subtitle="Across all courses"
            trend={TRENDS.students}
            icon={Users}
          />
          <StatCard
            title="Course Rating"
            value={renderLoadingValue(avgRating)}
            subtitle="Average rating"
            trend={TRENDS.rating}
            icon={Star}
          />
          <StatCard
            title="Completion Rate"
            value={renderLoadingValue(`${avgCompletion}%`)}
            subtitle="Course completion"
            trend={TRENDS.completion}
            trendUp={false}
            icon={CheckCircle}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Course vs Mentorship Revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="courses" name="Courses" stroke="#2563eb" strokeWidth={2} />
                  <Line type="monotone" dataKey="mentorship" name="Mentorship" stroke="#16a34a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <section value="financial" className="space-y-6 mt-0">


        {/* ---------------- financial ----------------  */}
        {/* <h2 className="text-xl font-semibold">Financial</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending Payout"
            value="$3,240"
            subtitle="Processing time: 3-5 days"
            icon={DollarSign}
          />
          <StatCard
            title="Last Payout"
            value="$2,800"
            subtitle="Processed on Jun 15"
            icon={Activity}
          />
          <StatCard
            title="Payment Success"
            value="98%"
            subtitle="Transaction success rate"
            icon={CheckCircle}
          />
          <StatCard
            title="Refund Rate"
            value="0.8%"
            subtitle="Last 30 days"
            icon={AlertCircle}
          />
        </div> */}

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-50 rounded-full">
                                            <DollarSign className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Course Payment</p>
                                            <p className="text-sm text-gray-500">Jun {15 - i}, 2024</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">+$850.00</p>
                                </div>
                            ))} */}

              <h2 className="text-center text-gray-500 ">No transactions yet</h2>
            </div>
          </CardContent>
        </Card>
      </section>

      <section value="courses" className="space-y-6 mt-0">
        <h2 className="text-xl font-semibold">Course Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Courses"
            value={renderLoadingValue(totalCourses)}
            subtitle="Published courses"
            icon={BookOpen}
          />
          <StatCard
            title="Active Students"
            value={renderLoadingValue(totalStudents)}
            subtitle="Currently enrolled"
            icon={GraduationCap}
          />
          <StatCard
            title="Course Hours"
            value={renderLoadingValue(totalCourseHours)}
            subtitle="Total content hours"
            icon={Clock}
          />
          <StatCard
            title="Avg. Completion"
            value={renderLoadingValue(`${avgCompletion}%`)}
            subtitle="Course completion rate"
            icon={TrendingUp}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Status</CardTitle>
            </CardHeader>
            {loading ? (
              <div className="h-[300px] flex justify-center items-center">
                <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : courseStats.length === 0 ? (
              // No data message when courseStats is empty
              <div className="h-[300px] flex justify-center items-center">
                <h2 className="text-center text-gray-500">No records found</h2>
              </div>
            ) : (
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={courseStats}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {courseStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {courseStats.map((entry, index) => (
                      <div key={entry.name} className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm">{entry.name}: {entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent >
            )}
          </Card >


          <Card>
            <CardHeader>
              <CardTitle>Student Enrollment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="courses" name="New Enrollments" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div >
      </section >
    </div >
  );
};

export default TutorSummaryDashboard;