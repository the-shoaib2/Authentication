const { sendLoginEmail, sendLogoutEmail } = require('./LoginLogoutEmailHelpers');
const { sendWelcomeEmail, sendConfirmedAccountEmail } = require('./WelcomeEmailHelpers');
const { sendVerificationEmail } = require('./VerificationCodeEmailHelpers');
const logger = require('../../../utils/Logger');

const handleEmailEvent = async (type, email, code = null) => {
    try {
        switch (type) {
            case 'login':
                await sendLoginEmail(email);
                logger.info(`Login email sent to ${email}`);
                break;
            case 'logout':
                await sendLogoutEmail(email);
                logger.info(`Logout email sent to ${email}`);
                break;
            case 'verification':
                if (!code) throw new Error('Verification code is required');
                await sendVerificationEmail(email, code);
                logger.info(`Verification email sent to ${email}`);
                break;
            case 'welcome':
                await sendWelcomeEmail(email);
                logger.info(`Welcome email sent to ${email}`);
                break;
            case 'confirmation':
                await sendConfirmedAccountEmail(email);
                logger.info(`Confirmation email sent to ${email}`);
                break;
            default:
                throw new Error('Invalid email event type');
        }
    } catch (error) {
        logger.error(`Failed to send ${type} email to ${email}: ${error.message}`);
        throw new Error(`Failed to send ${type} email`);
    }
};

module.exports = { handleEmailEvent };
