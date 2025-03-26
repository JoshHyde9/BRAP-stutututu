import { useEffect } from "react";
import { useSocket } from "@/providers/ws-provider";

type ServerNotificationsProps = {
  serverId: string;
};

export const useServerNotifications = ({
  serverId,
}: ServerNotificationsProps) => {
  const {
    isConnected,
    join,
    leave,
    notifications,
    clearServerNotifications,
    setCurrentServer,
    currentServerId,
  } = useSocket();

  useEffect(() => {
    if (isConnected && serverId) {
      join({ serverId });
    }

    return () => {
      if (isConnected && serverId) {
        leave({ serverId });
      }
    };
  }, [isConnected, serverId, join, leave]);

  return {
    notifications,
    clearServerNotifications,
    setCurrentServer,
    currentServerId,
  };
};
