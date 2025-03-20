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
    joinServer,
    leaveServer,
    notifications,
    clearServerNotifications,
  } = useSocket();

  useEffect(() => {
    if (isConnected && serverId) {
      joinServer(serverId);
    }

    return () => {
      if (isConnected && serverId) {
        leaveServer(serverId);
      }
    };
  }, [isConnected, serverId, joinServer, leaveServer]);

  return { notifications, clearServerNotifications };
};
