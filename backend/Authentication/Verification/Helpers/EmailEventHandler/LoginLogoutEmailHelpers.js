import transporter from './EmailTransporter.js';
import User from '../../../Models/UserModel.js';

/**
 * Sends a login notification email to the user.
 *
 * @param {string} email - The user's email address.
 */
export const sendLoginEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const { first_name: firstName, last_name: lastName } = user;

        const mailOptions = {
            from: process.env.SERVICES_EMAIL,
            to: email,
            subject: 'Login Notification',
            text: `Dear ${firstName} ${lastName}, you have successfully logged in.`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h1 style="color: #333; text-align: center;">Login Notification</h1>
                    <p style="font-size: 18px; text-align: center;">Dear <strong>${firstName} ${lastName}</strong>,</p>
                    <p style="font-size: 16px; text-align: center;">You have successfully logged in to your account.</p>
                    <p style="font-size: 16px; text-align: center;">If this wasn't you, please contact our support team immediately.</p>
                    <p style="font-size: 16px; text-align: center;">Thank you,<br>${process.env.SERVICES_NAME} Support Team</p>
                    <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777; text-align: center;">This is an automated message, please do not reply.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Login email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send login email: ${error.message}`);
        throw new Error('Failed to send login email');
    }
};

/**
 * Sends a logout notification email to the user.
 *
 * @param {string} email - The user's email address.
 */
export const sendLogoutEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const { first_name: firstName, last_name: lastName } = user;

        const mailOptions = {
            from: process.env.SERVICES_EMAIL,
            to: email,
            subject: 'Logout Notification',
            text: `Dear ${firstName} ${lastName}, you have successfully logged out.`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h1 style="color: #333; text-align: center;">Logout Notification</h1>
                    <p style="font-size: 18px; text-align: center;">Dear <strong>${firstName} ${lastName}</strong>,</p>
                    <p style="font-size: 16px; text-align: center;">You have successfully logged out of your account.</p>
                    <p style="font-size: 16px; text-align: center;">If this wasn't you, please contact our support team immediately.</p>
                    <p style="font-size: 16px; text-align: center;">Thank you,<br>${process.env.SERVICES_NAME} Support Team</p>
                    <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777; text-align: center;">This is an automated message, please do not reply.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Logout email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send logout email: ${error.message}`);
        throw new Error('Failed to send logout email');
    }
};

export default { sendLoginEmail, sendLogoutEmail };
