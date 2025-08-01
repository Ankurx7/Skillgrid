import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import "video-react/dist/video-react.css"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../Common/IconBtn"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!courseSectionData.length) return
    if (!courseId && !sectionId && !subSectionId) {
      navigate(`/dashboard/enrolled-courses`)
    } else {
      const filteredData = courseSectionData.filter(
        (course) => course._id === sectionId
      )
      const filteredVideoData = filteredData?.[0]?.subSection.filter(
        (data) => data._id === subSectionId
      )
      setVideoData(filteredVideoData[0])
      setPreviewSource(courseEntireData.thumbnail)
      setVideoEnded(false)
    }
  }, [courseSectionData, courseEntireData, location.pathname])

  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)
    return currentSectionIndx === 0 && currentSubSectionIndx === 0
  }

  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)
    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    )
  }

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)
    const isLastSubsection =
      currentSubSectionIndx ===
      courseSectionData[currentSectionIndx].subSection.length - 1

    if (!isLastSubsection) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSection = courseSectionData[currentSectionIndx + 1]
      if (nextSection) {
        const nextSectionId = nextSection._id
        const nextSubSectionId = nextSection.subSection[0]._id
        navigate(
          `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
        )
      }
    }
  }

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx > 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else if (currentSectionIndx > 0) {
      const prevSection = courseSectionData[currentSectionIndx - 1]
      const prevSubSection = prevSection.subSection[
        prevSection.subSection.length - 1
      ]
      navigate(
        `/view-course/${courseId}/section/${prevSection._id}/sub-section/${prevSubSection._id}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4 bg-white p-4 text-gray-900 text-sm min-h-screen rounded-md">
      <div className="w-full max-w-[800px] mx-auto">
        {!videoData ? (
          <img
            src={previewSource}
            alt="Preview"
            className="h-[450px] w-full rounded-md object-cover"
          />
        ) : (
          <div className="relative h-[450px]">
            <Player
              ref={playerRef}
              aspectRatio="16:9"
              playsInline
              onEnded={() => setVideoEnded(true)}
              src={videoData?.videoUrl}
            >
              <BigPlayButton position="center" />
              {videoEnded && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-black via-black/60 to-transparent text-white">
                  {!completedLectures.includes(subSectionId) && (
                    <IconBtn
                      disabled={loading}
                      onclick={handleLectureCompletion}
                      text={!loading ? "Mark as Completed" : "Loading..."}
                      customClasses="text-sm px-3 py-2"
                    />
                  )}
                  <IconBtn
                    onclick={() => {
                      playerRef.current?.seek(0)
                      setVideoEnded(false)
                    }}
                    text="Rewatch"
                    customClasses="text-sm px-3 py-2"
                  />
                  <div className="mt-6 flex gap-4 text-sm">
                    {!isFirstVideo() && (
                      <button
                        onClick={goToPrevVideo}
                        disabled={loading}
                        className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
                      >
                        Prev
                      </button>
                    )}
                    {!isLastVideo() && (
                      <button
                        onClick={goToNextVideo}
                        disabled={loading}
                        className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}
            </Player>
          </div>
        )}
      </div>

      <div className="w-full max-w-[800px] mx-auto">
        <h1 className="mt-4 text-xl font-semibold">{videoData?.title}</h1>
        <p className="text-sm leading-6 text-gray-700">{videoData?.description}</p>
      </div>
    </div>
  )
}

export default VideoDetails
