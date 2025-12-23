"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  User,
  Lock,
  Package,
  Settings as SettingsIcon,
  Upload,
  Moon,
  Sun,
  Crown,
  Sparkles,
  Zap,
} from "lucide-react"

// Form validation schemas
const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  linkedinUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const preferencesSchema = z.object({
  emailNotifications: z.boolean(),
  sessionReminders: z.boolean(),
  marketingEmails: z.boolean(),
  theme: z.enum(["light", "dark", "system"]),
})

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>
type PreferencesFormValues = z.infer<typeof preferencesSchema>

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: session?.user?.firstName || "",
      lastName: session?.user?.lastName || "",
      phone: "",
      bio: "",
      linkedinUrl: "",
    },
  })

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Preferences form
  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      emailNotifications: true,
      sessionReminders: true,
      marketingEmails: false,
      theme: "light",
    },
  })

  const onProfileSubmit = async () => {
    setIsLoading(true)
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Profile updated successfully")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async () => {
    setIsLoading(true)
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Password changed successfully")
      passwordForm.reset()
    } catch {
      toast.error("Failed to change password")
    } finally {
      setIsLoading(false)
    }
  }

  const onPreferencesSubmit = async () => {
    setIsLoading(true)
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Preferences updated successfully")
    } catch {
      toast.error("Failed to update preferences")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 font-body text-charcoal-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-charcoal-800 mb-2">
          Settings
        </h1>
        <p className="font-body text-charcoal-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-cream-100">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            <Lock className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger
            value="package"
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            <Package className="h-4 w-4 mr-2" />
            Package
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            <SettingsIcon className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card variant="light">
            <CardHeader>
              <CardTitle className="font-display text-2xl text-charcoal-800">
                Profile Information
              </CardTitle>
              <CardDescription className="font-body text-charcoal-600">
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-6"
                >
                  {/* Profile Picture */}
                  <div className="space-y-4">
                    <Label className="font-body text-charcoal-800">Profile Picture</Label>
                    <div className="flex items-center gap-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
                          {session?.user?.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" type="button" disabled>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>
                    <p className="font-body text-sm text-charcoal-500">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-body text-charcoal-800">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-cream-300 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-body text-charcoal-800">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-cream-300 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-2">
                    <Label className="font-body text-charcoal-800">Email</Label>
                    <Input
                      value={session?.user?.email || ""}
                      disabled
                      className="bg-cream-50 border-cream-300"
                    />
                    <p className="font-body text-sm text-charcoal-500">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-charcoal-800">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="border-cream-300 focus:border-purple-500"
                          />
                        </FormControl>
                        <FormDescription className="font-body">
                          Optional. Used for session reminders.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bio */}
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-charcoal-800">
                          Bio / About
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Tell us a bit about yourself..."
                            className="min-h-[120px] border-cream-300 focus:border-purple-500"
                          />
                        </FormControl>
                        <FormDescription className="font-body">
                          Maximum 500 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* LinkedIn URL */}
                  <FormField
                    control={profileForm.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-charcoal-800">
                          LinkedIn Profile
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="url"
                            placeholder="https://linkedin.com/in/yourprofile"
                            className="border-cream-300 focus:border-purple-500"
                          />
                        </FormControl>
                        <FormDescription className="font-body">
                          Your LinkedIn profile URL
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-semibold"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <div className="space-y-6">
            {/* Change Password */}
            <Card variant="light">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-charcoal-800">
                  Change Password
                </CardTitle>
                <CardDescription className="font-body text-charcoal-600">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-body text-charcoal-800">
                            Current Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="border-cream-300 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-body text-charcoal-800">
                            New Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="border-cream-300 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormDescription className="font-body">
                            Must be at least 8 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-body text-charcoal-800">
                            Confirm New Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="border-cream-300 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-semibold"
                    >
                      {isLoading ? "Changing..." : "Change Password"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Email Preferences */}
            <Card variant="light">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-charcoal-800">
                  Email Preferences
                </CardTitle>
                <CardDescription className="font-body text-charcoal-600">
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-body text-charcoal-800">
                        Email Notifications
                      </Label>
                      <p className="font-body text-sm text-charcoal-500">
                        Receive notifications about your account activity
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Package Tab */}
        <TabsContent value="package">
          <div className="space-y-6">
            {/* Current Package */}
            <Card variant="light">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-charcoal-800">
                  Current Package
                </CardTitle>
                <CardDescription className="font-body text-charcoal-600">
                  Your subscription and session details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Package Details */}
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500 rounded-full">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-xl font-semibold text-charcoal-800">
                            Free Plan
                          </h3>
                          <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                            Active
                          </Badge>
                        </div>
                        <p className="font-body text-sm text-charcoal-600 mt-1">
                          Free trial with limited features
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-3xl font-bold text-charcoal-800">
                        $0
                      </p>
                      <p className="font-body text-sm text-charcoal-500">per month</p>
                    </div>
                  </div>

                  {/* Session Balance */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-cream-50 rounded-lg border border-cream-200">
                      <p className="font-body text-sm text-charcoal-600 mb-1">
                        Sessions Remaining
                      </p>
                      <p className="font-display text-2xl font-bold text-charcoal-800">
                        3
                      </p>
                    </div>
                    <div className="p-4 bg-cream-50 rounded-lg border border-cream-200">
                      <p className="font-body text-sm text-charcoal-600 mb-1">
                        Sessions Used
                      </p>
                      <p className="font-display text-2xl font-bold text-charcoal-800">
                        0
                      </p>
                    </div>
                    <div className="p-4 bg-cream-50 rounded-lg border border-cream-200">
                      <p className="font-body text-sm text-charcoal-600 mb-1">
                        Total Sessions
                      </p>
                      <p className="font-display text-2xl font-bold text-charcoal-800">
                        3
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Options */}
            <Card variant="light">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-charcoal-800">
                  Upgrade Your Plan
                </CardTitle>
                <CardDescription className="font-body text-charcoal-600">
                  Get more sessions and unlock premium features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Package */}
                  <div className="p-6 border-2 border-cream-200 rounded-xl hover:border-purple-300 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="h-6 w-6 text-purple-500" />
                      <h3 className="font-display text-xl font-semibold text-charcoal-800">
                        Basic
                      </h3>
                    </div>
                    <p className="font-display text-3xl font-bold text-charcoal-800 mb-2">
                      $99
                      <span className="font-body text-lg font-normal text-charcoal-500">
                        /month
                      </span>
                    </p>
                    <ul className="font-body text-charcoal-600 space-y-2 mb-6">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">✓</span>
                        5 sessions per month
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">✓</span>
                        30-minute sessions
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">✓</span>
                        Email support
                      </li>
                    </ul>
                    <Button
                      variant="outline"
                      className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
                    >
                      Select Basic
                    </Button>
                  </div>

                  {/* Premium Package */}
                  <div className="p-6 border-2 border-purple-500 rounded-xl bg-purple-50 relative">
                    <Badge className="absolute -top-3 right-6 bg-purple-500 text-white">
                      Popular
                    </Badge>
                    <div className="flex items-center gap-3 mb-4">
                      <Crown className="h-6 w-6 text-purple-600" />
                      <h3 className="font-display text-xl font-semibold text-charcoal-800">
                        Premium
                      </h3>
                    </div>
                    <p className="font-display text-3xl font-bold text-charcoal-800 mb-2">
                      $199
                      <span className="font-body text-lg font-normal text-charcoal-500">
                        /month
                      </span>
                    </p>
                    <ul className="font-body text-charcoal-600 space-y-2 mb-6">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">✓</span>
                        15 sessions per month
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">✓</span>
                        45-minute sessions
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">✓</span>
                        Priority support
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">✓</span>
                        Access to all mentors
                      </li>
                    </ul>
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold">
                      Upgrade to Premium
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card variant="light">
            <CardHeader>
              <CardTitle className="font-display text-2xl text-charcoal-800">
                Preferences
              </CardTitle>
              <CardDescription className="font-body text-charcoal-600">
                Customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...preferencesForm}>
                <form
                  onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)}
                  className="space-y-6"
                >
                  {/* Theme Preference */}
                  <div className="space-y-4">
                    <div>
                      <Label className="font-body text-charcoal-800 mb-3 block">
                        Theme Preference
                      </Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          disabled
                        >
                          <Sun className="h-4 w-4 mr-2" />
                          Light
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          disabled
                        >
                          <Moon className="h-4 w-4 mr-2" />
                          Dark
                        </Button>
                      </div>
                      <p className="font-body text-sm text-charcoal-500 mt-2">
                        Theme customization coming soon
                      </p>
                    </div>
                  </div>

                  {/* Communication Preferences */}
                  <div className="space-y-4 pt-6 border-t border-cream-200">
                    <h3 className="font-display text-lg font-semibold text-charcoal-800">
                      Communication Preferences
                    </h3>

                    <FormField
                      control={preferencesForm.control}
                      name="sessionReminders"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-cream-200 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="font-body text-charcoal-800">
                              Session Reminders
                            </FormLabel>
                            <FormDescription className="font-body">
                              Get notified before your scheduled sessions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={preferencesForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-cream-200 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="font-body text-charcoal-800">
                              Email Notifications
                            </FormLabel>
                            <FormDescription className="font-body">
                              Receive updates about your bookings and account
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={preferencesForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-cream-200 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="font-body text-charcoal-800">
                              Marketing Emails
                            </FormLabel>
                            <FormDescription className="font-body">
                              Receive news about new features and special offers
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-semibold"
                  >
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
