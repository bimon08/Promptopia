import Provider from "@src/components/Provider";
import "./globals.css";

import { Toaster, toast } from "sonner";

export const metadata = {
  title: "Build and Grow Together",
  description:
    "A platform for mutual upbuilding and inspiration from the Bible.",
};

interface RootLayoutPropstype {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutPropstype) => {
  return (
    <html lang="en">
      <body>
        <Provider>
          <div className="main">
            <div className="gradient" />
          </div>

          <main className="app">{children}</main>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
