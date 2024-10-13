import React from "react";
import "../../styles/ClientLayout.scss";
import Header from "@/components/client/Header/Header";
import Footer from "@/components/client/Footer/Footer";
import { Metadata } from "next";
import { ConfigProvider } from "antd";
import vi_VN from "antd/lib/locale/vi_VN";
import StyledComponentsRegistry from "@/lib/antd.registry";
import StoreProvider from "../StoreProvider";
import LayoutApp from "@/components/layout/LayoutApp";
import Chat from "@/components/client/Chat/Chat.modal";

export const metadata: Metadata = {
  title: "Website tuyển dụng - PTIT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
      </head>
      <body className="next-wrapper">
        <div className="next-container">
          <StoreProvider>
            <ConfigProvider locale={vi_VN}>
              <StyledComponentsRegistry>
                <LayoutApp>
                  <Header />

                  <div>
                    <Chat />
                  </div>

                  {children}

                  <Footer />
                </LayoutApp>
              </StyledComponentsRegistry>
            </ConfigProvider>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
