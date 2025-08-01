import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaClock } from "react-icons/fa";
import RatingStars from "../../Common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";

function Course_Card({ course, Height }) {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
  }, [course]);

  return (
    <Link to={`/courses/${course._id}`} className="block group">
      <div className="rounded-xl overflow-hidden border border-[#2a2a2a] bg-gradient-to-br from-[#1a1a1a] to-[#101010] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">

        {}
        <div className="relative">
          <img
            src={course?.thumbnail}
            alt="course thumbnail"
            className={`w-full ${Height} object-cover transition-transform duration-300 group-hover:scale-105`}
          />
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold bg-[#2f2f2f] text-white shadow-sm">
            ₹{course?.price}
          </div>
        </div>

        {}
        <div className="p-4 space-y-2">

          {}
          <h3 className="text-[#f5f5f5] text-[15px] font-semibold leading-tight line-clamp-2 group-hover:text-cyan-300 transition-colors">
            {course?.courseName}
          </h3>

          {}
          <p className="text-xs text-[#b0b0b0]">
            <span className="text-[#cccccc]">by</span>{" "}
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </p>

          {}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-white font-semibold">{avgReviewCount || 0}</span>
            <RatingStars Review_Count={avgReviewCount} />
            <span className="text-gray-400">({course?.ratingAndReviews?.length || 0})</span>
          </div>

          {}
          <div className="flex items-center justify-between text-[12px] text-[#aaaaaa] border-t border-[#333] pt-3 mt-3">
            <div className="flex items-center gap-2">
              <FaUsers className="text-[#cccccc] text-xs" />
              {course?.studentsEnrolled?.length || 0}
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-[#cccccc] text-xs" />
              {course?.totalDuration || "Self-paced"}
            </div>
          </div>

          {}
          <div className="mt-3 flex justify-between items-center">
            <span className="text-lg font-bold text-white">
              ₹{course?.price}
            </span>
            <span className="px-2 py-[2px] text-[11px] font-medium rounded-full bg-[#1f1f1f] text-[#dddddd] border border-[#333]">
              {course?.category?.name || "Course"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Course_Card;
