import { FaCheck } from "react-icons/fa"
import { useSelector } from "react-redux"

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm"
import CourseInformationForm from "./CourseInformation/CourseInformationForm"
import PublishCourse from "./PublishCourse"

export default function RenderSteps() {
  const { step } = useSelector((state) => state.course)

  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ]

  return (
    <>
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="relative flex items-center justify-between">
          {steps.map((item, index) => (
            <div key={item.id} className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div className="relative z-10 flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-semibold transition-all duration-300 ${
                    step === item.id
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                      : step > item.id
                      ? "bg-green-600 border-green-600 text-white"
                      : "bg-white border-gray-300 text-gray-500"
                  }`}
                >
                  {step > item.id ? (
                    <FaCheck className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold">{item.id}</span>
                  )}
                </div>
              </div>
              
              {/* Step Title */}
              <div className="mt-3 text-center">
                <p
                  className={`text-sm font-medium ${
                    step >= item.id ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {item.title}
                </p>
              </div>
              
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-6 left-1/2 w-full h-0.5 -z-10 transition-all duration-300 ${
                    step > item.id ? "bg-green-600" : "bg-gray-300"
                  }`}
                  style={{ 
                    marginLeft: '3rem',
                    width: 'calc(100% - 6rem)'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="mt-8">
        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm />}
        {step === 3 && <PublishCourse />}
      </div>
    </>
  )
}
