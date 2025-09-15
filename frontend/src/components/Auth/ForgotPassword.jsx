import { useState } from "react";
import Loader from "../Templates/Loader";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Toast from "../Templates/Toast";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../lib/apiClient";
import { FORGOT_PASSWORD_ROUTE } from "../../utils/constants";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast((prevToast) => ({ ...prevToast, show: false })),
      3000
    );
  };

  const handleVerify = async (phoneNumber) => {
    if (
      phoneNumber.length !== 10 ||
      !/^[6-9]\d{9}$/.test(phoneNumber) ||
      phoneNumber.startsWith("0") ||
      phoneNumber == ""
    ) {
      if (phoneNumber == "") {
        showToast("Please enter a valid phone number or email", "error");
      }
      console.log("email verification");
    } else {
      phoneNumber = "+91" + phoneNumber;
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {
              console.log("reCAPTCHA verified");
            },
          }
        );
        await window.recaptchaVerifier.render();
      }
      try {
        setLoading(true);
        const confirmation = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          window.recaptchaVerifier
        );
        window.confirmationResult = confirmation;
        setOtpSent(true);
        setLoading(false);
        showToast("OTP sent successfully", "success");
      } catch (error) {
        showToast(
          error.response?.data?.message ||
            error.message ||
            "An error occurred during phone number verification.",
          "error"
        );
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = async (otp, newPassword) => {
    try {
      setLoading(true);
      const result = await window.confirmationResult.confirm(otp);
      const verifiedPhone = result.user.phoneNumber;

      await result.user.delete();

      await apiClient.post(FORGOT_PASSWORD_ROUTE, {
        phone: verifiedPhone,
        password: newPassword,
      });

      showToast("Password reset successfully", "success");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          error.message ||
          "An error occurred during account login.",
        "error"
      );
      setLoading(false);
    }
  };

  return (
    <div className="absolute text-gray-600 inset-0 bg-black bg-opacity-15 backdrop-blur-md flex items-center justify-center">
      <div className="w-[80%] lg:w-1/3 bg-white border-orange-700 rounded-xl p-4 px-8">
        <h1 className="text-center mb-5 text-3xl font-bold text-orange-700">
          Forgot Password
        </h1>
        <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="relative flex flex-col gap-1">
              <label htmlFor="phone">
                Username
                <span className="text-red-500">*</span>
              </label>
              <input
                className="bg-gray-200 p-1 px-2 rounded-md outline-none"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your phone number or email"
                required
              />
            </div>
            {/* <div className="relative flex items-center"> */}
            <div
              className={`${otpSent ? "relative flex items-center" : "hidden"}`}
            >
              <label htmlFor="otp">
                OTP
                <span className="text-red-500">*</span> :
              </label>
              <input
                className="bg-gray-200 w-20 p-1 px-2 ml-2 rounded-md outline-none lg:w-36"
                type="text"
                id="otp"
                value={otp}
                maxLength="6"
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button
              type="button"
              className=" relative left-[90%] w-10 text-orange-700 flex items-center"
              onClick={() => handleVerify(username)}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-orange-700 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Verify"
              )}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">
              New Password
              <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-200 p-1 px-2 rounded-md outline-none"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-orange-700 text-white py-2 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
      {/* {loading ? <Loader /> : <div></div>} */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          show={toast.show}
        />
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
}

export default ForgotPassword;
