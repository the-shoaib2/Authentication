import transporter from './EmailTransporter.js';
import User from '../../../Models/UserModel.js';

/**
 * Sends a recover account notification email to the user.
 *
 * @param {string} email - The user's email address.
 */
export const sendRecoverAccountEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const { first_name: firstName, last_name: lastName } = user;

        const mailOptions = {
            from: process.env.SERVICES_EMAIL,
            to: email,
            subject: 'Account Recovery Notification',
            text: `Dear ${firstName} ${lastName}, your account has been successfully recovered.`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h1 style="color: #333;">Account Recovery Notification</h1>
                    <p>Dear <strong>${firstName} ${lastName}</strong>,</p>
                    <p>Your account has been successfully recovered. You can now log in and continue using our services.</p>
                    <p>Thank you,<br>${process.env.SERVICES_NAME} Support Team</p>
                    <hr>
                    <p style="font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Recover account email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send recover account email: ${error.message}`);
        throw new Error('Failed to send recover account email');
    }
};

export default { sendRecoverAccountEmail };
