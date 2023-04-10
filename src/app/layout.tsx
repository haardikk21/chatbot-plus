import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "ChatBot Plus",
  description: "An open-source interface that makes AI Chatbots easier to use.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
