import "@/styles/globals.css";
import { Providers } from "./providers";
export const metadata = {
  title: "COVID Symptom Tracker",
  description:
    "A simple, anonymous form to track COVID-19 symptoms and recovery times.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
        {children}</Providers></body>
    </html>
  );
}
