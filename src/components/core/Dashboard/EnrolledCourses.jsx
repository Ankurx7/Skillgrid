import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getUserEnrolledCourses(token);
        const filterPublishCourse = res.filter((ele) => ele.status !== "Draft");
        setEnrolledCourses(filterPublishCourse);
      } catch (error) {

      }
    })();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Enrolled Courses
      </h2>

      {!enrolledCourses ? (
        <div className="grid min-h-[30vh] place-items-center">
          <div className="spinner" />
        </div>
      ) : !enrolledCourses.length ? (
        <p className="text-center text-sm text-gray-500">
          You haven’t enrolled in any course yet.
        </p>
      ) : (
        <div className="text-sm text-gray-800">
          {}
          <div className="flex rounded-t-lg bg-gray-100 font-medium text-gray-700">
            <p className="w-[45%] px-4 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>

          {}
          {enrolledCourses.map((course, i, arr) => (
            <div
              key={i}
              className={`flex items-center border border-gray-200 bg-white ${
                i === arr.length - 1 ? "rounded-b-lg" : ""
              }`}
            >
              {}
              <div
                className="flex w-[45%] cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50"
                onClick={() => {
                  navigate(
                    `/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  );
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-12 w-12 rounded object-cover"
                />
                <div className="flex flex-col gap-1 max-w-xs">
                  <p className="font-medium">{course.courseName}</p>
                  <p className="text-xs text-gray-500">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              {}
              <div className="w-1/4 px-2 py-3">{course.totalDuration}</div>

              {}
              <div className="flex w-1/5 flex-col gap-1 px-2 py-3">
                <p className="text-xs text-gray-600">
                  Progress: {course.progressPercentage || 0}%
                </p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="6px"
                  isLabelVisible={false}
                  baseBgColor="#e5e7eb"
                  bgColor="#3b82f6"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
