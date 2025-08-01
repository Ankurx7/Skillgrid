import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../../services/operations/authAPI"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(login(email, password, navigate))
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-8 py-6 px-6 w-full max-w-sm mx-auto flex flex-col gap-3 border border-black rounded-lg shadow-sm bg-white"
    >
      <h2 className="text-[18px] font-semibold text-center text-neutral-800 mb-2">
        Log In
      </h2>

      {}
      <label className="text-xs text-gray-600 flex flex-col gap-1">
        Email Address <sup className="text-red-500">*</sup>
        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email"
          className="rounded bg-gray-100 text-sm px-3 py-1.5 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-300"
        />
      </label>

      {}
      <label className="text-xs text-gray-600 flex flex-col gap-1 relative">
        Password <sup className="text-red-500">*</sup>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter password"
          className="rounded bg-gray-100 text-sm px-3 py-1.5 border border-gray-300 placeholder:text-gray-400 pr-9 focus:outline-none focus:ring-1 focus:ring-yellow-300"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-[30px] cursor-pointer"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible size={16} />
          ) : (
            <AiOutlineEye size={16} />
          )}
        </span>

        <Link
          to="/forgot-password"
          className="text-[0.65rem] text-blue-600 mt-1 self-end hover:underline"
        >
          Forgot Password?
        </Link>
      </label>

      {}
      <button
        type="submit"
        className="mt-1 rounded bg-yellow-300 text-sm font-medium py-1.5 hover:bg-yellow-400 transition-all"
      >
        Sign In
      </button>
    </form>
  )
}

export default LoginForm
