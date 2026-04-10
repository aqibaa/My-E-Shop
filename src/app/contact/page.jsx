"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { sendContactEmail } from "@/lib/actions/contact.actions"

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await sendContactEmail(data);
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset(); 
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have a question about our products, your order, or just want to say hi? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* Left Side: Contact Info */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
          
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0">
               <Mail className="w-6 h-6" />
            </div>
            <div>
               <h3 className="font-semibold text-lg">Email Us</h3>
               <p className="text-muted-foreground mt-1">We usually respond within 24 hours.</p>
               <p className="font-medium mt-2 text-foreground">support@myeshop.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-green-50 p-3 rounded-full text-green-600 shrink-0">
               <Phone className="w-6 h-6" />
            </div>
            <div>
               <h3 className="font-semibold text-lg">Call Us</h3>
               <p className="text-muted-foreground mt-1">Available Mon-Fri, 9am to 6pm EST.</p>
               <p className="font-medium mt-2 text-foreground">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-orange-50 p-3 rounded-full text-orange-600 shrink-0">
               <MapPin className="w-6 h-6" />
            </div>
            <div>
               <h3 className="font-semibold text-lg">Visit Us</h3>
               <p className="text-muted-foreground mt-1">Our headquarters.</p>
               <p className="font-medium mt-2 text-foreground">123 Commerce Street, Suite 100<br/>New York, NY 10001, USA</p>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" {...register("name", { required: true })} placeholder="John Doe" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" {...register("email", { required: true })} placeholder="john@example.com" className="rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" {...register("subject", { required: true })} placeholder="How can we help you?" className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                {...register("message", { required: true })} 
                placeholder="Type your message here..." 
                className="rounded-xl min-h-[150px]" 
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full rounded-xl h-12 text-md gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {isLoading ? "Sending Message..." : "Send Message"}
            </Button>
          </form>
        </div>

      </div>
    </div>
  )
}