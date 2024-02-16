import "@styles/globals.css";
import Nav from "@components/Nav";
import Provider from "@components/Provider";

export const metadata = {
  title: "Build and Grow Together",
  description:
    "A platform for mutual upbuilding and inspiration from the Bible.",
};


const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Provider>
          <div className="main">
            <div className="gradient" />
          </div>

          <main className="app">{children}</main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
