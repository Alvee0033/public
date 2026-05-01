import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Building, Beaker } from "lucide-react"

export default function ScholarPASSPartnershipsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <Badge variant="secondary" className="mb-4">
                        Partnership Opportunities
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ScholarPASS Partnership for LearningHub and STEM Labs
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
                        Become a ScholarPASS Hub Partner or open a STEM & Robotic Center with excellent packages and support
                    </p>
                </div>
            </section>

            {/* Partnership Options */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Card className="hover:shadow-lg transition-shadow border-primary/20">
                            <CardHeader>
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Building className="w-8 h-8 text-primary-foreground" />
                                </div>
                                <CardTitle className="text-center">ScholarPASS Hub Partner</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-muted-foreground mb-4">
                                    Excellent packages with 90% funding support for establishing learning hubs and educational centers in
                                    your community.
                                </p>
                                <Badge className="bg-green-100 text-green-800 mb-4">90% Funding Support</Badge>
                                <div className="mt-4">
                                    <Button className="w-full">
                                        <Link href="/hub-partner">Become Hub Partner</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow border-secondary/20">
                            <CardHeader>
                                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Beaker className="w-8 h-8 text-secondary-foreground" />
                                </div>
                                <CardTitle className="text-center">STEM & Robotic Center</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-muted-foreground mb-4">
                                    Open cutting-edge STEM & Robotics centers with complete equipment setup, training, and ongoing support
                                    for women empowerment.
                                </p>
                                <Badge className="bg-purple-100 text-purple-800 mb-4">Women Empowerment Focus</Badge>
                                <div className="mt-4">
                                    <Button className="w-full">
                                        <Link href="/stem-center">Open STEM Center</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}
