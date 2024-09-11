import { Check, X } from "lucide-react";
import '../assets/style/ExtensionStyle/PasswordStrengthMeter.css';

const PasswordCriteria = ({ password }) => {
	const criteria = [
		{ label: "At least 8 characters", met: password.length >= 8 },
		{ label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
		{ label: "Contains lowercase letter", met: /[a-z]/.test(password) },
		{ label: "Contains a number", met: /\d/.test(password) },
		{ label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
	];

	return (
		<div className='password-criteria'>
			{criteria.map((item) => (
				<div key={item.label} className='criteria-item'>
					{item.met ? (
						<Check className='icon check' />
					) : (
						<X className='icon x' />
					)}
					<span className={item.met ? "strong-text" : "text-gray-500"}>{item.label}</span>
				</div>
			))}
		</div>
	);
};

const PasswordStrengthMeter = ({ password }) => {
	const getStrength = (pass) => {
		let strength = 0;
		if (pass.length >= 8) strength++;
		if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
		if (pass.match(/\d/)) strength++;
		if (pass.match(/[^a-zA-Z\d]/)) strength++;
		return strength;
	};

	const strength = getStrength(password);

	const getColorClass = (strength) => {
		if (strength === 0) return "weak";
		if (strength === 1) return "weak";
		if (strength === 2) return "fair";
		if (strength === 3) return "good";
		return "strong";
	};

	const getStrengthText = (strength) => {
		if (strength === 0) return "Very Weak";
		if (strength === 1) return "Weak";
		if (strength === 2) return "Fair";
		if (strength === 3) return "Good";
		return "Strong";
	};

	return (
		<div className='meter'>
			<div className='meter-header'>
				<span>Password Strength</span>
				<span className={`text-sm font-medium ${strength >= 3 ? "strong-text" : strength >= 2 ? "text-yellow-600" : "weak-text"}`}>
					{getStrengthText(strength)}
				</span>
			</div>

			<div className='meter-bar'>
				{[...Array(4)].map((_, index) => (
					<div
						key={index}
						className={index < strength ? `h-2 ${getColorClass(strength)}` : "bg-gray-300"}
					/>
				))}
			</div>
			<PasswordCriteria password={password} />
		</div>
	);
};

export default PasswordStrengthMeter;
