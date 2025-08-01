import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import ReactStars from "react-rating-stars-component"
import { useSelector } from "react-redux"

import { createRating } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../Common/IconBtn"

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setValue("courseExperience", "")
    setValue("courseRating", 0)
  }, [])

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating)
  }

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    )
    setReviewModal(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="w-11/12 max-w-[600px] rounded-md border border-gray-300 bg-white shadow-lg">
        {}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <p className="text-base font-semibold text-gray-800">Add Review</p>
          <button onClick={() => setReviewModal(false)}>
            <RxCross2 className="text-lg text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {}
        <div className="p-5 text-sm text-gray-700">
          {}
          <div className="mb-4 flex items-center gap-3">
            <img
              src={user?.image}
              alt={`${user?.firstName} profile`}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">Posting Publicly</p>
            </div>
          </div>

          {}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex justify-center">
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={22}
                activeColor="#ffd700"
              />
            </div>

            {}
            <div>
              <label
                htmlFor="courseExperience"
                className="mb-1 block text-sm font-medium"
              >
                Your Experience <sup className="text-red-500">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Write your feedback here..."
                {...register("courseExperience", { required: true })}
                className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
                rows={5}
              />
              {errors.courseExperience && (
                <span className="text-xs text-red-500">
                  Please add your experience.
                </span>
              )}
            </div>

            {}
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="rounded-md border border-gray-400 bg-gray-100 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <IconBtn text="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
