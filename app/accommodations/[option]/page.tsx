import React from "react"
import AccommodationSearch from "../../../components/accommodation-search"

export default function Page({ params }: { params: { option: string } }) {
  const option = params.option || "accommodation"

  return (
    <main style={{ padding: 20 }}>
      <h1>Find {option}</h1>
      <p>Enter a destination to see {option} suggestions and booking links.</p>
      <AccommodationSearch optionType={option} />
    </main>
  )
}
