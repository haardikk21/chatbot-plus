"use client";

import useChatbotStore from "@/stores/ChatbotStore";
import clsx from "clsx";
import { useState } from "react";
import { BsChatLeftFill } from "react-icons/bs";
import {
  FaCheck,
  FaEdit,
  FaPlusSquare,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

export default function SecondarySidebar() {
  const chatbotStore = useChatbotStore();

  function handleNewChat() {
    chatbotStore.setCurrentConversationId(undefined);
  }

  return (
    <div className="z-10 flex h-screen w-72 flex-col overflow-x-hidden overflow-y-scroll bg-gray-300 shadow dark:bg-gray-800">
      <div
        className="group mx-3 mt-4 flex cursor-pointer items-start gap-3 rounded-md bg-purple-500 p-2 text-white hover:bg-purple-600"
        onClick={handleNewChat}
      >
        <div className="mt-1 flex-shrink-0">
          <FaPlusSquare size="14" />
        </div>
        <p className="line-clamp-1 text-sm group-hover:line-clamp-none">
          New Chat
        </p>
      </div>

      {chatbotStore
        .getConversationsByGroupId(chatbotStore.currentGroupId)
        .map((conversation) => (
          <ConversationItem
            key={conversation.id}
            id={conversation.id}
            icon={<BsChatLeftFill size="14" />}
            text={conversation.name}
            active={conversation.id === chatbotStore.currentConversationId}
            onClick={() =>
              chatbotStore.setCurrentConversationId(conversation.id)
            }
          />
        ))}
    </div>
  );
}

interface IConversationItemProps {
  id: string;
  icon: React.ReactElement;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

const ConversationItem: React.FC<IConversationItemProps> = ({
  id,
  icon,
  text,
  active,
  onClick,
}) => {
  const [pText, setPText] = useState(text);
  const [isEditingName, setIsEditingName] = useState(false);
  const chatbotStore = useChatbotStore();

  function handleNameEdit(e: React.MouseEvent<SVGElement>) {
    e.stopPropagation();
    chatbotStore.setConversationName(id, pText);

    setIsEditingName(false);
  }

  function handleNameEditCancel(e: React.MouseEvent<SVGElement>) {
    e.stopPropagation();
    setPText(text);

    setIsEditingName(false);
  }

  function handleDeleteClick(e: React.MouseEvent<SVGElement>) {
    e.stopPropagation();
    chatbotStore.deleteConversation(id);
  }

  return (
    <div
      onClick={onClick}
      className={clsx(
        "group m-2 flex items-center gap-3 rounded-md bg-gray-400 p-2 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-900",
        active ? "border border-gray-500 bg-gray-300 dark:bg-gray-900" : ""
      )}
    >
      <div className="mt-1 flex-shrink-0">{icon}</div>
      <p
        className="line-clamp-1 text-sm focus:outline-none group-hover:line-clamp-none"
        contentEditable={isEditingName}
        onChange={(e) => setPText(e.currentTarget.innerText)}
        suppressContentEditableWarning
      >
        {pText}
      </p>
      <div className="flex-grow" />

      {isEditingName ? (
        <div className="flex flex-shrink-0 items-center gap-2 text-gray-600 dark:text-gray-400">
          <FaCheck
            size="14"
            className="cursor-pointer"
            onClick={handleNameEdit}
          />
          <FaTimes
            size="14"
            className="cursor-pointer"
            onClick={handleNameEditCancel}
          />
        </div>
      ) : (
        <div className="hidden flex-shrink-0 items-center gap-2 text-gray-600 group-hover:flex dark:text-gray-400">
          <FaEdit
            size="14"
            className="cursor-pointer"
            onClick={() => setIsEditingName(true)}
          />
          <FaTrash
            size="14"
            className="cursor-pointer"
            onClick={handleDeleteClick}
          />
        </div>
      )}
    </div>
  );
};
