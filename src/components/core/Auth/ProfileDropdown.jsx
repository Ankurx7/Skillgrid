import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import {
  VscDashboard,
  VscSignOut,
  VscVm,
  VscAdd,
  VscMortarBoard
} from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import useOnClickOutside from "../../../hooks/useOnClickOutside"
import { logout } from "../../../services/operations/authAPI"
import { ACCOUNT_TYPE } from "../../../utils/constants"

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))

  if (!user) return null

  const instructorLinks = [
    { name: "Dashboard", path: "/dashboard/instructor", icon: <VscDashboard className="text-lg" /> },
    { name: "My Courses", path: "/dashboard/my-courses", icon: <VscVm className="text-lg" /> },
    { name: "Add Course", path: "/dashboard/add-course", icon: <VscAdd className="text-lg" /> },
  ]

  const studentLinks = [
    { name: "Joined Courses", path: "/dashboard/enrolled-courses", icon: <VscMortarBoard className="text-lg" /> },
  ]

  const commonLinks = [
    { name: "My Profile", path: "/dashboard/my-profile", icon: <VscDashboard className="text-lg" /> },
  ]

  const roleLinks =
    user.accountType === ACCOUNT_TYPE.INSTRUCTOR ? instructorLinks : studentLinks

  return (
    <button className="relative" onClick={() => setOpen(true)}>
      <div className="flex items-center gap-x-1">
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        <AiOutlineCaretDown className="text-sm text-richblack-100" />
      </div>

      {open && (
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[120%] left-1/2 -translate-x-1/2 z-[1000] min-w-[180px] divide-y divide-richblack-700 overflow-hidden rounded-md border border-richblack-700 bg-richblack-800 shadow-lg"
        >
          {[...roleLinks, ...commonLinks].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-x-2 px-3 py-2 text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
                {link.icon}
                {link.name}
              </div>
            </Link>
          ))}

          <div
            onClick={() => {
              dispatch(logout(navigate))
              setOpen(false)
            }}
            className="flex items-center gap-x-2 px-3 py-2 text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 cursor-pointer"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </button>
  )
}
