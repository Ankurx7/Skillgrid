import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import IconBtn from "../../Common/IconBtn"

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    if (!courseSectionData.length) return
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData?.[
      currentSectionIndx
    ]?.subSection.findIndex((data) => data._id === subSectionId)
    const activeSubSectionId =
      courseSectionData[currentSectionIndx]?.subSection?.[
        currentSubSectionIndx
      ]?._id
    setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
    setVideoBarActive(activeSubSectionId)
  }, [courseSectionData, courseEntireData, location.pathname])

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r border-gray-300 bg-white text-gray-900 text-[0.7rem] font-medium">
      {}
      <div className="mx-4 flex flex-col border-b border-gray-200 py-4 text-[0.85rem]">
        <div className="flex items-center justify-between">
          <div
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-900 hover:scale-95 transition"
            title="Go Back"
          >
            <IoIosArrowBack size={20} />
          </div>
          <IconBtn
            text="Add Review"
            customClasses="ml-auto text-xs border border-black text-black bg-white hover:bg-gray-100"
            onclick={() => setReviewModal(true)}
          />
        </div>
        <div className="mt-3">
          <p className="font-semibold">{courseEntireData?.courseName}</p>
          <p className="text-[0.7rem] text-gray-500">
            {completedLectures?.length} / {totalNoOfLectures} completed
          </p>
        </div>
      </div>

      {}
      <div className="h-full overflow-y-auto">
        {courseSectionData.map((course, index) => (
          <div key={index}>
            {}
            <div
              onClick={() =>
                setActiveStatus((prev) =>
                  prev === course._id ? "" : course._id
                )
              }
              className="flex justify-between items-center px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
            >
              <span className="w-[80%] truncate font-semibold text-[0.75rem]">
                {course.sectionName}
              </span>
              <span
                className={`transition-transform duration-300 ${
                  activeStatus === course._id ? "rotate-0" : "rotate-180"
                }`}
              >
                <BsChevronDown size={16} />
              </span>
            </div>

            {}
            {activeStatus === course._id && (
              <div className="pl-6 pr-3 py-2">
                {course.subSection.map((topic, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      navigate(
                        `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                      )
                      setVideoBarActive(topic._id)
                    }}
                    className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer ${
                      videoBarActive === topic._id
                        ? "bg-yellow-200 text-black font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={completedLectures.includes(topic?._id)}
                      onChange={() => {}}
                      className="accent-black"
                    />
                    <span className="truncate">{topic.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
