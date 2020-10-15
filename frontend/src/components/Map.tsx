import React, { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import MapGL, { FlyToInterpolator, ViewState } from "react-map-gl";
import { IP } from "types";
import { IconLayer, PickInfo } from "deck.gl";
import iconAtlas from "../assets/icon-atlas.png";
import { Tooltip } from "./Tooltip";
import { ScatterplotLayer } from "deck.gl";

interface Props {
  selectedIP?: IP;
  onSetSelectedIp(ip: IP): void;
  allIPs: IP[];
}

const defaultMapState = {
  latitude: 39.8097343,
  longitude: -98.5556199,
  zoom: 4,
};

const ICON_MAPPING = {
  cloud: { x: 0, y: 0, width: 160, height: 128, mask: true },
  tor: { x: 160, y: 0, width: 128, height: 128, mask: true },
  marker: { x: 288, y: 0, width: 96, height: 128, mask: true },
  anon: { x: 384, y: 0, width: 128, height: 128, mask: true },
};

export const Map: React.FC<Props> = (props) => {
  const { selectedIP, onSetSelectedIp, allIPs } = props;

  const [viewport, setViewport] = useState<ViewState>(defaultMapState);
  const [hovered, setHovered] = useState<PickInfo<IP>>();

  const onViewportChanged = (viewport: ViewState) => {
    setViewport(viewport);
  };

  useEffect(() => {
    if (!(selectedIP?.location.latitude && selectedIP.location.longitude)) {
      setViewport(defaultMapState);
    } else {
      const { latitude, longitude } = selectedIP.location;
      setViewport((current) => ({
        ...current,
        latitude: latitude,
        longitude: longitude,
        zoom: 5,
        transitionDuration: 1500,
        transitionInterpolator: new FlyToInterpolator(),
      }));
    }
  }, [selectedIP]);

  const iconPointLayer = new IconLayer<IP>({
    id: "all-ips",
    data: allIPs,
    pickable: true,
    iconAtlas: iconAtlas,
    iconMapping: ICON_MAPPING,
    sizeScale: 15,
    getPosition: (ip) => [ip.location.longitude, ip.location.latitude],
    getSize: () => 3,
    getColor: () => [255, 0, 0],
    getIcon: () => "marker",
    onHover: (info: PickInfo<IP>) => setHovered(info),
    onClick: (info: PickInfo<IP>) => {
      info.object && onSetSelectedIp(info.object);
    },
  });

  const radiusLayer = new ScatterplotLayer<IP>({
    id: "confidence-radius",
    data: hovered?.object ? [hovered.object] : [],
    pickable: false,
    radiusUnits: "meters",
    getPosition: (ip) => [ip.location.longitude, ip.location.latitude],
    getLineColor: () => [255, 0, 0],
    getFillColor: () => [255, 0, 0, 75],
    getRadius: (ip) => ip.location.accuracyRadius * 1000,
  });

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
      <DeckGL viewState={viewport} layers={[radiusLayer, iconPointLayer]}>
        {hovered?.object && (
          <Tooltip
            ip={hovered.object}
            style={{ left: hovered.x, top: hovered.y }}
          />
        )}
      </DeckGL>
    </MapGL>
  );
};
