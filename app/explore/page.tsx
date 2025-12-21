import React from "react"
import ExploreClient from "@/components/explore-client"

// Force dynamic so Vercel doesn't prerender this page at build time using static generation.
export const dynamic = "force-dynamic"

export default function ExplorePage() {
  return (
    <React.Fragment>
      <ExploreClient />
    </React.Fragment>
  )
}
