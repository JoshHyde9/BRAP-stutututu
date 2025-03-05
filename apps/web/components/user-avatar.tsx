import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";

type UserAvatarProps = {
  src?: string | null;
  name: string;
  className?: string;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  className,
}) => {
  return (
    <Avatar className={cn("size-7 md:size-10", className)}>
      <AvatarImage src={src as string} />
      <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
