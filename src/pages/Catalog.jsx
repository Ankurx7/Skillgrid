import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import Course_Card from "../components/core/Catalog/Course_Card"
import { apiConnector } from "../services/apiConnector"
import { categories } from "../services/apis"
import { getCatalogPageData } from "../services/operations/pageAndComponntDatas"
import Error from "./Error"

function Catalog() {
  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")

  useEffect(() => {
    (async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        const category_id = res?.data?.data?.find(
          (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
        )?._id
        setCategoryId(category_id)
      } catch (error) {
        }
    })()
  }, [catalogName])

  useEffect(() => {
    if (categoryId) {
      (async () => {
        try {
          const res = await getCatalogPageData(categoryId)
          setCatalogPageData(res)
        } catch (error) {
          }
      })()
    }
  }, [categoryId])

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  return (
    <div className="mx-auto box-content w-full max-w-maxContentTab px-2 py-6 lg:max-w-maxContent">
      <div className="section_heading text-lg sm:text-xl">
        {catalogPageData?.data?.selectedCategory?.name}
      </div>

      <div className="py-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {catalogPageData?.data?.selectedCategory?.courses?.map((course, index) => (
          <Course_Card key={index} course={course} Height="h-[240px]" />
        ))}
      </div>
    </div>
  )
}

export default Catalog
