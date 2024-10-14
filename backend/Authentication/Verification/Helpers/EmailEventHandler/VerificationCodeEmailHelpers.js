import transporter from './EmailTransporter.js';
import User from '../../../Models/UserModel.js'; 

/**
 * Sends a verification email with the provided code.
 *
 * @param {string} email - The user's email address.
 * @param {string} code - The verification code.
 */
export const sendVerificationEmail = async (email, code) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const { first_name: firstName, last_name: lastName } = user;

        const mailOptions = {
            from: process.env.SERVICES_EMAIL, 
            to: email,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${code}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h1 style="color: #333;">Verify Your Email Address</h1>
                    <p>Dear <strong>${firstName} ${lastName}</strong>,</p> <!-- Updated to make the name bold -->
                    <p>Your verification code is:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; color: #4CAF50;">${code}</span>
                    </div>
                    <p>If you did not request this code, please ignore this email.</p>
                    <p>Thank you,<br>${process.env.SERVICES_NAME} Support Team</p> <!-- Updated to use company name from environment variable -->
                    <hr>
                    <p style="font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send verification email: ${error.message}`);
        throw new Error('Failed to send verification email');
    }
};

export default { sendVerificationEmail };

