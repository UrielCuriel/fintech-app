"use client";
import { Avatar } from "@/components/avatar";
import { Dropdown, DropdownButton, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu } from "@/components/dropdown";
import { Navbar, NavbarDivider, NavbarItem, NavbarLabel, NavbarSection, NavbarSpacer } from "@/components/navbar";
import { Sidebar, SidebarBody, SidebarHeader, SidebarItem, SidebarLabel, SidebarSection } from "@/components/sidebar";
import { AlertContainer } from "@/components/alertContainer";
import { StackedLayout } from "@/components/stacked-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Banner } from "@/components/banner";
import { faCog, faInbox, faSignOut } from "@fortawesome/pro-duotone-svg-icons";
import { faSearch, faUser, faShieldCheck, faLightbulb } from "@fortawesome/pro-light-svg-icons";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
const navItems = [
  { label: "Dashboard", url: "/dashboard" },
  { label: "Settings", url: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, logout } = useUser();
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (user?.otp_enabled) {
      setShowBanner(false);
    }
  }, [user]);

  return (
    <StackedLayout
      navbar={
        <Navbar>
          <NavbarSection className="max-lg:hidden">
            <Avatar src="/logo.svg" className="dark:invert w-5 h-5" />
            <NavbarLabel>FINTECH</NavbarLabel>
          </NavbarSection>

          <NavbarDivider className="max-lg:hidden" />
          <NavbarSection className="max-lg:hidden">
            {navItems.map(({ label, url }) => (
              <NavbarItem key={label} href={url} current={pathname === url}>
                {label}
              </NavbarItem>
            ))}
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href="/search" aria-label="Search">
              <FontAwesomeIcon icon={faSearch} />
            </NavbarItem>
            <NavbarItem href="/inbox" aria-label="Inbox">
              <FontAwesomeIcon icon={faInbox} />
            </NavbarItem>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src={`https://api.dicebear.com/9.x/lorelei/webp?seed=${user?.email}`} square />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="bottom end">
                <DropdownItem href="/dashboard/profile">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/dashboard/settings">
                  <FontAwesomeIcon icon={faCog} className="mr-2" />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  <FontAwesomeIcon icon={faShieldCheck} className="mr-2" />
                  <DropdownLabel>Privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="#">
                  <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                  <DropdownLabel>Share feedback</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={logout}>
                  <FontAwesomeIcon icon={faSignOut} className="mr-2" />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center">
              <Avatar src="/logo.svg" className="dark:invert w-5 h-5 mr-2" />
              <SidebarLabel>FINTECH</SidebarLabel>
            </div>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({ label, url }) => (
                <SidebarItem key={label} href={url}>
                  {label}
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      <AlertContainer />
      {showBanner && <Banner type="warning" message="you have not enabled two-factor authentication" actionText="Enable now" actionLink="/dashboard/profile" onClose={() => setShowBanner(false)} />}

      {children}
    </StackedLayout>
  );
}
