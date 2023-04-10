import { Dispatch, Fragment, useState, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import useChatbotStore from "@/stores/ChatbotStore";

const EMOJIS_LIST = ["🫶", "💼", "❤️", "😊", "🔥", "💀", "✨", "🫡", "🎉", "👀"];

const AddGroupModal: React.FC = () => {
  const chatbotStore = useChatbotStore();
  const [groupName, setGroupName] = useState("");
  const [groupEmoji, setGroupEmoji] = useState("");

  function handleAddGroup() {
    chatbotStore.addGroup(groupName, groupEmoji);
    chatbotStore.setShowAddGroupModal(false);
    setGroupName("");
    setGroupEmoji("");
  }

  return (
    <Transition.Root show={chatbotStore.showAddGroupModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={chatbotStore.setShowAddGroupModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-400/75 transition-opacity dark:bg-gray-700/75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-200 px-4 pb-4 pt-5 text-left text-gray-900 shadow-xl transition-all dark:bg-gray-900 dark:text-gray-100 sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                  Add Group
                </Dialog.Title>

                <input
                  type="text"
                  className="mt-2 w-full rounded-md bg-gray-300 px-3 py-2 text-gray-700 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-700"
                  value={groupName}
                  placeholder="Group Name"
                  onChange={(e) => setGroupName(e.target.value)}
                />

                <div className="mt-2">
                  <div className="mx-auto grid grid-cols-5 items-center justify-center">
                    {EMOJIS_LIST.map((emoji) => (
                      <button
                        key={emoji}
                        className={`mx-1 my-2 h-14 w-14 rounded-full text-xl transition-colors focus:outline-none ${
                          groupEmoji === emoji
                            ? "bg-gray-400 dark:bg-gray-400"
                            : "bg-gray-300 dark:bg-gray-800"
                        }`}
                        onClick={() => setGroupEmoji(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="mt-2 inline-flex h-8 w-full items-center justify-center rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600"
                  onClick={handleAddGroup}
                >
                  Save
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AddGroupModal;
