'use client'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronDown, ChevronRight, MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const menuItems = [
  { label: "Home", slug: "/" },
  { label: "Course List", slug: "/course-list" },
  { label: "Tutors", slug: "/tutors" },
  { label: "LearningART", slug: "/learning-art" },
  { label: "Institutes", slug: "/institutes" },
  { label: "Company", slug: "/about", child: [{ label: "About Us", slug: "/about" }, { label: "Contact Us", slug: "/contact" }] },
  { label: "Store", slug: "/store" },
]

export function MobileMenu({ userinfo }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCompanyOpen, setIsCompanyOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} >
      <SheetTrigger asChild>
        <Button size="icon" className="lg:hidden p-5 active:scale-95" variant="outline">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] pt-16">
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <div key={item.slug}>
              {item.child ? (
                <div>
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isCompanyOpen ? 'rotate-180' : ''}`} />
                  </Button>
                  {isCompanyOpen && (
                    <div className="ml-4 mt-2 flex flex-col gap-2">
                      {item.child.map((subItem) => (
                        <Link key={subItem.slug} href={subItem.slug} onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            {subItem.label}
                            <ChevronRight className="w-4 h-4 mr-2" />
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link href={item.slug} onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    {item.label}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </nav>
        {userinfo?.token ? <div className="mt-6 flex sm:hidden flex-col gap-1">
          <Button asChild variant="link" className="w-full hover:bg-gray-50">
            <Link href="/student/profile" onClick={() => setIsOpen(false)}>Profile</Link>
          </Button>
          <Button asChild variant="link" className="w-full hover:bg-gray-50">
            <Link href="/billing" onClick={() => setIsOpen(false)}>Billing</Link>
          </Button>
          <Button asChild variant="link" className="w-full hover:bg-gray-50">
            <Link href="/team" onClick={() => setIsOpen(false)}>Team</Link>
          </Button>
          <Button asChild variant="link" className="w-full hover:bg-gray-50">
            <Link href="/subscription" onClick={() => setIsOpen(false)}>Subscription</Link>
          </Button>
        </div> : <div className="mt-6 flex sm:hidden flex-col gap-4">
          <Button asChild variant="link" className="w-full hover:bg-gray-50">
            <Link href="/login" onClick={() => setIsOpen(false)}>Log In</Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/register" onClick={() => setIsOpen(false)}>Sign Up</Link>
          </Button>
        </div>}
      </SheetContent>
    </Sheet>
  )
}
