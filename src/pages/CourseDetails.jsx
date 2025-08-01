import React, { useEffect, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ConfirmationModal from "../components/Common/ConfirmationModal";
import Footer from "../components/Common/Footer";
import RatingStars from "../components/Common/RatingStars";
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import { formatDate } from "../services/formatDate";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import { BuyCourse } from "../services/operations/studentFeaturesAPI";
import GetAvgRating from "../utils/avgRating";
import Error from "./Error";

function CourseDetails() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { courseId } = useParams();
  const [response, setResponse] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [isActive, setIsActive] = useState([]);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCourseDetails(courseId);
        setResponse(res);
      } catch (error) {

      }
    })();
  }, [courseId]);

  useEffect(() => {
    const count = GetAvgRating(response?.data?.courseDetails?.ratingAndReviews);
    setAvgReviewCount(count);
  }, [response]);

  useEffect(() => {
    let lectures = 0;
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec?.subSection?.length || 0;
    });
    setTotalNoOfLectures(lectures);
  }, [response]);

  const handleActive = (id) => {
    setIsActive(
      isActive.includes(id)
        ? isActive.filter((e) => e !== id)
        : isActive.concat([id])
    );
  };

  const handleBuyCourse = () => {
    if (token) {
      BuyCourse(token, [courseId], user, navigate, dispatch);
    } else {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to purchase this course.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
    }
  };

  if (loading || !response) {
    return (
      <div className="grid min-h-screen place-items-center bg-gray-50">
        <div className="loader"></div>
      </div>
    );
  }

  if (!response.success) {
    return <Error />;
  }

  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnroled,
    createdAt,
  } = response.data?.courseDetails;

  if (paymentLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-gray-50">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
        <div className="flex flex-col gap-6 lg:flex-row mt-8 px-4">
          {}
          <div className="w-full lg:w-[40%]">
            <CourseDetailsCard
              course={response?.data?.courseDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>

          {}
          <div className="w-full lg:w-[60%] space-y-6 text-gray-800 text-sm leading-normal">

            {}
            <div className="bg-white p-4 rounded-lg shadow-sm space-y-1">
              <h1 className="text-lg font-semibold">{courseName}</h1>
              <div className="flex flex-wrap items-center gap-x-4 text-xs text-gray-600">
                <span><b>By:</b> {`${instructor?.firstName} ${instructor?.lastName}`}</span>
                <span>•</span>
                <span>{studentsEnroled.length} students</span>
                <span>•</span>
                <span>{formatDate(createdAt)}</span>
                <span>•</span>
                <span>
                  <RatingStars Review_Count={avgReviewCount} Star_Size={16} />
                  ({avgReviewCount.toFixed(1)})
                </span>
              </div>
            </div>

            {}
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h2 className="text-base font-semibold mb-2">What you'll learn</h2>
              <ReactMarkdown className="text-sm leading-relaxed text-gray-700">
                {whatYouWillLearn}
              </ReactMarkdown>
            </div>

            {}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-base font-semibold mb-2">Course Content</h2>

              <div className="flex justify-between text-xs mb-2 text-gray-600">
                <div className="flex flex-wrap gap-3">
                  <span>{courseContent.length} sections</span>
                  <span>{totalNoOfLectures} lectures</span>
                  <span>{response.data?.totalDuration} total length</span>
                </div>
                <button
                  className="text-blue-600 hover:underline text-xs"
                  onClick={() => setIsActive([])}
                >
                  Collapse all
                </button>
              </div>

              {}
              <div className="space-y-2">
                {courseContent?.map((course, index) => (
                  <CourseAccordionBar
                    key={index}
                    course={course}
                    isActive={isActive}
                    handleActive={handleActive}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

export default CourseDetails;
