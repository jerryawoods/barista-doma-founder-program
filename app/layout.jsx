import "./globals.css";

export const metadata = {
  title: "Barista Doma Advisor Interaction v5",
  description: "Premium Advisor interaction diagnostic for The Home Barista Occasion Simulator"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
