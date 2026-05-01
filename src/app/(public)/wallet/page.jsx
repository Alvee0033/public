import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownLeft, Gift, Award, ShoppingCart, BookOpen, Zap, CreditCard, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

const transactions = [
  {
    id: 1,
    type: "credit",
    title: "Scholarship Reward",
    description: "Tech Future Scholarship - Microsoft",
    amount: 200,
    date: "2024-12-10",
    icon: Award
  },
  {
    id: 2,
    type: "debit",
    title: "Course Enrollment",
    description: "Python for Beginners - TechAcademy",
    amount: -49.99,
    date: "2024-12-09",
    icon: BookOpen
  },
  {
    id: 3,
    type: "credit",
    title: "Monthly Plus Credits",
    description: "ScholarPASS Plus subscription benefit",
    amount: 50,
    date: "2024-12-01",
    icon: Gift
  },
  {
    id: 4,
    type: "debit",
    title: "Learning Device",
    description: "iPad Pro 11-inch",
    amount: -299,
    date: "2024-11-28",
    icon: ShoppingCart
  },
  {
    id: 5,
    type: "credit",
    title: "Referral Bonus",
    description: "Friend joined ScholarPASS Plus",
    amount: 25,
    date: "2024-11-25",
    icon: Gift
  },
  {
    id: 6,
    type: "debit",
    title: "Tutoring Session",
    description: "Math Tutoring - Dr. Emily Chen",
    amount: -45,
    date: "2024-11-20",
    icon: BookOpen
  },
  {
    id: 7,
    type: "credit",
    title: "Scholarship Reward",
    description: "Women in Engineering - Google.org",
    amount: 150,
    date: "2024-11-15",
    icon: Award
  },
  {
    id: 8,
    type: "credit",
    title: "Achievement Bonus",
    description: "15-day learning streak completed",
    amount: 10,
    date: "2024-11-10",
    icon: TrendingUp
  }
]

const redeemOptions = [
  {
    title: "Course Enrollment",
    description: "Apply credits toward any course on the platform",
    icon: BookOpen,
    color: "blue"
  },
  {
    title: "Tutoring Sessions",
    description: "Book 1-on-1 sessions with expert tutors",
    icon: Award,
    color: "purple"
  },
  {
    title: "Learning Devices",
    description: "Get tablets, laptops, and STEM kits",
    icon: ShoppingCart,
    color: "green"
  },
  {
    title: "Bootcamp Tuition",
    description: "Apply credits toward career bootcamps",
    icon: TrendingUp,
    color: "orange"
  }
]

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">SP Wallet</h1>
          <p className="text-muted-foreground">Your education credits and transaction history</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-br from-blue-600 to-purple-700 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-white/80 mb-2">Available Balance</p>
                <h2 className="text-5xl font-bold mb-1">$487.01</h2>
                <p className="text-white/80 text-sm">1 SP Credit = $1 USD</p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <DollarSign className="h-8 w-8" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
              <div>
                <p className="text-white/80 text-sm mb-1">This Month</p>
                <p className="text-xl font-bold">+$250</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Total Earned</p>
                <p className="text-xl font-bold">$1,245</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Total Spent</p>
                <p className="text-xl font-bold">$758</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button className="flex-1 bg-white text-blue-600 hover:bg-white/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Funds
              </Button>
              <Button className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Redeem Credits
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Credits</CardTitle>
                <Zap className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">$125</div>
              <p className="text-xs text-muted-foreground mt-1">From 3 scholarships</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Bonus</CardTitle>
                <Gift className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">$50</div>
              <p className="text-xs text-muted-foreground mt-1">Plus membership benefit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Referral Earnings</CardTitle>
                <Award className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$75</div>
              <p className="text-xs text-muted-foreground mt-1">From 3 referrals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Next Reward</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">$50</div>
              <p className="text-xs text-muted-foreground mt-1">In 5 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Transactions */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All Transactions</TabsTrigger>
                <TabsTrigger value="credits" className="flex-1">Credits</TabsTrigger>
                <TabsTrigger value="debits" className="flex-1">Spending</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Your complete SP Wallet activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {transactions.map((transaction) => {
                        const Icon = transaction.icon
                        return (
                          <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className={`rounded-full p-2 ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                                <Icon className={`h-5 w-5 ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`} />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{transaction.title}</p>
                                <p className="text-xs text-muted-foreground">{transaction.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{transaction.date}</p>
                              </div>
                            </div>
                            <div className={`text-lg font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type === 'credit' ? '+' : ''}{transaction.amount < 0 ? transaction.amount : `$${transaction.amount}`}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <Button variant="outline" className="w-full mt-4">Load More Transactions</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="credits">
                <Card>
                  <CardHeader>
                    <CardTitle>Credits Earned</CardTitle>
                    <CardDescription>Money added to your wallet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {transactions.filter(t => t.type === 'credit').map((transaction) => {
                        const Icon = transaction.icon
                        return (
                          <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full p-2 bg-green-100">
                                <Icon className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{transaction.title}</p>
                                <p className="text-xs text-muted-foreground">{transaction.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{transaction.date}</p>
                              </div>
                            </div>
                            <div className="text-lg font-bold text-green-600">
                              +${transaction.amount}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="debits">
                <Card>
                  <CardHeader>
                    <CardTitle>Credits Spent</CardTitle>
                    <CardDescription>Your purchases and redemptions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {transactions.filter(t => t.type === 'debit').map((transaction) => {
                        const Icon = transaction.icon
                        return (
                          <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full p-2 bg-red-100">
                                <Icon className="h-5 w-5 text-red-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{transaction.title}</p>
                                <p className="text-xs text-muted-foreground">{transaction.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{transaction.date}</p>
                              </div>
                            </div>
                            <div className="text-lg font-bold text-red-600">
                              {transaction.amount}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Earn & Redeem */}
          <div className="space-y-6">
            {/* Earn Credits */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Earn More Credits
                </CardTitle>
                <CardDescription>Ways to grow your wallet balance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">Win Scholarships</p>
                    <Badge className="bg-green-600">Up to $10K</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Apply and win scholarship rewards</p>
                  <Button size="sm" className="w-full">Browse Scholarships</Button>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">Refer Friends</p>
                    <Badge className="bg-blue-600">$25 each</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Get $25 for each friend who joins</p>
                  <Button size="sm" variant="outline" className="w-full">Share Link</Button>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">Learning Streaks</p>
                    <Badge className="bg-orange-600">$10-$50</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Maintain daily learning habits</p>
                  <Button size="sm" variant="outline" className="w-full">View Goals</Button>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">Plus Membership</p>
                    <Badge className="bg-purple-600">$50/month</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Get monthly credit rewards</p>
                  <Link href="/scholarpass-plus">
                    <Button size="sm" variant="outline" className="w-full">Upgrade</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Redeem Credits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  Redeem Your Credits
                </CardTitle>
                <CardDescription>Use your wallet balance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {redeemOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <div key={option.title} className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={`rounded-full p-2 bg-${option.color}-100`}>
                          <Icon className={`h-5 w-5 text-${option.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm mb-1">{option.title}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold">Visa •••• 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/26</p>
                    </div>
                  </div>
                  <Badge>Primary</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
