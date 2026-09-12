import type { Metadata } from "next";
import { Epilogue, Newsreader, Mirza, Lemonada } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/i18n/locale-provider";
import { ar } from "@/content/ar";
import { en } from "@/content/en";

// A grotesk over a text serif, which is the reverse of the usual pairing and
// the right way round for a record: the codes and headings are catalogue
// furniture, and the entries themselves are read.
const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-epilogue",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});
const mirza = Mirza({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mirza",
});
const lemonada = Lemonada({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-lemonada",
});

export const metadata: Metadata = {
  title: "Auto Hub Egypt — the record | Heliopolis, Cairo",
  description:
    "Seven of their last twelve posts are marked sold and left up. A dealership page built as a public record rather than a shop window, where a car's status is printed into the halftone screen instead of coloured.",
  metadataBase: new URL("https://auto-hub-site.vercel.app"),
  icons: { icon: "/mark.svg" },
  openGraph: {
    title: "Auto Hub Egypt — the record",
    description: "A dealership feed read as a history of what moved, not a catalogue.",
    locale: "ar_EG",
    type: "website",
  },
  other: { "theme-color": "#14161a" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // translate="no": the page ships hand-written Arabic and English, and
    // Chrome's auto-translate rewrites `lang`, which would also break every
    // [dir="rtl"] correction if the CSS were keyed off language instead.
    <html
      lang="ar"
      dir="rtl"
      translate="no"
      className={`notranslate ${epilogue.variable} ${newsreader.variable} ${mirza.variable} ${lemonada.variable}`}
    >
      <body className="bg-plate text-ink antialiased">
        {/* Blocks register in under an intersection observer, so without
            scripting every one of them would stay at opacity 0. */}
        <noscript>
          <style>{`[data-reg],[data-rule]{opacity:1!important;transform:none!important;filter:none!important;animation:none!important}`}</style>
        </noscript>
        <LocaleProvider dictionaries={{ ar, en }} defaultLocale="ar">
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
