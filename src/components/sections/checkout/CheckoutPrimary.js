import { CreditCard, Lock, DollarSign, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase securely</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* SP Wallet Balance */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 rounded-full p-2">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">SP Wallet Balance</p>
                      <p className="text-2xl font-bold text-blue-600">$487.01</p>
                    </div>
                  </div>
                  <Checkbox id="use-wallet" />
                </div>
                <p className="text-sm text-muted-foreground mt-3">Apply your wallet credits to this purchase</p>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose how you want to pay</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup defaultValue="card">
                  <div className="flex items-center space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        <span className="font-semibold">Credit / Debit Card</span>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          <span className="font-semibold">SP Wallet Only</span>
                        </div>
                        <Badge>$487 available</Badge>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="United States" />
                </div>

                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="123 Main Street" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="San Francisco" />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="CA" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input id="zip" placeholder="94102" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 pb-3 border-b">
                    <Image
                      src="/placeholder.svg"
                      alt="Course"
                      width={64}
                      height={64}
                      className="rounded w-16 h-16 object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Python for Beginners</p>
                      <p className="text-xs text-muted-foreground">TechAcademy Institute</p>
                      <p className="text-sm font-bold text-blue-600 mt-1">$49.99</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">$49.99</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>ScholarPASS Plus Discount (10%)</span>
                    <span className="font-semibold">-$5.00</span>
                  </div>
                  <div className="flex justify-between text-blue-600">
                    <span>SP Wallet Credits</span>
                    <span className="font-semibold">-$44.99</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span>Total Due</span>
                    <span className="text-green-600">$0.00</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-green-900">Fully Covered!</p>
                    <p className="text-green-700 text-xs">Your SP Wallet credits will cover this entire purchase.</p>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600" size="lg">
                  <Lock className="h-4 w-4 mr-2" />
                  Complete Purchase
                </Button>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>

            {/* Money Back Guarantee */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-900 mb-1">30-Day Money Back Guarantee</p>
                    <p className="text-blue-700 text-xs">Not satisfied? Get a full refund within 30 days of purchase.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground text-center mb-3">Trusted by 500,000+ learners</p>
                <div className="flex items-center justify-center gap-4 text-muted-foreground">
                  <Lock className="h-8 w-8" />
                  <CreditCard className="h-8 w-8" />
                  <Check className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
