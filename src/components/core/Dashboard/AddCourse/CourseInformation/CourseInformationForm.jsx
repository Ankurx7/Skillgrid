import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import IconBtn from "../../../../Common/IconBtn";
import Upload from "../Upload";
import ChipInput from "./ChipInput";
import RequirementsField from "./RequirementsField";

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const categories = await fetchCourseCategories();
        if (categories.length > 0) {
          setCourseCategories(categories);
        }
      } catch (error) {
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnail);
    }

    getCategories();
  }, [editCourse, course, setValue]);

  const isFormUpdated = () => {
    const currentValues = getValues();
    return (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !== course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("courseName", data.courseTitle);
      formData.append("courseDescription", data.courseShortDesc);
      formData.append("price", data.coursePrice);
      formData.append("tag", JSON.stringify(data.courseTags));
      formData.append("whatYouWillLearn", data.courseBenefits);
      formData.append("category", data.courseCategory);
      formData.append("status", COURSE_STATUS.DRAFT);
      formData.append("instructions", JSON.stringify(data.courseRequirements));
      formData.append("thumbnailImage", data.courseImage);

      let result;
      if (editCourse) {
        if (isFormUpdated()) {
          formData.append("courseId", course._id);
          result = await editCourseDetails(formData, token);
        } else {
          toast.error("No changes made to the form");
          setLoading(false);
          return;
        }
      } else {
        result = await addCourseDetails(formData, token);
      }

      if (result) {
        dispatch(setStep(2));
        dispatch(setCourse(result));
      }
    } catch (error) {
      toast.error("Failed to save course details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Information</h2>
        <p className="text-gray-600">Fill in the basic details about your course</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Course Title */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900" htmlFor="courseTitle">
            Course Title <span className="text-red-500">*</span>
          </label>
          <input
            id="courseTitle"
            placeholder="Enter an engaging course title"
            {...register("courseTitle", { required: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-all duration-200"
          />
          {errors.courseTitle && (
            <span className="text-sm text-red-500 flex items-center">
              Course title is required
            </span>
          )}
        </div>

        {/* Course Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900" htmlFor="courseShortDesc">
            Course Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="courseShortDesc"
            placeholder="Write a compelling description that highlights what students will learn"
            {...register("courseShortDesc", { required: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 resize-none min-h-[120px] focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-all duration-200"
          />
          {errors.courseShortDesc && (
            <span className="text-sm text-red-500 flex items-center">
              Course description is required
            </span>
          )}
        </div>

        {/* Course Price and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Price */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900" htmlFor="coursePrice">
              Course Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="coursePrice"
                placeholder="0"
                {...register("coursePrice", {
                  required: true,
                  valueAsNumber: true,
                  pattern: {
                    value: /^(0|[1-9]\d*)(\.\d+)?$/,
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 pl-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-all duration-200"
              />
              <HiOutlineCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
            </div>
            {errors.coursePrice && (
              <span className="text-sm text-red-500 flex items-center">
                Course price is required
              </span>
            )}
          </div>

          {/* Course Category */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900" htmlFor="courseCategory">
              Course Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("courseCategory", { required: true })}
              defaultValue=""
              id="courseCategory"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-all duration-200"
            >
              <option value="" disabled className="text-gray-500">
                Choose a Category
              </option>
              {!loading &&
                courseCategories?.map((category) => (
                  <option key={category._id} value={category._id} className="text-gray-900">
                    {category.name}
                  </option>
                ))}
            </select>
            {errors.courseCategory && (
              <span className="text-sm text-red-500 flex items-center">
                Course category is required
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        <ChipInput
          label="Tags"
          name="courseTags"
          placeholder="Enter relevant tags and press Enter"
          register={register}
          errors={errors}
          setValue={setValue}
          getValues={getValues}
        />

        {/* Course Thumbnail */}
        <Upload
          name="courseImage"
          label="Course Thumbnail"
          register={register}
          setValue={setValue}
          errors={errors}
          editData={editCourse ? course.thumbnail : null}
        />

        {/* Course Benefits */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900" htmlFor="courseBenefits">
            Benefits of the Course <span className="text-red-500">*</span>
          </label>
          <textarea
            id="courseBenefits"
            placeholder="Describe the key benefits and outcomes students will gain from this course"
            {...register("courseBenefits", { required: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 resize-none min-h-[120px] focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-all duration-200"
          />
          {errors.courseBenefits && (
            <span className="text-sm text-red-500 flex items-center">
              Course benefits are required
            </span>
          )}
        </div>

        {/* Requirements */}
        <RequirementsField
          name="courseRequirements"
          label="Requirements/Instructions"
          register={register}
          setValue={setValue}
          errors={errors}
          getValues={getValues}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
          {editCourse && (
            <button
              type="button"
              onClick={() => dispatch(setStep(2))}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue Without Saving
            </button>
          )}
          <IconBtn
            disabled={loading}
            text={!editCourse ? "Next Step" : "Save Changes"}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <MdNavigateNext className="w-5 h-5" />
          </IconBtn>
        </div>
      </form>
    </div>
  );
}
