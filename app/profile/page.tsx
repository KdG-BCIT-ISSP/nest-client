"use client";
export const dynamic = "force-dynamic";

import SideMenu from "@/components/SideMenu";
import ProfileInputField from "@/components/ProfileInputField";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";
import { useState, useEffect, Suspense } from "react";
import { ProfileDataType } from "@/types/ProfileDataType";
import SavedPosts from "@/components/profile/SavedPosts";
import ResetPasswordField from "@/components/profile/ResetPasswordField";
import MyPosts from "@/components/profile/MyPosts";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "next-i18next";
import NotificationSection from "@/components/profile/notifications/NotificationSection";

const ProfileContent = () => {
  const { t } = useTranslation("common");
  const [userData] = useAtom(userAtom);
  const searchParams = useSearchParams();
  const [selectedComponent, setSelectedComponent] = useState<React.ReactNode>(null);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  
  useEffect(() => {
    if (!userData?.userId) return;

    const eventSource = new EventSource(`/api/notification/subscribe`);

    eventSource.addEventListener("connect", () => {
      console.log("SSE connected");
    });

    eventSource.addEventListener("message", (event) => {
      setHasNewNotification(true);
      console.log("New Notification:", event.data);
    });

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [userData?.userId]);

  const profileItems = [
    {
      label: (        
        t("navigation.notifications")
      ),
      component: <Notifications hasNewNotification={hasNewNotification} onViewed={() => setHasNewNotification(false)} />,
      onClick: () => {
        setHasNewNotification(false);
        setSelectedComponent(<Notifications hasNewNotification={hasNewNotification} onViewed={() => setHasNewNotification(false)} />);
      },
    },
    {
      label: t("navigation.profile"),
      component: <ProfileView {...userData} />,
      onClick: () =>
        setSelectedComponent(
          <ProfileInputField
            username={userData.username}
            email={userData.email}
            region={userData.region}
            avatar={userData.avatar}
          />
        ),
    },
    {
      label: t("navigation.savedPosts"),
      component: <SavedPosts />,
      onClick: () => setSelectedComponent(<SavedPosts />),
    },
    {
      label: t("navigation.myPosts"),
      component: <MyPosts />,
      onClick: () => setSelectedComponent(<MyPosts />),
    },
    {
      label: t("navigation.resetPassword"),
      component: <ResetPasswordField />,
      onClick: () => setSelectedComponent(<ResetPasswordField />),
    },
  ];

  useEffect(() => {
    const section = searchParams.get("section");
    switch (section) {
      case "saved-posts":
        setSelectedComponent(<SavedPosts />);
        break;
      case "my-posts":
        setSelectedComponent(<MyPosts />);
        break;
      case "notifications":
        setSelectedComponent(<Notifications onViewed={() => setHasNewNotification(false)} hasNewNotification={false} />);
        break;
      case "profile":
      default:
        setSelectedComponent(<ProfileView {...userData} />);
        break;
    }
  }, [searchParams, userData]);

  return (
    <div className="sm:ml-64 bg-white">
      <SideMenu
        customItems={profileItems}
        onItemSelect={(item) => item.onClick && item.onClick()}
      />
      <div className="container mr-auto max-w-5xl">
        {selectedComponent || <ProfileView {...userData} />}
      </div>
    </div>
  );
};

const ProfileView = ({ username, email, region, avatar }: ProfileDataType) => (
  <ProfileInputField
    username={username}
    email={email}
    region={region}
    avatar={avatar}
  />
);

const Notifications = ({ hasNewNotification, onViewed }: { hasNewNotification: boolean; onViewed: () => void }) => (
  <>
    <NotificationSection onViewed={onViewed} />
    {hasNewNotification && (
      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
    )}
  </>
);

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
