// // frontend/src/pages/Signup.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   handleSuccess,
//   handleError,
//   ToastContainer,
// } from "../utils/ReactToastify";
// import "../utils/ReactToastifyCustom.css";
// import "../utils/style/animations.css";
// import "../utils/loading.css";

// function Signup() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//     dob: {
//       day: "",
//       month: "",
//       year: "",
//     },
//     gender: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [fadeIn, setFadeIn] = useState(true);
//   const [fadeOut, setFadeOut] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       setFadeIn(false);
//     }, 500);
//     return () => clearTimeout(timeoutId);
//   }, []);

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [id]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       handleError("Passwords do not match");
//       return;
//     }

//     setLoading(true);
//     setFadeOut(false);

//     setTimeout(async () => {
//       setFadeOut(true);
//       setTimeout(async () => {
//         try {
//           const response = await fetch("http://localhost:8080/auth/signup", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               firstName: formData.firstName,
//               lastName: formData.lastName,
//               email: formData.email,
//               password: formData.password,
//               confirmPassword: formData.confirmPassword,
//               phone: formData.phone,
//               dob: formData.dob,
//               gender: formData.gender,
//             }),
//           });

//           const result = await response.json();
//           if (response.ok) {
//             localStorage.setItem("token", result.accessToken);
//             localStorage.setItem("refreshToken", result.refreshToken);
//             localStorage.setItem(
//               "loggedInUser",
//               JSON.stringify({
//                 name: `${result.firstName} ${result.lastName}`,
//                 email: result.email,
//               })
//             );

//             handleSuccess("Signup successful!");
//             setTimeout(() => navigate("/home"), 500);
//           } else {
//             if (result.errors) {
//               const errorMessages = result.errors
//                 .map((err) => `${err.field}: ${err.message}`)
//                 .join(", ");
//               handleError(errorMessages);
//             } else {
//               handleError(result.message);
//             }
//           }
//         } catch (err) {
//           handleError("Network error. Please check your connection and try again.");
//         } finally {
//           setLoading(false);
//         }
//       }, 250);
//     }, 1000);
//   };

//   return (
//     <div className={`signup-container container ${fadeIn ? "fade-in" : ""}`}>
//       <img src="/app-icon.ico" alt="App Icon" className="app-icon" />
//       <h1>Sign up</h1>
//       {/* {error && <p className="error-message">{error}</p>}{" "} */}
//       {/* Display error messages */}
//       <form onSubmit={handleSubmit}>
//         {/* Form fields and labels */}
//         <div className="form-group-container">
//           <div className="singup-form-group form-group">
//             <input
//               type="text"
//               id="firstName"
//               placeholder=""
//               value={formData.firstName}
//               onChange={handleChange}
//               required
//             />
//             <label htmlFor="firstName" className="form-label">
//               First Name
//             </label>
//           </div>
//           <div className="singup-form-group form-group">
//             <input
//               type="text"
//               id="lastName"
//               placeholder=""
//               value={formData.lastName}
//               onChange={handleChange}
//               required
//             />
//             <label htmlFor="lastName" className="form-label">
//               Last Name
//             </label>
//           </div>
//         </div>

//         <div className="singup-form-group form-group">
//           <input
//             type="email"
//             id="email"
//             placeholder=""
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           <label htmlFor="email" className="form-label">
//             Email
//           </label>
//         </div>

//         <div className="form-group-container">
//           <div className="form-group">
//             <input
//               className="phone-input"
//               type="tel"
//               id="phone"
//               placeholder=""
//               value={formData.phone}
//               onChange={handleChange}
//               required
//             />
//             <label htmlFor="phone" className="form-label">
//               Phone Number
//             </label>
//           </div>
//           <div className="form-group">
//             <select
//               id="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               required
//             >
//               <option value="" disabled>
//                 Select Gender
//               </option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>
//         </div>

//         <div className="form-group-container">
//           <div className="form-group">
//             <input
//               type="password"
//               id="password"
//               placeholder=""
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//             <label htmlFor="password" className="form-label">
//               Password
//             </label>
//           </div>
//           <div className="form-group">
//             <input
//               type="password"
//               id="confirmPassword"
//               placeholder=""
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//             />
//             <label htmlFor="confirmPassword" className="form-label">
//               Confirm Password
//             </label>
//           </div>
//         </div>

//         <div className="form-group-container dob">
//           <div className="form-group">
//             <select
//               id="dobDay"
//               value={formData.dob.day}
//               onChange={(e) =>
//                 setFormData((prevState) => ({
//                   ...prevState,
//                   dob: { ...prevState.dob, day: e.target.value },
//                 }))
//               }
//               required
//             >
//               <option value="" disabled>
//                 Day
//               </option>
//               {Array.from({ length: 31 }, (_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   {i + 1}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="form-group">
//             <select
//               id="dobMonth"
//               value={formData.dob.month}
//               onChange={(e) =>
//                 setFormData((prevState) => ({
//                   ...prevState,
//                   dob: { ...prevState.dob, month: e.target.value },
//                 }))
//               }
//               required
//             >
//               <option value="" disabled>
//                 Month
//               </option>
//               {Array.from({ length: 12 }, (_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   {new Date(0, i).toLocaleString("default", { month: "long" })}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="form-group">
//             <select
//               id="dobYear"
//               value={formData.dob.year}
//               onChange={(e) =>
//                 setFormData((prevState) => ({
//                   ...prevState,
//                   dob: { ...prevState.dob, year: e.target.value },
//                 }))
//               }
//               required
//             >
//               <option value="" disabled>
//                 Year
//               </option>
//               {Array.from({ length: 100 }, (_, i) => (
//                 <option key={2024 - i} value={2024 - i}>
//                   {2024 - i}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <button className="signup-button" type="submit">
//           Sign up
//         </button>
//         <span>
//           Already have an account?{" "}
//           <Link to="/login" className="pages-link">
//             Login
//           </Link>
//         </span>
//       </form>
//       <span className="terms">
//         By creating an account, you agree to our
//         <Link to="/terms" className="terms-pages-link">
//           {" "}
//           Terms of Use
//         </Link>
//         ,
//         <Link to="/privacy-policy" className="terms-pages-link">
//           {" "}
//           Privacy Policy
//         </Link>
//         .
//       </span>
//       <ToastContainer />
//       {loading && (
//         <div className={`loading-overlay ${fadeOut ? "hidden" : ""}`}>
//           <img
//             src="/apple-loading.gif"
//             alt="Loading..."
//             className="loading-spinner"
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default Signup;














// frontend/src/pages/Signup.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  handleSuccess,
  handleError,
  ToastContainer,
} from "../utils/ReactToastify";
import "../utils/ReactToastifyCustom.css";
import "../utils/style/animations.css";
import "../utils/loading.css";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: {
      day: "",
      month: "",
      year: "",
    },
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFadeIn(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      handleError("Passwords do not match");
      return;
    }

    setLoading(true);
    setFadeOut(false);

    setTimeout(async () => {
      setFadeOut(true);
      setTimeout(async () => {
        try {
          const response = await fetch("http://localhost:8080/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              password: formData.password,
              confirmPassword: formData.confirmPassword,
              phone: formData.phone,
              dob: formData.dob,
              gender: formData.gender,
            }),
          });

          const result = await response.json();
          if (response.ok) {
            // Instead of setting tokens and navigating to home, redirect to verify code page
            handleSuccess("Signup successful! Please verify your email.");
            setTimeout(() => navigate('/verify-email', { state: { token: result.verificationToken } }), 500);
          } else {
            if (result.errors) {
              const errorMessages = result.errors
                .map((err) => `${err.field}: ${err.message}`)
                .join(", ");
              handleError(errorMessages);
            } else {
              handleError(result.message);
            }
          }
        } catch (err) {
          handleError("Network error. Please check your connection and try again.");
        } finally {
          setLoading(false);
        }
      }, 250);
    }, 1000);
  };

  return (
    <div className={`signup-container container ${fadeIn ? "fade-in" : ""}`}>
      <img src="/app-icon.ico" alt="App Icon" className="app-icon" />
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        {/* Form fields and labels */}
        <div className="form-group-container">
          <div className="singup-form-group form-group">
            <input
              type="text"
              id="firstName"
              placeholder=""
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
          </div>
          <div className="singup-form-group form-group">
            <input
              type="text"
              id="lastName"
              placeholder=""
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
          </div>
        </div>

        <div className="singup-form-group form-group">
          <input
            type="email"
            id="email"
            placeholder=""
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="email" className="form-label">
            Email
          </label>
        </div>

        <div className="form-group-container">
          <div className="form-group">
            <input
              className="phone-input"
              type="tel"
              id="phone"
              placeholder=""
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
          </div>
          <div className="form-group">
            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group-container">
          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder=""
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password" className="form-label">
              Password
            </label>
          </div>
          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              placeholder=""
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
          </div>
        </div>

        <div className="form-group-container dob">
          <div className="form-group">
            <select
              id="dobDay"
              value={formData.dob.day}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  dob: { ...prevState.dob, day: e.target.value },
                }))
              }
              required
            >
              <option value="" disabled>
                Day
              </option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <select
              id="dobMonth"
              value={formData.dob.month}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  dob: { ...prevState.dob, month: e.target.value },
                }))
              }
              required
            >
              <option value="" disabled>
                Month
              </option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <select
              id="dobYear"
              value={formData.dob.year}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  dob: { ...prevState.dob, year: e.target.value },
                }))
              }
              required
            >
              <option value="" disabled>
                Year
              </option>
              {Array.from({ length: 100 }, (_, i) => (
                <option key={2024 - i} value={2024 - i}>
                  {2024 - i}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="signup-button" type="submit">
          Sign up
        </button>
        <span>
          Already have an account?{" "}
          <Link to="/login" className="pages-link">
            Login
          </Link>
        </span>
      </form>
      <span className="terms">
        By creating an account, you agree to our
        <Link to="/terms" className="terms-pages-link">
          {" "}
          Terms of Use
        </Link>
        ,
        <Link to="/privacy-policy" className="terms-pages-link">
          {" "}
          Privacy Policy
        </Link>
        .
      </span>
      <ToastContainer />
      {loading && (
                <div className={`loading-overlay ${fadeOut ? 'hidden' : ''}`}>
                    <img src='/apple-loading.gif' alt='Loading...' className='loading-spinner' />
                </div>
      )}
    </div>
  );
}

export default Signup;
