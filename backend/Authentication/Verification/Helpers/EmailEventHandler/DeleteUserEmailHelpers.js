import transporter from './EmailTransporter.js';
import User from '../../../Models/UserModel.js';

/**
 * Sends a delete user notification email to the user.
 *
 * @param {string} email - The user's email address.
 */
export const sendDeleteUserEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const { first_name: firstName, last_name: lastName } = user;

        const mailOptions = {
            from: process.env.SERVICES_EMAIL,
            to: email,
            subject: 'Account Deletion Notification',
            text: `Dear ${firstName} ${lastName}, your account has been successfully deleted.`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h1 style="color: #333;">Account Deletion Notification</h1>
                    <p>Dear <strong>${firstName} ${lastName}</strong>,</p>
                    <p>Your account has been successfully deleted. If you have any questions, please contact our support team.</p>
                    <p>Thank you,<br>${process.env.SERVICES_NAME} Support Team</p>
                    <hr>
                    <p style="font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Delete user email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send delete user email: ${error.message}`);
        throw new Error('Failed to send delete user email');
    }
};

export default { sendDeleteUserEmail };
