"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  Tag,
  Receipt,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { paymentHistory } from "./utils/payments";

export default function GuardianPaymentHistoryPage() {
  const [expandedCards, setExpandedCards] = useState(new Set([1]));

  const toggleCard = (id) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalSpent = paymentHistory.reduce(
    (sum, payment) => sum + payment.paidPrice,
    0
  );
  const totalSaved = paymentHistory.reduce(
    (sum, payment) => sum + payment.discountAmount,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* <div className="flex items-center gap-4 mb-6">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jAGh7VkywmQJanYH7xPYqDFy4iy0pH.png"
              alt="ScholarPASS Logo"
              className="h-10 w-auto"
            />
          </div> */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Payment History
              </h1>
              <p className="text-slate-600 mt-1">
                Track your course purchases and savings
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${totalSpent.toFixed(2)}
                </div>
                <div className="text-sm text-slate-600">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  ${totalSaved.toFixed(2)}
                </div>
                <div className="text-sm text-slate-600">Total Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Cards */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-4">
          {paymentHistory.map((payment) => (
            <Card
              key={payment.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader
                className="cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleCard(payment.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-slate-800 mb-2">
                      {payment.courseName}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>Instructor: {payment.instructor}</span>
                      <span>•</span>
                      <span>{formatDate(payment.paymentDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        ${payment.paidPrice.toFixed(2)}
                      </div>
                      {payment.discountAmount > 0 && (
                        <div className="text-sm text-slate-500 line-through">
                          ${payment.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                    {expandedCards.has(payment.id) ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {expandedCards.has(payment.id) && (
                <CardContent className="pt-0">
                  <Separator className="mb-6" />

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Payment Details */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-blue-600" />
                        Payment Details
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">
                            Transaction ID:
                          </span>
                          <span className="font-mono text-slate-800">
                            {payment.transactionId}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-600">
                            Payment Method:
                          </span>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-800">
                              {payment.paymentMethod}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-600">Payment Date:</span>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-800">
                              {formatDate(payment.paymentDate)}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-600">Status:</span>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-orange-600" />
                        Price Breakdown
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">
                            Original Price:
                          </span>
                          <span className="text-slate-800">
                            ${payment.originalPrice.toFixed(2)}
                          </span>
                        </div>

                        {payment.discountAmount > 0 && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-slate-600">
                                Discount Type:
                              </span>
                              <Badge
                                variant="outline"
                                className="border-orange-200 text-orange-700"
                              >
                                {payment.discountType}
                              </Badge>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-slate-600">
                                Discount Amount:
                              </span>
                              <span className="text-orange-600 font-medium">
                                -${payment.discountAmount.toFixed(2)} (
                                {payment.discountPercentage.toFixed(1)}%
                                scholarship)
                              </span>
                            </div>

                            <Separator />
                          </>
                        )}

                        <div className="flex justify-between font-semibold text-base">
                          <span className="text-slate-800">Final Amount:</span>
                          <span className="text-blue-600">
                            ${payment.paidPrice.toFixed(2)}
                          </span>
                        </div>

                        {payment.discountAmount > 0 && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
                            <div className="text-orange-800 text-sm font-medium">
                              🎉 You saved ${payment.discountAmount.toFixed(2)}{" "}
                              on this course!
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {paymentHistory.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg mb-2">
              No payment history found
            </div>
            <div className="text-slate-500">
              Your course purchases will appear here
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
