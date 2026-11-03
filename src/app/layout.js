import { Poppins, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import NavigationProgress from "src/components/core/NavigationProgress";
import ClientTracker from "src/components/core/ClientTracker";
import { connectDB } from "./lib/config";
import GlobalSetting from "./models/GlobalSetting";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-serif",
});

export async function generateMetadata() {
  let faviconUrl = '/images/tara-devis-seal.png';
  try {
    await connectDB();
    const settings = await GlobalSetting.findOne().lean();
    if (settings?.favicon) faviconUrl = settings.favicon;
  } catch (e) {
    console.error("Failed to load favicon from DB", e);
  }

  return {
    metadataBase: new URL('https://taradevis.com'),
    title: {
      default: "Tara Devi's Group | Luxury Mountain Residences in Shimla & Kufri",
      template: "%s | Tara Devi's Group"
    },
    description: "First-generation visionaries setting a new standard for luxury mountain living in Himachal Pradesh. Explore Tara Devi Enclave in Shimla and luxury mountain villas in Kufri.",
    alternates: {
      canonical: 'https://taradevis.com',
    },
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title: "Tara Devi's Group | Luxury Mountain Residences in Himachal Pradesh",
      description: "Contemporary luxury in harmony with the Himalayan topography. Offering those who seek a retreat in the hills a residence of permanence, refinement, and complete peace of mind.",
      url: 'https://taradevis.com',
      siteName: "Tara Devi's Group",
      locale: 'en_US',
      type: 'website',
      images: [{
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: "Tara Devi's Group Luxury Mountain Residences",
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: "Tara Devi's Group | Luxury Mountain Living in Himachal",
      description: "First-generation visionaries setting a new standard for luxury mountain residences in Shimla & Kufri.",
      images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop'],
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function RootLayout({ children }) {
  let globalSchema = null;
  try {
    await connectDB();
    const settings = await GlobalSetting.findOne().lean();
    if (settings?.schemaMarkup) {
      if (typeof settings.schemaMarkup === 'string' && settings.schemaMarkup.trim()) {
        try {
          const parsed = JSON.parse(settings.schemaMarkup);
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            globalSchema = parsed;
          }
        } catch {
          globalSchema = null;
        }
      } else if (typeof settings.schemaMarkup === 'object' && Object.keys(settings.schemaMarkup).length > 0) {
        globalSchema = settings.schemaMarkup;
      }
    }
  } catch (e) {
    console.error("Failed to load global schema from DB", e);
  }

  return (
    <html
      lang="en"
      className={`h-full antialiased ${poppins.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/images/tara-devis-seal.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/images/tara-devis-seal.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/tara-devis-seal.png" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#FFFFFF] text-[#14221D] selection:bg-[#CFA86E]/30 selection:text-[#0E3326]">
        {globalSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
          />
        )}
        <NavigationProgress />
        <ClientTracker />
        {children}
      </body>
    </html>
  );
}
