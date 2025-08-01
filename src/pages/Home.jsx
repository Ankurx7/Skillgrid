import React, { useEffect, useState } from "react";
import { FaPlay, FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";

import Chatbot from "../components/Common/Chatbot";
import Footer from "../components/Common/Footer";
import CourseSlider from "../components/core/Catalog/Course_Slider";
import { getAllCourses } from "../services/operations/courseDetailsAPI";

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const result = await getAllCourses();
        if (result) {
          setCourses(result.slice(0, 7));
        }
      } catch (error) {

      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  return (
    <div
      className="min-h-screen bg-white overflow-x-hidden text-gray-100"
      data-app-name="Skillgrid"
    >
        <div className="bg-blue-100 text-black text-center text-xs py-1 px-2">
          SkillGrid is built to empower your learning journey — combining expert content, seamless design, and AI-assisted support to help you grow smarter, faster.
        </div>
      {}
      <div
        className="relative w-full h-[40vh] min-h-[320px] bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        {}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        {}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="w-full max-w-3xl mx-auto text-center px-4">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
              Master{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Skills
              </span>
              <br />
              Build{" "}
              <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
                Career
              </span>
            </h1>
            <p className="text-sm md:text-base text-white font-light mb-5">
              Learn from industry experts and transform your future with
              hands-on projects
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/signup"
                className="group relative px-5 py-2 bg-gradient-to-r from-red-400 to-blue-300 text-white text-xs font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                <span className="flex items-center gap-2 justify-center">
                  <FaRocket className="group-hover:animate-bounce text-xs" />
                  Start Learning
                </span>
              </Link>
              <Link
                to="/login"
                className="group px-5 py-2 border border-white/30 text-white text-xs font-semibold rounded-full backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-inner"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="text-center text-xs text-gray-600 px-4 bg-red-100 italic">
        ⚠️ Note: Backend is hosted on Render's free tier — initial responses may
        be slightly slow.
      </div>

      {}
      <div className="relative bg-gradient-to-b from-white via-gray-100 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 w-full">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-purple-500"></div>
            </div>
          ) : (
            <CourseSlider Courses={courses} />
          )}
        </div>
      </div>

      {}
      <Footer />

      {}
      <Chatbot />
    </div>
  );
}

export default Home;
