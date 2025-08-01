import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { formattedDate } from "../../../utils/dateFormatter";
import IconBtn from "../../Common/IconBtn";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <>
      <h1 className="mb-10 text-2xl font-bold text-blue-800">My Profile</h1>

      {}
      <div className="flex items-center justify-between rounded-md border border-gray-300 bg-white shadow-sm p-4 px-6">
        <div className="flex items-center gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-16 rounded-full border-2 border-blue-500 object-cover"
          />
          <div className="space-y-[2px]">
            <p className="text-base font-semibold text-blue-800">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-xs text-gray-600">{user?.email}</p>
          </div>
        </div>
        <IconBtn
          text="Edit"
          onclick={() => navigate("/dashboard/settings")}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {}
      <div className="my-6 flex flex-col gap-y-6 rounded-md border border-gray-300 bg-white shadow-sm p-4 px-6">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-blue-800">Personal Details</p>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <div className="flex max-w-lg justify-between">
          <div className="flex flex-col gap-y-3">
            <div>
              <p className="text-xs text-gray-600">First Name</p>
              <p className="text-sm font-medium text-gray-800">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Email</p>
              <p className="text-sm font-medium text-gray-800">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Gender</p>
              <p className="text-sm font-medium text-gray-800">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-3">
            <div>
              <p className="text-xs text-gray-600">Last Name</p>
              <p className="text-sm font-medium text-gray-800">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Phone Number</p>
              <p className="text-sm font-medium text-gray-800">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Date Of Birth</p>
              <p className="text-sm font-medium text-gray-800">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ?? "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
