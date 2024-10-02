import React, { useEffect } from 'react';
import '../assets/style/PagesStyle/AgreementStyle/TermsPrivacy.css';
import '../assets/style/styleutils/animations.css'; // Import animations

function PrivacyPolicy() {
    const handleComponentMount = () => {
   
    };

    useEffect(() => {
        handleComponentMount();
    }, []);

    return (
        <div className="terms-privacy-container fade-in"> {/* Added fade-in class */}
            <div className="privacy-policy-content-wrapper fade-in-bottom"> {/* Added smooth animation */}
                <h1>Privacy Policy</h1>
                <p>
                    Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                </p>
                <ol>
                    <li>
                        <strong>Information We Collect:</strong> We collect information you provide directly, such as your name and email address.
                    </li>
                    <li>
                        <strong>How We Use Your Information:</strong> We use your information to provide and improve our services.
                    </li>
                    <li>
                        <strong>Data Security:</strong> We implement reasonable security measures to protect your information.
                    </li>
                    <li>
                        <strong>Your Rights:</strong> You have the right to access, correct, or delete your personal information.
                    </li>
                </ol>
                <p>
                    For more details, please read our full privacy policy.
                </p>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
