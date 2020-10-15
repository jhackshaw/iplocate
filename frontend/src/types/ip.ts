import {
  ContinentRecord,
  CityRecord,
  CountryRecord,
  TraitsRecord,
  LocationRecord,
} from "@maxmind/geoip2-node";

export interface IP {
  continent: Partial<ContinentRecord>;
  country: Partial<CountryRecord>;
  city: Partial<CityRecord>;
  location: LocationRecord;
  traits: Partial<TraitsRecord>;
  hidden?: boolean;
}
