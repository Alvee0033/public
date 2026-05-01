"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle, Eye, XCircle } from "lucide-react"
import { useState } from "react"
// import { toast } from "@radix-ui/react-toast"

// Mock data for demonstration
const mockPaymentRequests = [
  { id: 1, tutor: "John Doe", amount: 500, status: "pending", date: "2023-06-01", description: "May tutoring sessions", stripeAccountId: "acct_1234567890" },
  { id: 2, tutor: "Jane Smith", amount: 750, status: "approved", date: "2023-06-02", description: "June tutoring sessions", stripeAccountId: "acct_0987654321" },
  { id: 3, tutor: "Bob Johnson", amount: 600, status: "pending", date: "2023-06-03", description: "Special workshop", stripeAccountId: "acct_1122334455" },
  { id: 4, tutor: "Alice Brown", amount: 800, status: "rejected", date: "2023-06-04", description: "Summer camp tutoring", stripeAccountId: "acct_5566778899" },
  { id: 5, tutor: "Charlie Davis", amount: 550, status: "pending", date: "2023-06-05", description: "Online tutoring sessions", stripeAccountId: "acct_9988776655" },
]

function AdminDashboard() {
  const [paymentRequests, setPaymentRequests] = useState(mockPaymentRequests)
  const [filter, setFilter] = useState("all")
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null, requestId: null })
  const [detailsDialog, setDetailsDialog] = useState({ isOpen: false, request: null })

  // const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


  const updatePaymentStatus = async (id, newStatus) => {
    const request = paymentRequests.find((req) => req.id === id)
    if (!request) return

    if (newStatus === "approved") {
      try {
        // Create a transfer to the tutor's Stripe account
        const transfer = await stripe.transfers.create({
          amount: request.amount * 100, // Stripe uses cents
          currency: "usd",
          destination: request.stripeAccountId,
          transfer_group: `payment_request_${request.id}`,
        })

        // If transfer is successful, update the status
        setPaymentRequests(
          paymentRequests.map((req) =>
            req.id === id ? { ...req, status: newStatus, transferId: transfer.id } : req
          )
        )
        // toast({
        //   title: "Payment Approved",
        //   description: `Successfully transferred $${request.amount} to ${request.tutor}`,
        // })
      } catch (error) {
        console.error("Transfer failed:", error)
        // toast({
        //   title: "Transfer Failed",
        //   description: "There was an error transferring the funds. Please try again.",
        //   variant: "destructive",
        // })
        return
      }
    } else {
      // For rejection, just update the status
      setPaymentRequests(
        paymentRequests.map((req) =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      )
      if (newStatus === "rejected") {
        // toast({
        //   title: "Payment Rejected",
        //   description: `Payment request for ${request.tutor} has been rejected`,
        // })
      }
    }
    setConfirmDialog({ isOpen: false, action: null, requestId: null })
  }

  const openConfirmDialog = (action, id) => {
    setConfirmDialog({ isOpen: true, action, requestId: id })
  }

  const openDetailsDialog = (request) => {
    setDetailsDialog({ isOpen: true, request })
  }

  const filteredRequests = paymentRequests.filter(
    (request) => filter === "all" || request.status === filter
  )

  const getStatusCounts = () => {
    return paymentRequests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1
      acc[request.status + 'Amount'] = (acc[request.status + 'Amount'] || 0) + request.amount
      return acc
    }, {})
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Admin Payment Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <XCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending || 0}</div>
            <p className="text-xs text-muted-foreground">
              ${statusCounts.pendingAmount || 0} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.approved || 0}</div>
            <p className="text-xs text-muted-foreground">
              ${statusCounts.approvedAmount || 0} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Requests</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.rejected || 0}</div>
            <p className="text-xs text-muted-foreground">
              ${statusCounts.rejectedAmount || 0} total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-2 mb-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
        >
          Pending
        </Button>
        <Button
          variant={filter === "approved" ? "default" : "outline"}
          onClick={() => setFilter("approved")}
        >
          Approved
        </Button>
        <Button
          variant={filter === "rejected" ? "default" : "outline"}
          onClick={() => setFilter("rejected")}
        >
          Rejected
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tutor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.tutor}</TableCell>
                  <TableCell>${request.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "success"
                          : request.status === "rejected"
                            ? "destructive"
                            : "warning"
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDetailsDialog(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {request.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => openConfirmDialog("approve", request.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openConfirmDialog("reject", request.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={confirmDialog.isOpen} onOpenChange={(isOpen) => setConfirmDialog({ ...confirmDialog, isOpen })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmDialog.action} this payment request?
              {confirmDialog.action === "approve" && " This will transfer the funds to the tutor's Stripe account."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ isOpen: false, action: null, requestId: null })}>
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === "approve" ? "default" : "destructive"}
              onClick={() => updatePaymentStatus(confirmDialog.requestId, confirmDialog.action + "d")}
            >
              {confirmDialog.action === "approve" ? "Approve and Transfer" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsDialog.isOpen} onOpenChange={(isOpen) => setDetailsDialog({ ...detailsDialog, isOpen })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {detailsDialog.request && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Tutor:</span>
                <span>{detailsDialog.request.tutor}</span>
                <span className="font-semibold">Amount:</span>
                <span>${detailsDialog.request.amount}</span>
                <span className="font-semibold">Status:</span>
                <span>{detailsDialog.request.status}</span>
                <span className="font-semibold">Date:</span>
                <span>{detailsDialog.request.date}</span>
                <span className="font-semibold">Stripe Account:</span>
                <span>{detailsDialog.request.stripeAccountId}</span>
                {detailsDialog.request.transferId && (
                  <>
                    <span className="font-semibold">Transfer ID:</span>
                    <span>{detailsDialog.request.transferId}</span>
                  </>
                )}
              </div>
              <div>
                <span className="font-semibold">Description:</span>
                <p>{detailsDialog.request.description}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailsDialog({ isOpen: false, request: null })}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function Component() {
  return (
    <AdminDashboard />
  )
}