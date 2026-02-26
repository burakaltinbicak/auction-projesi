import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Açik Artirma Sistemi",
  description: "En iyi teklifi ver, ürünü kap!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 text-black">
        <Navbar />
        {children}
      </body>
    </html>
  );
}