import { useCallback, useState } from 'react';
import cityTimezones from 'city-timezones';

const ALL_CITIES = cityTimezones.cityMapping;

export type City = {
  city: string;
  country: string;
  timezone: string;
};

export const searchCities = (query: string): City[] => {
  if (query.length < 2) return [];
  const q = query.toLowerCase().trim();
  return ALL_CITIES
    .filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    )
    .slice(0, 20)
    .map((c) => ({ city: c.city, country: c.country, timezone: c.timezone }));
};

export function useCitySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    setResults(searchCities(text));
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return { query, results, handleSearch, clear };
}
