export const usStates = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
]
export const sectors = [
    "Professional and business services",
    "Educational services, health care, and social assistance",
    "Finance, insurance, real estate, rental, and leasing",
    "Others",
    "Agriculture, forestry, fishing, and hunting",
    "Arts, entertainment, recreation, accommodation, and food services",
    "Information",
    "Utilities",
    "Manufacturing",
    "Government",
    "Construction",
    "Transportation and Warehousing",
    "Wholesale and Retail Trade",
    "Real estate and rental and leasing",
    "Mining"
]
export const visaTypes = [
    "H-1B",
    "H-2A",
    "E-3 Australian",
    "H-2B",
    "H-1B1 Singapore",
    "H-1B1 Chile"
]
export const years = Array.from({ length: 2022 - 2010 + 1 }, (_, i) => (i + 2010).toString());
export const filterNames = ["State", "Visa", "Sector"];
export const enumsArr = [usStates, visaTypes, sectors];
export const sankeyFilters = ["Visa", "Sector", "Year"];
export const sankeyEnumsArr = [visaTypes, sectors, years];