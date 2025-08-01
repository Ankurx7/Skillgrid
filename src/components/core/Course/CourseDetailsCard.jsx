import React from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../../slices/cartSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { thumbnail: ThumbnailImage, price: CurrentPrice, _id: courseId } = course;

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("Instructors cannot purchase courses.");
      return;
    }
    if (token) {
      dispatch(addToCart(course));
      return;
    }
    setConfirmationModal({
      text1: "Not logged in!",
      text2: "Please log in to add this course to your cart.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  return (
    <div className="bg-[#1b1b1b] text-[#dddddd] rounded-xl shadow-md p-4 space-y-4 w-full max-w-sm md:max-w-md">

      {}
      <div className="w-full h-48 md:h-56 overflow-hidden rounded-lg">
        <img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {}
      <div className="text-2xl font-semibold text-white">
        ₹{CurrentPrice}
      </div>

      {}
      <div className="flex flex-col gap-2 text-sm">
        <button
          onClick={
            user && course?.studentsEnroled.includes(user?._id)
              ? () => navigate("/dashboard/enrolled-courses")
              : handleBuyCourse
          }
          className="bg-[#00c2ff] hover:bg-[#00b2e6] text-black font-semibold py-2 rounded-md transition duration-300"
        >
          {user && course?.studentsEnroled.includes(user?._id)
            ? "Go To Course"
            : "Buy Now"}
        </button>

        {(!user || !course?.studentsEnroled.includes(user?._id)) && (
          <button
            onClick={handleAddToCart}
            className="bg-[#333333] hover:bg-[#444444] text-white py-2 rounded-md transition duration-300"
          >
            Add to Cart
          </button>
        )}

        <button
          onClick={handleShare}
          className="text-xs text-[#999999] hover:text-white transition duration-300"
        >
          Share this course
        </button>
      </div>
    </div>
  );
}

export default CourseDetailsCard;
