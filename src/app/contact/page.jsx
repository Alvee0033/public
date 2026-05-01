import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-balance mb-4">
                Get in Touch
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Have questions? We&apos;re here to help
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <Card>
                <CardHeader className="text-center">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Email Us</CardTitle>
                  <CardDescription>
                    hello@scholarpass.com
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Call Us</CardTitle>
                  <CardDescription>
                    +1 (800) 555-0199
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Support Hours</CardTitle>
                  <CardDescription>
                    Mon-Fri: 9am-6pm EST
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What is this about?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Tell us more..." rows={6} />
                  </div>
                  <Button size="lg" className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-12">
              <Card>
                <CardHeader>
                  <MapPin className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Headquarters</CardTitle>
                  <CardDescription>
                    TutorsPlan | ScholarPASS<br />
                    123 Education Drive<br />
                    San Francisco, CA 94105<br />
                    United States
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
