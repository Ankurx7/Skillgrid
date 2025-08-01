import { useSelector } from "react-redux"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

function Template({ title, description1, description2, formType }) {
  const { loading } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen w-full bg-gray-100 px-4 pt-1 flex justify-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="w-full max-w-[500px] bg-white rounded-md shadow-lg px-6 py-8">
          {}
          <div className="text-center mb-6">
            <h1 className="text-black text-2xl font-bold">{title}</h1>
            <p className="text-gray-600 text-sm mt-2">
              {description1}{" "}
              <span className="font-semibold text-yellow-500">{description2}</span>
            </p>
          </div>

          {}
          {formType === "signup" ? <SignupForm /> : <LoginForm />}
        </div>
      )}
    </div>
  )
}

export default Template
