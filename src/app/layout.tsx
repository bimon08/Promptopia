import Provider from "@src/components/Provider";
import "./globals.css";
import { Toaster } from "sonner";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@src/utils/theme_provider";
import NavbarContentDemo from "@src/components/NavBar";
import NavBar from "@src/components/NavBar";

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
 const head = () => {
  return (
    <>
      <title>Build and Grow</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/assets/images/logo.svg" />
    </>
  );
 }
const RootLayout = ({ children }: RootLayoutPropstype) => {
  return (
    <html lang="en">
      <head>{head()}</head>
      <body className={"font-satoshi"}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Provider>
            <main className="">
              <NavBar />
              {children}
            </main>
            <Toaster />
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
