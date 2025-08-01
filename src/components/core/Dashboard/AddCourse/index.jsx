import RenderSteps from "./RenderSteps"

export default function AddCourse() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Create New Course
            </h1>
            <p className="text-gray-600 text-lg">
              Share your knowledge with students around the world
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <RenderSteps />
          </div>
        </div>
      </div>
    </>
  )
}
