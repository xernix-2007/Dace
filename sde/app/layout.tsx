import "./globals.css";

export const metadata={
  title:"DACE — Daily Adaptive Coding Environment",
  description:"A daily adaptive SDE practice environment for coding interview preparation."
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>;
}
