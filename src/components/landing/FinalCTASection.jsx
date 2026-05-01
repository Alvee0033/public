"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance mb-4">
            Ready to Transform Your Learning Journey?
          </h2>
          <p className="text-lg text-muted-foreground text-pretty mb-8">
            Start accessing scholarships, tutoring, and career opportunities through ScholarPASS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/get-started">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/scholarpass-plus">
                <Sparkles />
                Join ScholarPASS Plus - $120/year
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Get $120 SP Wallet Credit instantly when you join
          </p>
        </div>
      </div>
    </section>
  );
}