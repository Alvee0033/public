"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Share2,
  Bookmark,
  FileText,
  TrendingUp,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

export default function ScholarshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchScholarshipDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/scholarships/${params.id}`);
        setScholarship(response.data?.data || response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching scholarship details:', err);
        setError('Failed to load scholarship details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchScholarshipDetails();
    }
  }, [params.id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: scholarship?.name,
        text: scholarship?.short_description,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleApply = () => {
    if (scholarship?.url) {
      window.open(scholarship.url, '_blank');
    } else {
      toast.info('Application process will be available soon');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 rounded-full bg-blue-100/30 blur-lg"></div>
              </div>
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Scholarship Details</h2>
                <p className="text-lg text-gray-600">Please wait while we fetch the information...</p>
                <div className="mt-8 space-y-4 max-w-md mx-auto">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/scholarships')}
            className="mb-6 hover:bg-white/60"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scholarships
          </Button>
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50/50">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Scholarship</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => router.push('/scholarships')}>
                Return to Scholarships
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const deadlineStatus = scholarship.application_deadline 
    ? new Date(scholarship.application_deadline) > new Date()
      ? 'open'
      : 'closed'
    : 'ongoing';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/scholarships')}
            className="mb-6 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scholarships
          </Button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {deadlineStatus === 'open' && (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Applications Open
                  </Badge>
                )}
                {deadlineStatus === 'closed' && (
                  <Badge className="bg-red-500 text-white">
                    <XCircle className="w-3 h-3 mr-1" />
                    Deadline Passed
                  </Badge>
                )}
                {deadlineStatus === 'ongoing' && (
                  <Badge className="bg-blue-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Open - Rolling Admissions
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-3 text-balance">{scholarship.name}</h1>
              {scholarship.short_description && (
                <p className="text-xl text-white/90 mb-4 text-pretty">{scholarship.short_description}</p>
              )}
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mt-6">
                {scholarship.amount && (
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 rounded-full p-2">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-white/80">Award Amount</div>
                      <div className="text-xl font-bold">{formatAmount(scholarship.amount)}</div>
                    </div>
                  </div>
                )}
                {scholarship.application_deadline && (
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 rounded-full p-2">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-white/80">Deadline</div>
                      <div className="text-xl font-bold">{formatDate(scholarship.application_deadline)}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 rounded-full p-2">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-white/80">Type</div>
                    <div className="text-xl font-bold">
                      {scholarship.for_tuition_fee_or_cash_scholarship ? 'Tuition/Cash' : 'Other'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-white/90 text-lg font-semibold shadow-lg"
                onClick={handleApply}
                disabled={deadlineStatus === 'closed'}
              >
                {scholarship.url ? 'Apply Now' : 'Learn More'}
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="flex-1 bg-white/20 text-white hover:bg-white/30 border-white/40"
                  onClick={handleBookmark}
                >
                  <Bookmark className={`w-5 h-5 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Saved' : 'Save'}
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="flex-1 bg-white/20 text-white hover:bg-white/30 border-white/40"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            {scholarship.description && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                    About This Scholarship
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-lg">{scholarship.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Eligibility Criteria Card */}
            {scholarship.eligibility_criteria && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                    Eligibility Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                      {scholarship.eligibility_criteria}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Application Timeline */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Clock className="w-6 h-6 text-orange-600" />
                  Application Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scholarship.application_start_date && (
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="bg-blue-600 rounded-full p-3">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Application Opens</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatDate(scholarship.application_start_date)}
                        </div>
                      </div>
                    </div>
                  )}
                  {scholarship.application_deadline && (
                    <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="bg-orange-600 rounded-full p-3">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Application Deadline</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatDate(scholarship.application_deadline)}
                        </div>
                      </div>
                    </div>
                  )}
                  {!scholarship.application_start_date && !scholarship.application_deadline && (
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="bg-green-600 rounded-full p-3">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Application Status</div>
                        <div className="text-lg font-semibold text-gray-900">Rolling Admissions</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* External Link */}
            {scholarship.url && (
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
                      <p className="text-white/90">Visit the official scholarship website to submit your application</p>
                    </div>
                    <Button 
                      size="lg" 
                      className="bg-white text-blue-600 hover:bg-white/90"
                      onClick={() => window.open(scholarship.url, '_blank')}
                    >
                      Visit Website
                      <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Key Details Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">Key Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scholarship.amount && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <DollarSign className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-600">Award Amount</div>
                      <div className="text-xl font-bold text-green-700">{formatAmount(scholarship.amount)}</div>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-purple-600 mt-1 shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-600">Scholarship Type</div>
                      <div className="text-base font-semibold text-gray-900">
                        {scholarship.for_tuition_fee_or_cash_scholarship 
                          ? 'Tuition Fee / Cash Scholarship' 
                          : 'Other Scholarship Type'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-600">Renewable</div>
                      <div className="text-base font-semibold text-gray-900">
                        {scholarship.renewable_scholarship ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  size="lg"
                  onClick={handleApply}
                  disabled={deadlineStatus === 'closed'}
                >
                  {scholarship.url ? 'Apply Now' : 'Learn More'}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                  onClick={handleBookmark}
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Saved to Your List' : 'Save for Later'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}