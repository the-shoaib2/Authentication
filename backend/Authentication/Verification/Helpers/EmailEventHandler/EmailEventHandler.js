import { sendLoginEmail, sendLogoutEmail } from './LoginLogoutEmailHelpers.js';
import { sendWelcomeEmail, sendConfirmedAccountEmail } from './WelcomeEmailHelpers.js';
import { sendVerificationEmail } from './VerificationCodeEmailHelpers.js';
import { sendDeleteUserEmail } from './DeleteUserEmailHelpers.js';
import { sendRecoverAccountEmail } from './RecoverAccountEmailHelpers.js';


export const handleEmailEvent = async (type, email, code = null) => {
    try {
        switch (type) {
            case 'login':
                await sendLoginEmail(email);
                break;
            case 'logout':
                await sendLogoutEmail(email);
                break;
            case 'verification':
                if (!code) throw new Error('Verification code is required');
                await sendVerificationEmail(email, code);
                break;
            case 'welcome':
                await sendWelcomeEmail(email);
                break;
            case 'confirmation':
                await sendConfirmedAccountEmail(email);
                break;
            case 'deleteUser':
                await sendDeleteUserEmail(email);
                break;
            case 'recoverAccount':
                await sendRecoverAccountEmail(email);
                break;
            default:
                throw new Error('Invalid email event type');
        }
    } catch (error) {
        throw new Error(`Failed to send ${type} email`);
    }
};

export default { handleEmailEvent };
