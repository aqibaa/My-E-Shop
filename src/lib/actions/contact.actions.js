'use server'

import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.EMAIL_USER;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendContactEmail(formData) {
  try {
    const { name, email, subject, message } = formData;

    await transporter.sendMail({
      from: `"${name} (Contact Form)" <${process.env.EMAIL_USER}>`, 
      replyTo: email, 
      to: ADMIN_EMAIL, 
      subject: `New Inquiry: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #2563eb; margin-top: 0;">New Message from My E-Shop</h2>
            <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
            <p style="background: #fff; padding: 15px; border: 1px solid #e5e7eb; border-radius: 6px; white-space: pre-wrap; line-height: 1.5; color: #4b5563;">
               ${message}
            </p>
            
            <div style="margin-top: 30px; font-size: 12px; color: #9ca3af; text-align: center;">
                This email was sent from your E-Shop Contact Form.
            </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send contact email via Nodemailer:", error);
    throw new Error("Failed to send message. Please try again.");
  }
}