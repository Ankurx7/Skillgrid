import { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { sendOtp } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../slices/authSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";

function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { firstName, lastName, email, password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const signupData = { ...formData, accountType };
    dispatch(setSignupData(signupData));
    dispatch(sendOtp(formData.email, navigate));

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setAccountType(ACCOUNT_TYPE.STUDENT);
  };

  return (
    <motion.div
      className="w-full max-w-[460px] mx-auto p-6 md:p-8 bg-white border border-gray-200 shadow-lg rounded-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <h2 className="text-[18px] font-semibold text-center text-neutral-800 mb-5">
        Create Your Account
      </h2>

      <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-4 text-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <label className="w-full">
            <p className="text-[12px] font-medium text-gray-800 mb-1">
              First Name <span className="text-red-600">*</span>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="John"
              className="w-full border border-gray-300 px-3 py-1.5 rounded text-[13px] focus:outline-none focus:border-black"
            />
          </label>
          <label className="w-full">
            <p className="text-[12px] font-medium text-gray-800 mb-1">
              Last Name <span className="text-red-600">*</span>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Doe"
              className="w-full border border-gray-300 px-3 py-1.5 rounded text-[13px] focus:outline-none focus:border-black"
            />
          </label>
        </div>

        <label className="w-full">
          <p className="text-[12px] font-medium text-gray-800 mb-1">
            Email <span className="text-red-600">*</span>
          </p>
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="you@example.com"
            className="w-full border border-gray-300 px-3 py-1.5 rounded text-[13px] focus:outline-none focus:border-black"
          />
        </label>

        <div className="flex flex-col md:flex-row gap-4">
          <label className="relative w-full">
            <p className="text-[12px] font-medium text-gray-800 mb-1">
              Password <span className="text-red-600">*</span>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 px-3 py-1.5 rounded text-[13px] focus:outline-none focus:border-black pr-10"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
            >
              {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
            </span>
          </label>

          <label className="relative w-full">
            <p className="text-[12px] font-medium text-gray-800 mb-1">
              Confirm Password <span className="text-red-600">*</span>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 px-3 py-1.5 rounded text-[13px] focus:outline-none focus:border-black pr-10"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
            </span>
          </label>
        </div>

      {}
          <div className="flex justify-center gap-4 mb-6">
            {[
              { label: "Student", value: ACCOUNT_TYPE.STUDENT },
              { label: "Educator", value: ACCOUNT_TYPE.INSTRUCTOR },
            ].map((option) => {
              const isSelected = accountType === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setAccountType(option.value)}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-medium border rounded-md transition-all duration-200 ${
                    isSelected
                      ? "bg-red-500 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {isSelected && <span className="text-white">✓</span>}
                  {option.label}
                </button>
              );
            })}
          </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 text-[13px] font-medium rounded hover:opacity-90 transition duration-200"
        >
          Create Account
        </button>
      </form>
    </motion.div>
  );
}

export default SignupForm;
