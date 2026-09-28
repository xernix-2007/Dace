import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata={
  title:"DACE — Daily Adaptive Coding Environment",
  description:"A daily adaptive SDE practice environment for coding interview preparation."
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}<Analytics /></body></html>;
}
