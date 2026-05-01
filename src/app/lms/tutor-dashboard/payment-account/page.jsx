'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building, CreditCard, Plus, Wallet } from 'lucide-react'
import { useState } from 'react'

export default function Component() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('stripe')
  const [accountNumber, setAccountNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [savedPayments, setSavedPayments] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activePaymentId, setActivePaymentId] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !phone || !paymentMethod || !accountNumber || !expiryDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    const newPayment = {
      id: Date.now(),
      type: paymentMethod,
      accountNumber,
      expiryDate,
      name,
      email,
      phone,
    }

    const updatedPayments = [...savedPayments, newPayment]
    setSavedPayments(updatedPayments)

    // Set as active if it's the first payment method
    if (updatedPayments.length === 1) {
      setActivePaymentId(newPayment.id)
    }

    // Reset form fields
    setName('')
    setEmail('')
    setPhone('')
    setAccountNumber('')
    setExpiryDate('')
    setPaymentMethod('stripe')

    setIsDialogOpen(false)

    toast({
      title: "Success",
      description: "Your payment method has been saved.",
    })
  }

  const handleSetActive = (id) => {
    setActivePaymentId(id)
    toast({
      title: "Payment Method Updated",
      description: "Your active payment method has been changed.",
    })
  }

  return (
    <div className="w-full  mx-auto p-4 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Payment Methods</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Enter your details to add a new payment method.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <RadioGroup
                  defaultValue="stripe"
                  className="grid grid-cols-3 gap-4"
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div>
                    <RadioGroupItem value="stripe" id="stripe" className="peer sr-only" />
                    <Label
                      htmlFor="stripe"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <CreditCard className="mb-3 h-6 w-6" />
                      Stripe
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                    <Label
                      htmlFor="bank"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Building className="mb-3 h-6 w-6" />
                      Bank
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                    <Label
                      htmlFor="paypal"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Wallet className="mb-3 h-6 w-6" />
                      PayPal
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number / Card Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="1234 5678 9012 3456"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Save Payment Method</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[400px] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Active</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>Expiry Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {savedPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <RadioGroup value={activePaymentId} onValueChange={handleSetActive}>
                    <RadioGroupItem value={payment.id} id={`active-${payment.id}`} />
                  </RadioGroup>
                </TableCell>
                <TableCell className="font-medium">{payment.type}</TableCell>
                <TableCell>{payment.name}</TableCell>
                <TableCell>{payment.email}</TableCell>
                <TableCell>{payment.phone}</TableCell>
                <TableCell>{payment.accountNumber}</TableCell>
                <TableCell>{payment.expiryDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}