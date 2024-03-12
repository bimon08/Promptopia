import Provider from "@src/components/Provider";
import "./globals.css";
import "./style.css";
import { Toaster } from "sonner";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@src/utils/theme_provider";
// If loading a variable font, you don't need to specify the font weight
const inter = Poppins({ weight: "400", display: "swap", subsets: ["latin"] });
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
      <body className={"font-satoshi"}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Provider>
            <div className="main">
              <div className="gradient" />
            </div>
            <main className="app">{children}</main>
            <Toaster />
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
