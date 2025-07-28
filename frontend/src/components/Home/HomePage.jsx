"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { useAuth } from "../../contexts/AuthContext.jsx";
import {
  Calendar,
  CheckSquare,
  Target,
  DollarSign,
  BarChart3,
  Clock,
  TrendingUp,
  // Users,
  Star,
  ArrowRight,
  Play,
  // Zap,
  // Shield,
  // Smartphone,
  // User,
} from "lucide-react";

export default function ProductivityLanding() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const { user } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "AI-powered time blocking that adapts to your productivity patterns",
      color: "text-[#FF745C]",
    },
    {
      icon: CheckSquare,
      title: "Task Management",
      description:
        "Intelligent task prioritization with deadline tracking and reminders",
      color: "text-[#FF6347]",
    },
    {
      icon: Target,
      title: "Goal Planning",
      description:
        "Break down big goals into actionable daily plans with progress tracking",
      color: "text-[#FF745C]",
    },
    {
      icon: DollarSign,
      title: "Expense Tracking",
      description:
        "Monitor daily expenses with categorization and budget insights",
      color: "text-[#FF6347]",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "95%", label: "Productivity Increase" },
    { number: "4.9", label: "App Store Rating" },
    { number: "50+", label: "Countries" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      content:
        "This tool transformed how I manage my day. The analytics helped me identify my peak productivity hours.",
      rating: 5,
    },
    {
      name: "Mike Rodriguez",
      role: "Entrepreneur",
      content:
        "Finally, a productivity app that actually understands how I work. The expense tracking is a game-changer.",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "Designer",
      content:
        "The time blocking feature helped me reclaim 2 hours of productive time every day. Absolutely love it!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-8 transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="space-y-4">
                <Badge className="bg-[#FF745C]/10 text-[#FF745C] border-[#FF745C]/20">
                  🚀 New: AI-Powered Analytics Dashboard
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-[#2C2627] leading-tight">
                  Master Your Day with
                  <span className="bg-gradient-to-r from-[#FF745C] to-[#FF6347] bg-clip-text text-transparent">
                    {" "}
                    Advanced Time Blocking
                  </span>
                </h1>
                <p className="text-xl text-[#95999D] leading-relaxed">
                  Transform your productivity with intelligent scheduling, task
                  management, goal planning, and expense tracking. Get
                  actionable insights from your daily patterns.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#FF745C] hover:bg-[#ff6347] text-white px-8 py-4 text-lg group"
                  onClick={() => window.open("/dashboard", "_self")}
                >
                  {user ? "Get Started" : "Start Free Trial"}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#95999D] text-[#2C2627] hover:bg-[#95999D]/10 px-8 py-4 text-lg group bg-transparent"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-[#2C2627]">
                      {stat.number}
                    </div>
                    <div className="text-sm text-[#95999D]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`relative transition-all duration-1000 delay-300 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF745C]/20 to-[#FF6347]/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#2C2627]">
                        Today's Focus
                      </h3>
                      <Badge className="bg-[#FF745C]/10 text-[#FF745C]">
                        85% Complete
                      </Badge>
                    </div>

                    {features.map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div
                          key={index}
                          className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-500 ${
                            activeFeature === index
                              ? "bg-gradient-to-r from-[#FF745C]/10 to-[#FF6347]/10 scale-105"
                              : "bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center ${feature.color}`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-[#2C2627]">
                              {feature.title}
                            </div>
                            <div className="text-sm text-[#95999D]">
                              2 hours blocked
                            </div>
                          </div>
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#FF745C] to-[#FF6347] rounded-full transition-all duration-1000"
                              style={{
                                width: activeFeature === index ? "85%" : "60%",
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-[#FF745C]/10 text-[#FF745C] border-[#FF745C]/20">
              Core Features
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#2C2627]">
              Everything You Need to Stay Productive
            </h2>
            <p className="text-xl text-[#95999D] max-w-3xl mx-auto">
              Four powerful modules working together to optimize your daily
              workflow and provide deep insights into your productivity
              patterns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-200"
                >
                  <CardContent className="p-8 text-center space-y-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#FF745C]/10 to-[#FF6347]/10 flex items-center justify-center group-hover:scale-110 transition-transform ${feature.color}`}
                    >
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#2C2627]">
                      {feature.title}
                    </h3>
                    <p className="text-[#95999D]">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section
        id="analytics"
        className="py-20 bg-gradient-to-br from-[#2C2627] to-[#95999D] text-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-[#FF745C]/20 text-[#FF745C] border-[#FF745C]/30">
                  Advanced Analytics
                </Badge>
                <h2 className="text-3xl lg:text-5xl font-bold">
                  Turn Your Data Into
                  <span className="bg-gradient-to-r from-[#FF745C] to-[#FF6347] bg-clip-text text-transparent">
                    {" "}
                    Actionable Insights
                  </span>
                </h2>
                <p className="text-xl text-gray-300">
                  Our AI analyzes your productivity patterns, spending habits,
                  and goal progress to provide personalized recommendations for
                  maximum efficiency.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FF745C]/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#FF745C]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Productivity Trends
                    </h3>
                    <p className="text-gray-300">
                      Identify your peak performance hours and optimize your
                      schedule
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FF6347]/20 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-[#FF6347]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Smart Recommendations
                    </h3>
                    <p className="text-gray-300">
                      Get AI-powered suggestions to improve your daily workflow
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FF745C]/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#FF745C]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Time Optimization</h3>
                    <p className="text-gray-300">
                      Discover time-wasting patterns and reclaim lost hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Weekly Analytics</h3>
                    <Badge className="bg-[#FF745C]/20 text-[#FF745C]">
                      +15% vs last week
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Focus Time</span>
                      <span className="font-semibold">32.5 hours</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full">
                      <div className="w-4/5 h-full bg-gradient-to-r from-[#FF745C] to-[#FF6347] rounded-full"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Tasks Completed</span>
                      <span className="font-semibold">47/52</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full">
                      <div className="w-5/6 h-full bg-gradient-to-r from-[#FF745C] to-[#FF6347] rounded-full"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Budget Adherence</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full">
                      <div className="w-11/12 h-full bg-gradient-to-r from-[#FF745C] to-[#FF6347] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-[#FF745C]/10 text-[#FF745C] border-[#FF745C]/20">
              User Reviews
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#2C2627]">
              Loved by Thousands of Users
            </h2>
            <p className="text-xl text-[#95999D] max-w-3xl mx-auto">
              See how Stay Determined! is helping people around the world
              achieve their productivity goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 border-gray-200"
              >
                <CardContent className="p-8 space-y-4">
                  <div className="flex space-x-1">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-[#FF745C] text-[#FF745C]"
                      />
                    ))}
                  </div>
                  <p className="text-[#2C2627] italic">
                    {testimonial.content}
                  </p>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="font-semibold text-[#2C2627]">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-[#95999D]">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-gradient-to-r from-[#FF745C] to-[#FF6347] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of users who have already mastered their daily
              workflow with Stay Determined!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-[#FF745C] hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Start Your Free Trial
              </Button>
              <div className="flex items-center space-x-2 text-white/80">
                <Shield className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-8 pt-8">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span>Available on all devices</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>10,000+ active users</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      {/* <footer className="bg-[#2C2627] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FF745C] to-[#FF6347] rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Stay Determined!</span>
              </div>
              <p className="text-gray-400">
                Master your productivity with intelligent time management and
                analytics.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-gray-400">
                <div>Features</div>
                <div>Analytics</div>
                <div>Pricing</div>
                <div>API</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-gray-400">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Documentation</div>
                <div>Community</div>
                <div>Status</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Stay Determined! All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
