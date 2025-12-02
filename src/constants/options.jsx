export const SelectTravelList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A sole travelers in exploration",
    icon: "✈️",
    people: "1 person",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Two travelers in tandem",
    icon: "🥂",
    people: "2 people",
  },
  {
    id: 3,
    title: "Family",
    desc: "A group of fun loving adv",
    icon: "🏡",
    people: "3 to 5 People",
  },
  {
    id: 4,
    title: "Friends",
    desc: "A bunch of thrill-seekers",
    icon: "⛵",
    people: "5 to 10 people",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of costs",
    icon: "💵",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Keep cost on the average side",
    icon: "💰",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Don't worry about cost",
    icon: "💸",
  },
];

export const AI_PROMPT = `CRITICAL INSTRUCTION: You must create a travel plan exclusively for {location}. Do not substitute with any other destination.

CREATE TRAVEL PLAN FOR: {location}
DURATION: {totalDays} days
TRAVELERS: {traveler}
BUDGET CATEGORY: {budget}

MANDATORY REQUIREMENTS:
- All hotels must be actually located in {location}
- All attractions must be actually located in {location}
- All places must have real addresses in {location}
- Use accurate geo-coordinates for {location} only
- Do not use placeholder or example data from other cities

REQUIRED OUTPUT STRUCTURE:
1. HOTELS SECTION:
   - Hotel Name (real hotels in {location})
   - Complete Hotel Address in {location}
   - Price range appropriate for {budget} budget
   - Hotel image URL (use placeholder format)
   - Accurate geo coordinates (latitude, longitude) for {location}
   - Rating (1-5 scale)
   - Detailed description

2. DAILY ITINERARY FOR {totalDays} DAYS:
   For each day provide:
   - Place Name (real places in {location})
   - Detailed Place Description
   - Place Image URL (use placeholder format)
   - Accurate Geo Coordinates for the place in {location}
   - Ticket/Entry Pricing in local currency
   - Rating (1-5 scale)
   - Best time to visit
   - Estimated travel time between locations

TARGET LOCATION: {location}
VERIFY: All content must be relevant to {location} specifically.

Return response in clean JSON format without markdown formatting, code blocks, or backticks.`