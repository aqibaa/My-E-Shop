'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const MY_ADMIN_EMAIL = "aaqib.codes@gmail.com"; 

export async function sendContactEmail(formData) {
  try {
    const { name, email, subject, message } = formData;

    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', 
      to: MY_ADMIN_EMAIL, 
      subject: `New Contact Message: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">New Message from My E-Shop</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p><strong>Message:</strong></p>
            <p style="background: #f9fafb; padding: 15px; border-radius: 8px;">${message}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send contact email:", error);
    throw new Error("Failed to send message. Please try again.");
  }
}