import transporter from './EmailTransporter.js';
import User from '../../../Models/UserModel.js'; 


/**
 * Sends a welcome email to the user.
 *
 * @param {string} email - The user's email address.
 */
export const sendWelcomeEmail = async (email) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const { first_name: firstName, last_name: lastName, accountExpiryDate } = user;
        const formattedExpiryDate = accountExpiryDate.toLocaleDateString(); // Format the date

        const mailOptions = {
            from: process.env.SERVICES_EMAIL,
            to: email,
            subject: 'Welcome to Our Service!',
            text: `Dear ${firstName} ${lastName}, welcome to our service! Your account is not activated. Please log in to your account and verify it by ${formattedExpiryDate}.`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h1 style="color: #333; text-align: center;">Welcome to Our Service!</h1>
                    <p style="font-size: 18px; text-align: center;">Dear <strong>${firstName} ${lastName}</strong>,</p>
                    <p style="font-size: 16px; text-align: center;">We are excited to have you on board. Here are some resources to get you started:</p>
                    <ul style="list-style: none; padding: 0; text-align: center;">
                        <li style="margin: 10px 0;"><a href="#" style="color: #007aff; text-decoration: none;">Getting Started Guide</a></li>
                        <li style="margin: 10px 0;"><a href="#" style="color: #007aff; text-decoration: none;">Support</a></li>
                        <li style="margin: 10px 0;"><a href="#" style="color: #007aff; text-decoration: none;">FAQ</a></li>
                    </ul>
                    <p style="font-size: 16px; text-align: center;">Your account is not activated. Please log in to your account and verify it by ${formattedExpiryDate}.</p>
                    <p style="font-size: 16px; text-align: center;">If you do not confirm your account by ${formattedExpiryDate}, it will be automatically deleted.</p>
                    <p style="font-size: 16px; text-align: center;">If you have any questions, feel free to reach out to our support team.</p>
                    <p style="font-size: 16px; text-align: center;">Thank you,<br>${process.env.SERVICES_NAME} Support Team</p>
                    <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777; text-align: center;">This is an automated message, please do not reply.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send welcome email: ${error.message}`);
        throw new Error('Failed to send welcome email');
    }
}; 


/**
 * Sends a confirmation email to the user after account activation.
 *
 * @param {string} email - The user's email address.
 */
export const sendConfirmedAccountEmail = async (email) => {
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
            subject: 'Your Account is Now Active!',
            text: `Dear ${firstName} ${lastName}, congratulations! Your account is now active.`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h1 style="color: #333; text-align: center;">Your Account is Now Active!</h1>
                    <p style="font-size: 18px; text-align: center;">Dear <strong>${firstName} ${lastName}</strong>,</p>
                    <p style="font-size: 16px; text-align: center;">Congratulations! Your account is now active. You can now log in and start using our services.</p>
                    <p style="font-size: 16px; text-align: center;">If you have any questions, feel free to reach out to our support team.</p>
                    <p style="font-size: 16px; text-align: center;">Thank you,<br>${process.env.SERVICES_NAME} Support Team</p>
                    <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777; text-align: center;">This is an automated message, please do not reply.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send confirmation email: ${error.message}`);
        throw new Error('Failed to send confirmation email');
    }
};



export default { sendWelcomeEmail, sendConfirmedAccountEmail };