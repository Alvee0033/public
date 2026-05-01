"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Printer, CreditCard, Calendar, User, GraduationCap, BookOpen, Eye } from 'lucide-react'

export default function CoursesWithInvoicesPage() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const coursesData = [
    {
      id: 1,
      courseName: "Advanced Mathematics - Calculus",
      instructor: "Dr. Sarah Johnson",
      duration: "3 months",
      totalSessions: 12,
      status: "active",
      invoice: {
        invoiceNumber: "INV-2024-001234",
        issueDate: "2024-01-15",
        dueDate: "2024-01-30",
        status: "paid",
        tutor: {
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@tutorsplan.com",
          phone: "+1 (555) 123-4567",
          address: "123 Education St, Learning City, LC 12345",
        },
        student: {
          name: "Alex Thompson",
          email: "alex.thompson@email.com",
          phone: "+1 (555) 987-6543",
          address: "456 Student Ave, Study Town, ST 67890",
        },
        sessions: [
          {
            id: 1,
            subject: "Advanced Mathematics",
            date: "2024-01-08",
            duration: "2 hours",
            rate: 75,
            total: 150,
          },
          {
            id: 2,
            subject: "Calculus - Derivatives",
            date: "2024-01-10",
            duration: "1.5 hours",
            rate: 75,
            total: 112.5,
          },
          {
            id: 3,
            subject: "Calculus - Integrals",
            date: "2024-01-12",
            duration: "2 hours",
            rate: 75,
            total: 150,
          },
        ],
        subtotal: 412.5,
        platformFee: 20.63,
        tax: 34.65,
        total: 467.78,
      },
    },
    {
      id: 2,
      courseName: "Physics - Quantum Mechanics",
      instructor: "Prof. Michael Chen",
      duration: "2 months",
      totalSessions: 8,
      status: "completed",
      invoice: {
        invoiceNumber: "INV-2024-001235",
        issueDate: "2024-01-20",
        dueDate: "2024-02-05",
        status: "pending",
        tutor: {
          name: "Prof. Michael Chen",
          email: "michael.chen@tutorsplan.com",
          phone: "+1 (555) 234-5678",
          address: "456 Science Ave, Physics City, PC 23456",
        },
        student: {
          name: "Alex Thompson",
          email: "alex.thompson@email.com",
          phone: "+1 (555) 987-6543",
          address: "456 Student Ave, Study Town, ST 67890",
        },
        sessions: [
          {
            id: 1,
            subject: "Quantum Mechanics Basics",
            date: "2024-01-15",
            duration: "2 hours",
            rate: 80,
            total: 160,
          },
          {
            id: 2,
            subject: "Wave Functions",
            date: "2024-01-17",
            duration: "1.5 hours",
            rate: 80,
            total: 120,
          },
        ],
        subtotal: 280,
        platformFee: 14,
        tax: 23.52,
        total: 317.52,
      },
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCourseStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewInvoice = (course) => {
    setSelectedCourse(course)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Manage your enrolled courses and view invoices</p>
        </div>

        <div className="grid gap-6">
          {coursesData.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">{course.courseName}</CardTitle>
                      <p className="text-gray-600 mt-1">Instructor: {course.instructor}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Duration: {course.duration}</span>
                        <span>Sessions: {course.totalSessions}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getCourseStatusColor(course.status)}>
                      {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </Badge>
                    <Dialog
                      open={isModalOpen && selectedCourse?.id === course.id}
                      onOpenChange={(open) => {
                        setIsModalOpen(open)
                        if (!open) setSelectedCourse(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => handleViewInvoice(course)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Invoices
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Invoice - {course.courseName}</DialogTitle>
                        </DialogHeader>

                        {selectedCourse && (
                          <div className="mt-4">
                            {/* Invoice Header Actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                              <div>
                                <h2 className="text-2xl font-bold text-gray-900">Invoice</h2>
                                <p className="text-gray-600 mt-1">Invoice #{selectedCourse.invoice.invoiceNumber}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Download className="w-4 h-4 mr-2" />
                                  Download PDF
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Printer className="w-4 h-4 mr-2" />
                                  Print
                                </Button>
                                {selectedCourse.invoice.status !== "paid" && (
                                  <Button size="sm">
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Pay Now
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Company Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                              <div>
                                <h3 className="text-2xl font-bold text-blue-600 mb-2">ScholarPASS</h3>
                                <p className="text-gray-600">Premium Tutoring Services</p>
                                <p className="text-sm text-gray-500 mt-2">
                                  789 Education Boulevard
                                  <br />
                                  Learning District, LD 54321
                                  <br />
                                  contact@tutorsplan.com
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge className={getStatusColor(selectedCourse.invoice.status)}>
                                  {selectedCourse.invoice.status.toUpperCase()}
                                </Badge>
                                <div className="mt-4 space-y-1 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">Issue Date:</span>
                                    <span className="font-medium">{selectedCourse.invoice.issueDate}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">Due Date:</span>
                                    <span className="font-medium">{selectedCourse.invoice.dueDate}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Billing Information */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <GraduationCap className="w-5 h-5 text-blue-600" />
                                  <h4 className="font-semibold text-gray-900">Tutor Information</h4>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <p className="font-medium text-gray-900">{selectedCourse.invoice.tutor.name}</p>
                                  <p className="text-sm text-gray-600 mt-1">{selectedCourse.invoice.tutor.email}</p>
                                  <p className="text-sm text-gray-600">{selectedCourse.invoice.tutor.phone}</p>
                                  <p className="text-sm text-gray-600 mt-2">{selectedCourse.invoice.tutor.address}</p>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <User className="w-5 h-5 text-green-600" />
                                  <h4 className="font-semibold text-gray-900">Student Information</h4>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <p className="font-medium text-gray-900">{selectedCourse.invoice.student.name}</p>
                                  <p className="text-sm text-gray-600 mt-1">{selectedCourse.invoice.student.email}</p>
                                  <p className="text-sm text-gray-600">{selectedCourse.invoice.student.phone}</p>
                                  <p className="text-sm text-gray-600 mt-2">{selectedCourse.invoice.student.address}</p>
                                </div>
                              </div>
                            </div>

                            {/* Sessions Table */}
                            <div className="mb-6">
                              <h4 className="font-semibold text-gray-900 mb-4">Tutoring Sessions</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      <th className="text-left py-3 px-2 font-medium text-gray-700">Subject</th>
                                      <th className="text-left py-3 px-2 font-medium text-gray-700">Date</th>
                                      <th className="text-left py-3 px-2 font-medium text-gray-700">Duration</th>
                                      <th className="text-right py-3 px-2 font-medium text-gray-700">Rate/Hour</th>
                                      <th className="text-right py-3 px-2 font-medium text-gray-700">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedCourse.invoice.sessions.map((session) => (
                                      <tr key={session.id} className="border-b border-gray-100">
                                        <td className="py-3 px-2 text-gray-900">{session.subject}</td>
                                        <td className="py-3 px-2 text-gray-600">{session.date}</td>
                                        <td className="py-3 px-2 text-gray-600">{session.duration}</td>
                                        <td className="py-3 px-2 text-right text-gray-600">${session.rate}</td>
                                        <td className="py-3 px-2 text-right font-medium text-gray-900">
                                          ${session.total}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Payment Summary */}
                            <div className="flex justify-end mb-6">
                              <div className="w-full max-w-sm space-y-3">
                                <div className="flex justify-between text-gray-600">
                                  <span>Subtotal:</span>
                                  <span>${selectedCourse.invoice.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                  <span>Platform Fee (5%):</span>
                                  <span>${selectedCourse.invoice.platformFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                  <span>Tax (8.4%):</span>
                                  <span>${selectedCourse.invoice.tax.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-semibold text-gray-900">
                                  <span>Total Amount:</span>
                                  <span>${selectedCourse.invoice.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Payment Status */}
                            {selectedCourse.invoice.status === "paid" && (
                              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-green-800 font-medium">Payment Completed</span>
                                </div>
                                <p className="text-green-700 text-sm mt-1">
                                  This invoice has been paid in full. Thank you for using ScholarPASS!
                                </p>
                              </div>
                            )}

                            {selectedCourse.invoice.status === "overdue" && (
                              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <span className="text-red-800 font-medium">Payment Overdue</span>
                                </div>
                                <p className="text-red-700 text-sm mt-1">
                                  This invoice is past due. Please make payment as soon as possible.
                                </p>
                              </div>
                            )}

                            {/* Footer */}
                            <div className="pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                              <p>Thank you for choosing ScholarPASS for your educational needs.</p>
                              <p className="mt-1">
                                For questions about this invoice, contact us at billing@tutorsplan.com
                              </p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}