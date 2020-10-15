import React, { useEffect, useMemo, useState } from "react";
import DeckGL from "@deck.gl/react";
import MapGL, { FlyToInterpolator, ViewState } from "react-map-gl";
import { IP } from "types";
import { IconLayer, PickInfo, RGBAColor } from "deck.gl";
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

const getColor = (accuracy?: number, fill?: boolean): RGBAColor => {
  let val: RGBAColor = [255, 0, 0];
  if (!accuracy || accuracy > 500) {
    val = [244, 67, 54];
  } else if (accuracy > 100) {
    val = [63, 81, 181];
  } else if (accuracy > 25) {
    val = [255, 193, 7];
  } else {
    val = [76, 175, 80];
  }
  if (fill) val.push(75);
  return val;
};

const getZoom = (accuracy?: number) => {
  if (!accuracy || accuracy > 500) {
    return 5;
  }
  if (accuracy > 100) {
    return 7;
  }
  if (accuracy > 25) {
    return 8;
  }
  return 9;
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
      const { latitude, longitude, accuracyRadius } = selectedIP.location;
      setViewport((current) => ({
        ...current,
        latitude: latitude,
        longitude: longitude,
        zoom: getZoom(accuracyRadius),
        transitionDuration: 1500,
        transitionInterpolator: new FlyToInterpolator(),
      }));
    }
  }, [selectedIP]);

  const visibleIPs = useMemo(() => allIPs.filter((ip) => !ip.hidden), [allIPs]);

  const iconPointLayer = new IconLayer<IP>({
    id: "all-ips",
    data: visibleIPs,
    pickable: true,
    iconAtlas: iconAtlas,
    iconMapping: ICON_MAPPING,
    sizeScale: 15,
    getPosition: (ip) => [ip.location.longitude, ip.location.latitude],
    getSize: () => 3,
    getColor: (ip) => getColor(ip.location.accuracyRadius),
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
    getFillColor: (ip) => getColor(ip.location.accuracyRadius, true),
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
