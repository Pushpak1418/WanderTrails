export type PlatformId = "makemytrip" | "skyscanner" | "booking" | "agoda" | "irctc"

export interface BookingPlatform {
  id: PlatformId
  name: string
  type: "flight" | "train" | "bus" | "hotel" | "mixed"
  /**
   * URL template with placeholders like {destination}, {start}, {end}.
   * All inserted values will be URL-encoded.
   */
  urlTemplate: string
}

export const BOOKING_PLATFORMS: Record<PlatformId, BookingPlatform> = {
  makemytrip: {
    id: "makemytrip",
    name: "MakeMyTrip",
    type: "mixed",
    // Generic search with destination as text query
    urlTemplate: "https://www.makemytrip.com/flights/?cmp=AI_WANDERTRAILS&query={destination}+travel+{start}",
  },
  skyscanner: {
    id: "skyscanner",
    name: "Skyscanner",
    type: "flight",
    urlTemplate: "https://www.skyscanner.net/transport/flights-from/{destination}?outboundDate={start}",
  },
  booking: {
    id: "booking",
    name: "Booking.com",
    type: "hotel",
    urlTemplate: "https://www.booking.com/searchresults.html?ss={destination}&checkin_year_month_day={start}&checkout_year_month_day={end}",
  },
  agoda: {
    id: "agoda",
    name: "Agoda",
    type: "hotel",
    urlTemplate: "https://www.agoda.com/search?city={destination}&checkIn={start}&checkOut={end}",
  },
  irctc: {
    id: "irctc",
    name: "IRCTC Trains",
    type: "train",
    urlTemplate: "https://www.irctc.co.in/nget/train-search",
  },
}

export interface BuildUrlParams {
  platformId: PlatformId
  destination: string
  start?: string
  end?: string
}

export function buildPlatformUrl({ platformId, destination, start, end }: BuildUrlParams): string {
  const platform = BOOKING_PLATFORMS[platformId]
  if (!platform) return "#"

  const encode = (value: string | undefined | null) =>
    value && value.trim() ? encodeURIComponent(value.trim()) : ""

  let url = platform.urlTemplate
  url = url.replace(/{destination}/g, encode(destination))
  url = url.replace(/{start}/g, encode(start))
  url = url.replace(/{end}/g, encode(end))

  return url
}
