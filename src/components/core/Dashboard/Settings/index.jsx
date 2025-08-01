import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"

export default function Settings() {
  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-900">
        Edit Profile
      </h1>
      {}
      <ChangeProfilePicture />
      {}
      <EditProfile />
      {}
      <DeleteAccount />
    </>
  )
}
