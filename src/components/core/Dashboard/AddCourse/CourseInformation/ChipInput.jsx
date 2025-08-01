
import { useEffect, useState } from "react"

import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

export default function ChipInput({

  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)

  const [chips, setChips] = useState([])

  useEffect(() => {
    if (editCourse) {
      setChips(course?.tag)
    }
    register(name, { required: true, validate: (value) => value.length > 0 })
  }, [editCourse, course?.tag, name, register])

  useEffect(() => {
    setValue(name, chips)
  }, [chips, name, setValue])

  const handleKeyDown = (event) => {

    if (event.key === "Enter" || event.key === ",") {

      event.preventDefault()

      const chipValue = event.target.value.trim()

      if (chipValue && !chips.includes(chipValue)) {

        const newChips = [...chips, chipValue]
        setChips(newChips)
        event.target.value = ""
      }
    }
  }

  const handleDeleteChip = (chipIndex) => {

    const newChips = chips.filter((_, index) => index !== chipIndex)
    setChips(newChips)
  }

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-900" htmlFor={name}>
        {label} <span className="text-red-500">*</span>
      </label>
      
      {/* Chips Container */}
      <div className="min-h-[50px] p-3 border border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20 transition-all duration-200">
        <div className="flex flex-wrap gap-2 mb-2">
          {/* Existing Chips */}
          {chips.map((chip, index) => (
            <div
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
            >
              <span className="font-medium">{chip}</span>
              <button
                type="button"
                className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                onClick={() => handleDeleteChip(index)}
              >
                <MdClose className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Input Field */}
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="w-full border-none outline-none bg-transparent text-gray-900 placeholder-gray-500"
        />
      </div>
      
      {/* Error Message */}
      {errors[name] && (
        <span className="text-sm text-red-500 flex items-center">
          {label} is required
        </span>
      )}
    </div>
  )
}
