import { SidebarProfile } from "../module/profile";
import LayoutMain from "./LayoutMain";

function LayoutProfile({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <LayoutMain className={className}>
      <SidebarProfile></SidebarProfile>
      {children}
    </LayoutMain>
  );
}

export default LayoutProfile;
