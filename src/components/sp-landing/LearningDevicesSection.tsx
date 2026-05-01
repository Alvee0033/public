"use client";

import React from "react";
import { 
  Laptop, 
  Smartphone, 
  Watch, 
  Monitor, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck,
  Sparkles,
  Award
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DEVICES = [
  {
    name: "AI Chrombook Elite",
    price: "$299",
    category: "Laptops",
    icon: <Laptop />,
    image: "/images/chromebook-lifestyle.png"
  },
  {
    name: "ScholarPad Pro",
    price: "$199",
    category: "Tablets",
    icon: <Smartphone />,
    image: "/images/tablet-with-stylus.jpg"
  },
  {
    name: "STEM Robotics Kit",
    price: "$149",
    category: "Hardware",
    icon: <Watch />,
    image: "/images/robotics-kit.jpg"
  }
];

export default function LearningDevicesSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container relative z-10 px-4 mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="space-y-4 max-w-2xl">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
              The Gear Shop
            </Badge>
            <h2 className="text-4xl md:text-5xl font-display font-black text-slate-950 leading-tight">
              Equip Your <br />
              <span className="text-green-600">Learning Toolkit.</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium max-w-xl">
              Certified learning devices and STEM kits. Redeem your ScholarPASS credits for hardware and software.
            </p>
          </div>
          
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-slate-900 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm group">
            Browse Full Shop
            <ShoppingBag className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {DEVICES.map((device, i) => (
            <div
              key={i}
              className="group flex flex-col bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden hover:bg-white hover:shadow-2xl transition-all duration-500"
              style={{ animation: `fadeIn 0.6s ease-out ${i * 0.15}s both` }}
            >
              <div className="relative h-64 flex items-center justify-center p-8 bg-slate-100/50 group-hover:bg-transparent transition-colors overflow-hidden">
                <Image
                  src={device.image}
                  alt={device.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
                />
                
                <div className="absolute top-6 right-6">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xl flex items-center justify-center text-slate-950">
                    {device.icon}
                  </div>
                </div>

                {/* Hover Badge */}
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                   <Badge className="bg-green-600 text-white font-black text-[10px] uppercase px-3 py-1">Best Choice</Badge>
                </div>
              </div>

              <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{device.category}</div>
                  <h3 className="text-2xl font-black text-slate-950 group-hover:text-green-600 transition-colors uppercase tracking-tight">{device.name}</h3>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                  <div className="space-y-1">
                    <div className="text-3xl font-black text-slate-950">{device.price}</div>
                    <div className="text-[10px] font-bold text-slate-400 line-through tracking-widest">$450 SRP</div>
                  </div>
                  <Button className="h-14 px-6 rounded-2xl bg-slate-900 border-0 text-white font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg group/btn">
                    Redeem Credits
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Bar */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Truck className="w-5 h-5 text-blue-600" />, title: "Free Global Shipping", desc: "Arrives in 3-5 business days." },
            { icon: <ShieldCheck className="w-5 h-5 text-blue-600" />, title: "3-Year Warranty", desc: "Zero-cost hardware protection." },
            { icon: <Sparkles className="w-5 h-5 text-blue-600" />, title: "Ready-to-Learn", desc: "Pre-installed education apps." },
            { icon: <Award className="w-5 h-5 text-blue-600" />, title: "Trade-In Program", desc: "Upgrade your gear easily." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-3 p-6 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                {item.icon}
              </div>
              <h5 className="font-black text-slate-900 text-sm uppercase tracking-tight">{item.title}</h5>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
