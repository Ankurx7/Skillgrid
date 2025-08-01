import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud, FiX } from "react-icons/fi"

import "video-react/dist/video-react.css"
import { Player } from "video-react"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )
  const inputRef = useRef(null)

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      previewFile(file)
      setSelectedFile(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
  })

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  useEffect(() => {
    register(name, { required: true })
  }, [register, name])

  useEffect(() => {
    setValue(name, selectedFile)
  }, [selectedFile, setValue, name])

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900" htmlFor={name}>
        {label} {!viewData && <span className="text-red-500">*</span>}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
          isDragActive 
            ? "border-blue-400 bg-blue-50" 
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        } ${previewSource ? "p-0" : "p-8"}`}
      >
        {previewSource ? (
          <div className="relative">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="rounded-lg overflow-hidden">
                <Player aspectRatio="16:9" playsInline src={previewSource} />
              </div>
            )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("")
                  setSelectedFile(null)
                  setValue(name, null)
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 transition-all duration-200"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-12 cursor-pointer"
            {...getRootProps()}
          >
            <input {...getInputProps()} ref={inputRef} />
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FiUploadCloud className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-center">
              <p className="text-gray-900 font-medium mb-1">
                Drop your {!video ? "image" : "video"} here, or{" "}
                <span className="text-blue-600 font-semibold">browse</span>
              </p>
              <p className="text-gray-500 text-sm">
                {!video ? "PNG, JPG up to 10MB" : "MP4 up to 100MB"}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
              <span>• Aspect ratio 16:9</span>
              <span>• Recommended size 1024x576</span>
            </div>
          </div>
        )}
      </div>
      
      {errors[name] && (
        <span className="text-sm text-red-500 flex items-center">
          {label} is required
        </span>
      )}
    </div>
  )
}
