import React from 'react';
import '../assets/style/PagesStyle/AgreementStyle/TermsPrivacy.css'; 
import '../assets/style/styleutils/animations.css'; // Import animations

function TermsOfUse() {
    return (
        <div className="terms-privacy-container fade-in"> {/* Added fade-in class */}
            <div className="terms-of-use-content-wrapper fade-in-bottom"> {/* Added smooth animation */}
                <h1>Terms of Use</h1>
                <p>
                    Welcome to our application. By using our services, you agree to the following terms:
                </p>
                <ol>
                    <li>
                        <strong>Acceptance of Terms:</strong> By accessing or using our services, you agree to be bound by these terms.
                    </li>
                    <li>
                        <strong>User Responsibilities:</strong> You are responsible for your account and all activities that occur under your account.
                    </li>
                    <li>
                        <strong>Content Ownership:</strong> You retain ownership of any content you submit, but you grant us a license to use it.
                    </li>
                    <li>
                        <strong>Termination:</strong> We may terminate or suspend your access if you violate these terms.
                    </li>
                </ol>
                <p>
                    For more details, please read our full terms of use.
                </p>
            </div>
        </div>
    );
}

export default TermsOfUse;
