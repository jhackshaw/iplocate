import React, { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import MapGL, { FlyToInterpolator, ViewState } from "react-map-gl";
import { IP } from "types";

interface Props {
  selectedIP?: IP;
}

const defaultMapState = {
  latitude: 39.8097343,
  longitude: -98.5556199,
  zoom: 4,
};

export const Map: React.FC<Props> = (props) => {
  const { selectedIP } = props;

  const [viewport, setViewport] = useState<ViewState>(defaultMapState);

  const onViewportChanged = (viewport: ViewState) => {
    setViewport(viewport);
  };

  useEffect(() => {
    if (!selectedIP) {
      setViewport(defaultMapState);
    } else {
      const { latitude, longitude } = selectedIP;
      setViewport((current) => ({
        ...current,
        latitude: latitude,
        longitude: longitude,
        zoom: 14,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
      }));
    }
  }, [selectedIP]);

  return (
    <MapGL
      {...viewport}
      width="100%"
      height="100%"
      maxPitch={0}
      onViewportChange={onViewportChanged}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      doubleClickZoom={false}
      disableTokenWarning
    >
      <DeckGL viewState={viewport}></DeckGL>
    </MapGL>
  );
};
