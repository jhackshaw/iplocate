import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { CollapsableDialog, Map, CardHeader, IPForm, IPMenu } from "components";
import { IP } from "types";
import { request } from "../utils";
import { usePersistentState } from "hooks";

const endpoint = `${process.env.REACT_APP_API_URL ?? ""}/ip/search`;

export const Home: React.FC = (props) => {
  const [currentIp, setCurrentIp] = useState<IP>();
  const [allIps, setAllIps] = usePersistentState<IP[]>("allIps", []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSearchIP = async (ip: string) => {
    setLoading(false);
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
    [allIps, setAllIps]
  );

  return (
    <Wrapper>
      {loading && null}
      <CollapsableDialog collapsed={!!currentIp && allIps.length > 0}>
        <CardHeader>Locate IP Address</CardHeader>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <IPForm onSubmit={(ip) => onSearchIP(ip)} />
        <IPMenu
          ips={allIps}
          onRemoveIp={onRemoveIp}
          onSetCurrentIp={setCurrentIp}
          onToggleIpVisible={onToggleIpVisible}
        />
      </CollapsableDialog>
      <Map
        selectedIP={currentIp}
        onSetSelectedIp={setCurrentIp}
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
