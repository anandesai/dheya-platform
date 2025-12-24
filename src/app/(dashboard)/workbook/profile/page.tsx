"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, Mail, Phone, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function UserProfilePage() {
    const { data: session } = useSession()
    const user = session?.user

    return (
        <div className="container-uplift space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/workbook">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5 text-charcoal-600" />
                    </Button>
                </Link>
                <div>
                    <h1 className="heading-pagetitle text-charcoal-900">User Profile</h1>
                    <p className="body-large text-charcoal-600">Module 1 of 9</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Profile Form */}
                <Card variant="light" className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-display text-charcoal-800">Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-6 mb-6">
                            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                                <AvatarImage src="/images/avatar-placeholder.jpg" />
                                <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl font-display">
                                    {user?.firstName?.[0] || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <Button variant="outline" size="sm" className="mb-2">Change Photo</Button>
                                <p className="text-xs text-charcoal-500 font-body">
                                    JPG or PNG. Max size of 800K
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" defaultValue={user?.firstName || ""} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" defaultValue={user?.lastName || ""} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue={user?.email || ""} disabled className="bg-charcoal-50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" placeholder="+91 98765 43210" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input id="dob" type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" placeholder="City, State" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Professional Bio</Label>
                            <textarea
                                id="bio"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Briefly describe your current role and career aspirations..."
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Program Info */}
                    <Card variant="light" className="bg-purple-50 border-purple-200">
                        <CardHeader>
                            <CardTitle className="text-lg font-display text-charcoal-800">Program Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs text-charcoal-500 font-body uppercase tracking-wider mb-1">Current Program</p>
                                <p className="font-bold text-purple-700 font-display">Destination Mastery™</p>
                            </div>
                            <div>
                                <p className="text-xs text-charcoal-500 font-body uppercase tracking-wider mb-1">Batch</p>
                                <p className="font-medium text-charcoal-800 font-body">Dec 2025 Cohort</p>
                            </div>
                            <div>
                                <p className="text-xs text-charcoal-500 font-body uppercase tracking-wider mb-1">Status</p>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                            </div>
                            <Separator className="bg-purple-200" />
                            <div>
                                <p className="text-xs text-charcoal-500 font-body uppercase tracking-wider mb-1">Enrollment Date</p>
                                <div className="flex items-center text-sm text-charcoal-700">
                                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                                    Dec 01, 2025
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mentor Info */}
                    <Card variant="light">
                        <CardHeader>
                            <CardTitle className="text-lg font-display text-charcoal-800">Assigned Mentor</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src="/images/mentor-placeholder.jpg" />
                                    <AvatarFallback className="bg-gold-100 text-gold-700">RK</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold font-display text-charcoal-800">Dr. Rajesh Kumar</p>
                                    <p className="text-xs text-charcoal-500 font-body">Senior Career Strategist</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center text-sm text-charcoal-600">
                                    <Mail className="w-4 h-4 mr-3 text-gold-500" />
                                    rajesh.k@dheya.com
                                </div>
                                <div className="flex items-center text-sm text-charcoal-600">
                                    <Phone className="w-4 h-4 mr-3 text-gold-500" />
                                    +91 99887 76655
                                </div>
                                <div className="flex items-center text-sm text-charcoal-600">
                                    <MapPin className="w-4 h-4 mr-3 text-gold-500" />
                                    Pune, India
                                </div>
                            </div>

                            <Button variant="outline" className="w-full mt-2">
                                Schedule Session
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
