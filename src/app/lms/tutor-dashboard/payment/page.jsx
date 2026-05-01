'use client'

import { useState } from "react"
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Dashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earning
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
            </CardContent>
          </Card>
         
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready to Withdraw</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,234.00</div>
             
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Withdraw</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$573,000.00</div>
              
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Recent transactions from your account.
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="ml-auto gap-1">
                    Withdraw Request
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Withdraw Request</DialogTitle>
                    <DialogDescription>
                      Please fill in the details for your withdrawal request.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">
                        Amount
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        className="col-span-3"
                        placeholder="Enter amount"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="account" className="text-right">
                        Account No.
                      </Label>
                      <Input
                        id="account"
                        className="col-span-3"
                        placeholder="Enter account number"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bank" className="text-right">
                        Bank Name
                      </Label>
                      <Input
                        id="bank"
                        className="col-span-3"
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="swift" className="text-right">
                        SWIFT Code
                      </Label>
                      <Input
                        id="swift"
                        className="col-span-3"
                        placeholder="Enter SWIFT code"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" onClick={() => setIsDialogOpen(false)}>Submit Request</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">#TRX001</TableCell>
                    <TableCell>Deposit</TableCell>
                    <TableCell>$1,000.00</TableCell>
                    <TableCell>
                      <Badge variant="success">Completed</Badge>
                    </TableCell>
                    <TableCell>2023-06-28 14:30:00</TableCell>
                    <TableCell>Bank Transfer</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#TRX002</TableCell>
                    <TableCell>Withdrawal</TableCell>
                    <TableCell>$500.00</TableCell>
                    <TableCell>
                      <Badge variant="warning">Pending</Badge>
                    </TableCell>
                    <TableCell>2023-06-27 09:15:00</TableCell>
                    <TableCell>PayPal</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#TRX003</TableCell>
                    <TableCell>Deposit</TableCell>
                    <TableCell>$2,500.00</TableCell>
                    <TableCell>
                      <Badge variant="success">Completed</Badge>
                    </TableCell>
                    <TableCell>2023-06-26 11:45:00</TableCell>
                    <TableCell>Credit Card</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#TRX004</TableCell>
                    <TableCell>Withdrawal</TableCell>
                    <TableCell>$1,500.00</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Failed</Badge>
                    </TableCell>
                    <TableCell>2023-06-25 16:20:00</TableCell>
                    <TableCell>Bank Transfer</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#TRX005</TableCell>
                    <TableCell>Deposit</TableCell>
                    <TableCell>$3,000.00</TableCell>
                    <TableCell>
                      <Badge variant="success">Completed</Badge>
                    </TableCell>
                    <TableCell>2023-06-24 10:00:00</TableCell>
                    <TableCell>Wire Transfer</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}