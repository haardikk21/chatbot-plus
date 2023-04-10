"use client";
import useIsMounted from "@/hooks/useIsMounted";
import useChatbotStore from "@/stores/ChatbotStore";
import clsx from "clsx";
import React, { ReactNode, useState } from "react";
import { FaGithub, FaPlus, FaTwitter } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import { BsFillGearFill } from "react-icons/bs";
import AddGroupModal from "./Modals/AddGroupModal";
import APIKeyModal from "./Modals/APIKeyModal";
import SettingsModal from "./Modals/SettingsModal";

export default function PrimarySidebar() {
  const isMounted = useIsMounted();
  const chatbotStore = useChatbotStore();

  function handleGroupClick(groupId: string) {
    chatbotStore.setCurrentGroupId(groupId);
    const conversations = chatbotStore.getConversationsByGroupId(groupId);
    if (conversations.length > 0) {
      chatbotStore.setCurrentConversationId(conversations[0].id);
    } else {
      chatbotStore.setCurrentConversationId(undefined);
    }
  }

  if (!isMounted) return null;

  return (
    <div className="z-50 m-0 flex h-screen w-16 flex-col bg-gray-300 text-gray-900 shadow dark:bg-gray-900 dark:text-white">
      {chatbotStore.groups.map((group) => (
        <SidebarIcon
          key={group.id}
          icon={group.iconEmoji}
          text={group.name}
          active={chatbotStore.currentGroupId === group.id}
          onClick={() => handleGroupClick(group.id)}
        />
      ))}
      <SidebarIcon
        icon={<FaPlus size="28" />}
        text="Add Group"
        onClick={() => chatbotStore.setShowAddGroupModal(true)}
      />

      <div className="flex-grow" />

      <ThemeToggle />
      <SidebarIcon
        icon={<BsFillGearFill size="28" />}
        text="Settings"
        onClick={() => chatbotStore.setShowSettingsModal(true)}
      />
      <SidebarIcon
        icon={<FaGithub size="28" />}
        text="Github Repo"
        onClick={() =>
          window.open("https://github.com/haardikk21/chatbot-plus", "_blank")
        }
      />
      <SidebarIcon
        icon={<FaTwitter size="28" />}
        text="Twitter"
        onClick={() => window.open("https://twitter.com/haardikkk", "_blank")}
      />

      <AddGroupModal />
      <SettingsModal />
    </div>
  );
}

interface ISidebarIconProps {
  icon: ReactNode;
  active?: boolean;
  text?: string;
  onClick?: () => void;
}

const SidebarIcon: React.FC<ISidebarIconProps> = ({
  icon,
  text = "Tooltip",
  active = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "group relative mx-auto my-2 flex h-12 w-12 cursor-pointer items-center justify-center text-3xl",
        "transition-all hover:rounded-xl hover:bg-purple-600 hover:text-white",
        "dark:hover:bg-purple-500",
        active
          ? "rounded-xl bg-purple-600 text-white"
          : "rounded-3xl bg-gray-100 text-purple-500 dark:bg-gray-800"
      )}
    >
      {icon}

      <span className="absolute left-14 m-2 w-auto min-w-max origin-left scale-0 rounded-md bg-gray-900 p-2 text-xs font-bold text-white shadow-md transition-all duration-100 group-hover:scale-100">
        {text}
      </span>
    </div>
  );
};
