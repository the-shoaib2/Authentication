// backend/Services/VerificationCodeEmailService.js

const nodemailer = require('nodemailer');

// Configure your email transport using SMTP or any email service
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Example: using Gmail
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD // Your email password or app-specific password
    }
});

/**
 * Sends a verification email with the provided token.
 *
 * @param {string} email - The user's email address.
 * @param {string} token - The verification token.
 */
const sendVerificationEmail = async (email, token) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's email address
        to: email, // Recipient's email address
        subject: 'Verify Your Email Address',
        text: `Please verify your email address by clicking the following link: ${process.env.FRONTEND_URL}/verify-email/${token}`,
        html: `
            <p>Please verify your email address by clicking the link below:</p>
            <a href="${process.env.FRONTEND_URL}/verify-email/${token}">Verify Email</a>
            <p>If you did not sign up for an account, please ignore this email.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send verification email: ${error.message}`);
        throw new Error('Failed to send verification email');
    }
};

module.exports = { sendVerificationEmail };

