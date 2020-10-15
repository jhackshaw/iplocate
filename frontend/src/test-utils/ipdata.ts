import { IP } from "types";

export const baseIP: IP = {
  continent: {
    code: "EU",
    geonameId: 6255148,
    names: {
      en: "Europe",
    },
  },
  country: {
    geonameId: 3017382,
    isInEuropeanUnion: true,
    isoCode: "FR",
    names: {
      en: "France",
    },
  },
  traits: {
    isAnonymous: false,
    isAnonymousProxy: false,
    isAnonymousVpn: false,
    isHostingProvider: false,
    isLegitimateProxy: false,
    isPublicProxy: false,
    isResidentialProxy: false,
    isSatelliteProvider: false,
    isTorExitNode: false,
    ipAddress: "2.2.2.2",
    network: "2.2.0.0/18",
  },
  city: {},
  location: {
    accuracyRadius: 500,
    latitude: 48.8582,
    longitude: 2.3387,
    timeZone: "Europe/Paris",
  },
};
