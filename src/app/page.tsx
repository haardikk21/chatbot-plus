import Chat from "@/components/Chat";
import PrimarySidebar from "@/components/PrimarySidebar";
import SecondarySidebar from "@/components/SecondarySidebar";
import React from "react";

export default function Home() {
  return (
    <div className="flex">
      <PrimarySidebar />
      <SecondarySidebar />

      <Chat />
    </div>
  );
}
