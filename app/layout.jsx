import "./globals.css";

export const metadata = {
  title: "Barista Doma Voice Diagnostic v3",
  description: "Hosted voice transcription proof for Barista Doma"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
