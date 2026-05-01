'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, DollarSign, Wallet, Gift, Plus } from "lucide-react"

const iconMap = {
  CreditCard: CreditCard,
  Cash: DollarSign,
  Wallet: Wallet,
  Gift: Gift,
}

const initialPaymentMethods = [
  { id: 1, name: 'Credit Card', icon: 'CreditCard', active: true },
  { id: 3, name: 'Cash', icon: 'Cash', active: true },
]

const PaymentMethodPage = () => {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods)
  const [newMethodName, setNewMethodName] = useState('')
  const [newMethodIcon, setNewMethodIcon] = useState('CreditCard')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const toggleActive = (id) => {
    setPaymentMethods(methods =>
      methods.map(method =>
        method.id === id ? { ...method, active: !method.active } : method
      )
    )
  }

  const addNewMethod = () => {
    if (newMethodName.trim() === '') return
    const newMethod = {
      id: Math.max(0, ...paymentMethods.map(m => m.id)) + 1,
      name: newMethodName.trim(),
      icon: newMethodIcon,
      active: true
    }
    setPaymentMethods([...paymentMethods, newMethod])
    setNewMethodName('')
    setNewMethodIcon('CreditCard')
    setIsDialogOpen(false)
  }


  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Payment Methods</h1>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> Add New Method
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Payment Method</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={newMethodName}
                onChange={(e) => setNewMethodName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="icon" className="text-right">
                Icon
              </label>
              <Select
                value={newMethodIcon}
                onValueChange={(value) => setNewMethodIcon(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(iconMap).map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addNewMethod}>Add Method</Button>
        </DialogContent>
      </Dialog>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentMethods?.map((method) => {
            const IconComponent = iconMap[method.icon]
            return (
              <TableRow key={method.id}>
                <TableCell>
                  <IconComponent className="h-5 w-5" />
                </TableCell>
                <TableCell className="font-medium">{method.name}</TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={method.active}
                    onCheckedChange={() => toggleActive(method.id)}
                    aria-label={`Toggle ${method.name} active status`}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default PaymentMethodPage