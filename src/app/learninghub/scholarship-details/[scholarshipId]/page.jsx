"use client"

import React from 'react'
import axios from '@/lib/axios'
import useSWR from 'swr'
import { useParams, useRouter } from 'next/navigation'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  CalendarClock,
  DollarSign,
  FileText,
  BadgeCheck,
} from 'lucide-react'
import { useAppSelector } from '@/redux/hooks'

const fetchScholarship = async (id) => {
  if (!id) return null
  const res = await axios.get(`/scholarships/${id}`)
  return res?.data?.data || res?.data || null
}

export default function ScholarshipDetailsPageClient() {
  const router = useRouter()
  const { scholarshipId } = useParams() || {}

  const user = useAppSelector((state) => state.auth.user)
  const isLoggedIn = !!user

  const { data: scholarship, isLoading, error } = useSWR(
    scholarshipId ? `scholarship-${scholarshipId}` : null,
    () => fetchScholarship(String(scholarshipId))
  )

  const formatDate = (d) => {
    if (!d) return ''
    try {
      return new Date(d).toLocaleString()
    } catch {
      return d
    }
  }

  const isFree = !scholarship?.amount || Number(scholarship?.amount) === 0

  const handleApplyOrBuy = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/learninghub/scholarship-details/${scholarshipId}`)
      return
    }

    if (isFree) {
      router.push(`/lms/student-dashboard/my-courses`)
    } else {
      router.push(`/direct-checkout/scholarship/${scholarshipId}`)
    }
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-700">Scholarship not found</h3>
          <p className="mt-1 text-sm text-red-700/80">
            We couldn&apos;t find the scholarship you&apos;re looking for.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center rounded-md border px-3 py-2 text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
            <button
              onClick={() => location.reload()}
              className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !scholarship) {
    return (
      <div className="w-full">
        {/* Masthead skeleton */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/10 to-background">
          <div className="container mx-auto px-4 py-10">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200/70" />
            <div className="mt-3 h-5 w-72 animate-pulse rounded bg-gray-200/60" />
          </div>
        </div>

        {/* Body skeleton */}
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-40 animate-pulse rounded-xl bg-gray-200" />
              <div className="h-56 animate-pulse rounded-xl bg-gray-200" />
              <div className="h-40 animate-pulse rounded-xl bg-gray-200" />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-12">
                <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Masthead */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/10 to-background">
        <div className="container mx-auto px-4 py-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <BadgeCheck className="h-4 w-4" />
            Scholarship
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            {scholarship.name || 'Untitled Scholarship'}
          </h1>
          <div
            className="mt-2 text-sm text-muted-foreground prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: scholarship.short_description || '' }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border bg-white p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Amount
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {scholarship.amount ? `$${scholarship.amount}` : '—'}
                </div>
              </div>
              <div className="rounded-xl border bg-white p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Type
                </div>
                <div className="mt-1 text-lg">
                  {scholarship.for_tuition_fee_or_cash_scholarship ? 'Cash / Tuition' : 'Scholarship'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <FileText className="h-5 w-5 text-primary" />
                Description
              </h3>
              <div
                className="prose max-w-none text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: scholarship.description || '<i>No description provided</i>',
                }}
              />
            </div>

            {/* Eligibility */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Eligibility Criteria
              </h3>
              <div
                className="text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: scholarship.eligibility_criteria || 'Not specified',
                }}
              />
            </div>

            {/* Dates & flags */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <CalendarClock className="h-5 w-5 text-primary" />
                Timeline & Terms
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-md border bg-gray-50 p-3">
                  <div className="text-xs text-muted-foreground">Application Start</div>
                  <div className="text-sm">{formatDate(scholarship.application_start_date)}</div>
                </div>
                <div className="rounded-md border bg-gray-50 p-3">
                  <div className="text-xs text-muted-foreground">Application Deadline</div>
                  <div className="text-sm">{formatDate(scholarship.application_deadline)}</div>
                </div>
                <div className="rounded-md border bg-gray-50 p-3">
                  <div className="text-xs text-muted-foreground">Renewable</div>
                  <div className="text-sm">{scholarship.renewable_scholarship ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>

            {/* Relations & docs */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Relations & Documents
              </h3>
              <dl className="grid grid-cols-1 gap-3 text-sm text-muted-foreground md:grid-cols-2">
                <div className="rounded-md border p-3">
                  <dt className="text-xs uppercase tracking-wide">master_currency_id</dt>
                  <dd className="mt-1">
                    {String(scholarship.master_currency_id ?? scholarship.master_currency ?? '')}
                  </dd>
                </div>
                <div className="rounded-md border p-3">
                  <dt className="text-xs uppercase tracking-wide">master_scholarship_type_id</dt>
                  <dd className="mt-1">
                    {String(
                      scholarship.master_scholarship_type_id ?? scholarship.master_scholarship_type ?? ''
                    )}
                  </dd>
                </div>
                <div className="rounded-md border p-3">
                  <dt className="text-xs uppercase tracking-wide">company_id</dt>
                  <dd className="mt-1">
                    {String(scholarship.company_id ?? scholarship.company ?? '')}
                  </dd>
                </div>
                <div className="rounded-md border p-3">
                  <dt className="text-xs uppercase tracking-wide">contact_id</dt>
                  <dd className="mt-1">
                    {String(scholarship.contact_id ?? scholarship.contact ?? '')}
                  </dd>
                </div>
                <div className="rounded-md border p-3 md:col-span-2">
                  <dt className="text-xs uppercase tracking-wide">assigned_by_employee_id</dt>
                  <dd className="mt-1">
                    {String(
                      scholarship.assigned_by_employee_id ?? scholarship.assigned_by_employee ?? ''
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right: sticky summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-12">
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground">Amount</div>
                  <div className="text-3xl font-bold">
                    {isFree ? 'Free' : `$${Number(scholarship.amount).toFixed(2)}`}
                  </div>
                </div>

                <button
                  onClick={handleApplyOrBuy}
                  className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isFree
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {isFree ? 'Apply Now' : 'Pay & Apply'}
                  <ArrowRight className="ml-2 inline h-4 w-4 align-middle" />
                </button>

                {!isLoggedIn && (
                  <div className="mt-3 rounded-md border bg-yellow-50 p-3 text-xs text-yellow-800">
                    Login to apply for this scholarship
                  </div>
                )}

                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Secure & encrypted checkout
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    45-Day Money-Back Guarantee
                  </div>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  By proceeding, you agree to our Terms & Refund Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
