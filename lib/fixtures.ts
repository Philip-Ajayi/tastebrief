import { CityPair } from '@/types';

// Curated query configurations for quick operator selection (no mock data payloads)
export const PRESET_CITY_PAIRS: CityPair[] = [
  {
    id: 'lisbon-berlin',
    destinationCity: 'Lisbon',
    destinationCountry: 'Portugal',
    destinationQuery: 'Lisbon, Portugal',
    originCity: 'Berlin',
    originCountry: 'Germany',
    originQuery: 'Berlin, Germany',
    venueType: 'café_wine_bar',
    baselineTags: ['coffee', 'wine_bar', 'pet_nat', 'pastry'],
  },
  {
    id: 'tokyo-paris',
    destinationCity: 'Tokyo',
    destinationCountry: 'Japan',
    destinationQuery: 'Tokyo, Japan',
    originCity: 'Paris',
    originCountry: 'France',
    originQuery: 'Paris, France',
    venueType: 'cocktail_lounge',
    baselineTags: ['craft_cocktail', 'whisky_bar', 'small_plates'],
  },
  {
    id: 'mexico-newyork',
    destinationCity: 'Mexico City',
    destinationCountry: 'Mexico',
    destinationQuery: 'Mexico City, Mexico',
    originCity: 'New York',
    originCountry: 'United States',
    originQuery: 'New York, USA',
    venueType: 'bistro',
    baselineTags: ['mezcal', 'contemporary_mexican', 'artisan_bakery'],
  },
  {
    id: 'london-austin',
    destinationCity: 'London',
    destinationCountry: 'United Kingdom',
    destinationQuery: 'London, United Kingdom',
    originCity: 'Austin',
    originCountry: 'United States',
    originQuery: 'Austin, USA',
    venueType: 'boutique_hotel',
    baselineTags: ['specialty_coffee', 'craft_beer', 'vinyl_lounge'],
  },
];