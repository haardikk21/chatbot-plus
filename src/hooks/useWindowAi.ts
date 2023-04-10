import useChatbotStore from "@/stores/ChatbotStore";
import { useEffect, useState } from "react";

const useWindowAi = () => {
  const chatbotStore = useChatbotStore();
  const [windowAi, setWindowAi] = useState<typeof window.ai>(undefined);

  useEffect(() => {
    if (window && window.ai) {
      setWindowAi(window.ai);
    }
  }, []);

  return windowAi;
};

export default useWindowAi;
