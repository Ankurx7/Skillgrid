import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdAdd, MdClose } from "react-icons/md";

export default function RequirementsField({
  name,
  label,
  register,
  setValue,
  errors,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course);
  const [requirement, setRequirement] = useState("");
  const [requirementsList, setRequirementsList] = useState([]);

  useEffect(() => {
    if (editCourse) {
      setRequirementsList(course?.instructions || []);
    }
    register(name, { required: true, validate: (value) => value.length > 0 });
  }, [editCourse, course?.instructions, name, register]);

  useEffect(() => {
    setValue(name, requirementsList);
  }, [requirementsList, name, setValue]);

  const handleAddRequirement = () => {
    if (requirement.trim()) {
      setRequirementsList([...requirementsList, requirement.trim()]);
      setRequirement("");
    }
  };

  const handleRemoveRequirement = (index) => {
    const updatedRequirements = [...requirementsList];
    updatedRequirements.splice(index, 1);
    setRequirementsList(updatedRequirements);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRequirement();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900" htmlFor={name}>
        {label} <span className="text-red-500">*</span>
      </label>
      
      {/* Input Section */}
      <div className="flex gap-2">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-all duration-200"
          placeholder={`Add a ${label.toLowerCase()}`}
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 flex items-center justify-center"
        >
          <MdAdd className="w-5 h-5" />
        </button>
      </div>

      {/* Requirements List */}
      {requirementsList.length > 0 && (
        <div className="mt-4 space-y-2">
          {requirementsList.map((req, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <span className="text-gray-900 flex-1">{req}</span>
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                className="ml-3 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 transition-all duration-200"
              >
                <MdClose className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {errors[name] && (
        <span className="text-sm text-red-500 flex items-center">
          {label} is required
        </span>
      )}
    </div>
  );
}
