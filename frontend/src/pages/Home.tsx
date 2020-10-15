import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { CollapsableDialog, Map, IPForm, IPMenu, Loading } from "components";
import { IP } from "types";
import { request } from "../utils";
import { usePersistentState } from "hooks";

const endpoint = `${process.env.REACT_APP_API_URL ?? ""}/ip/search`;

export const Home: React.FC = () => {
  const [currentIp, setCurrentIp] = useState<IP>();
  const [allIps, setAllIps] = usePersistentState<IP[]>("allIps", []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuExpanded, setMenuExpanded] = useState(true);

  const onSearchIP = async (ip: string) => {
    setLoading(true);
    setError("");
    setAllIps((existing) => existing.filter((e) => e.traits.ipAddress !== ip));
    const params = new URLSearchParams({ ip });
    try {
      const ip = await request<IP>(`${endpoint}?${params}`);
      if (!(ip.location.latitude && ip.location.longitude)) {
        throw new Error("Unable to locate IP");
      }
      setCurrentIp(ip);
      setAllIps((allIps) => [ip, ...allIps]);
      setLoading(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const onRemoveIp = useCallback(
    (ip: IP) => {
      setAllIps((existing) =>
        existing.filter(
          (exist) => exist.traits.ipAddress !== ip.traits.ipAddress
        )
      );
    },
    [setAllIps]
  );

  const onToggleIpVisible = useCallback(
    (ip: IP) => {
      setAllIps((existing) =>
        existing.map((e) => ({
          ...e,
          hidden:
            e.traits.ipAddress === ip.traits.ipAddress ? !e.hidden : e.hidden,
        }))
      );
    },
    [setAllIps]
  );

  const onSetCurrentIP = useCallback(
    (ip: IP) => {
      if (window.matchMedia("(max-width: 450px)").matches) {
        setMenuExpanded(false);
      }
      setCurrentIp(ip);
    },
    [setCurrentIp]
  );

  return (
    <Wrapper>
      {loading && <Loading />}
      <CollapsableDialog
        title="IP Locate"
        collapsed={!!currentIp && allIps.length > 0}
        menuExpanded={menuExpanded}
        setMenuExpanded={setMenuExpanded}
      >
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <IPForm onSubmit={(ip) => onSearchIP(ip)} />
        <IPMenu
          ips={allIps}
          onRemoveIp={onRemoveIp}
          onSetCurrentIp={onSetCurrentIP}
          onToggleIpVisible={onToggleIpVisible}
        />
      </CollapsableDialog>
      <Map
        selectedIP={currentIp}
        onSetSelectedIp={onSetCurrentIP}
        allIPs={allIps}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  flex: 1;
  overflow-y: hidden;
  position: relative;
  width: 100%;
  height: 100%;
`;

const ErrorMsg = styled.p`
  margin: 0.5rem 0;
  color: red;
`;
