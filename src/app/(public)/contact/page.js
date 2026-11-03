import PageHeader from "../../../components/layout/PageHeader";
import ContactSection from "../../../components/features/contact/ContactSection";
import LocationsSection from "../../../components/features/contact/LocationsSection";
import { connectDB } from "../../lib/config";
import ContactPageModel from "../../models/ContactPage";
import PageBanner from "../../models/PageBanner";

export async function generateMetadata() {
  let meta = {
    title: "Contact Us | Jindal Metals & Alloys Ltd",
    description: "Contact Jindal Metals & Alloys Ltd for precision stainless steel strip enquiries.",
    alternates: {
      canonical: "https://jindalmetal.com/contact",
    },
  };
  try {
    await connectDB();
    const page = await ContactPageModel.findOne().lean();
    if (page) {
      if (page.metatag) meta.title = page.metatag;
      if (page.metaDescription) meta.description = page.metaDescription;
      if (page.metakeywords?.length) meta.keywords = page.metakeywords;
      if (page.canonicalUrl) meta.alternates.canonical = page.canonicalUrl;
    }
  } catch (e) {}
  return meta;
}

async function getContactData() {
  try {
    await connectDB();
    const page = await ContactPageModel.findOne().lean();
    if (!page) return null;

    // Convert ObjectId and Date to plain values for client component props
    return JSON.parse(JSON.stringify(page));
  } catch (e) {
    return null;
  }
}

export default async function ContactUsPage() {
  const data = await getContactData();
  await connectDB();
  const banner = await PageBanner.findOne({ pageKey: 'contact', isActive: true }).lean();

  const title = banner?.title || data?.headerTitle || "Contact Us";
  const bgImage = banner?.image || data?.headerImage || "/images/slide2.jpg";

  let parsedContactSchema = null;
  if (data?.schemaMarkup) {
    if (typeof data.schemaMarkup === 'string') {
      try {
        const parsed = JSON.parse(data.schemaMarkup);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          parsedContactSchema = parsed;
        }
      } catch {
        parsedContactSchema = null;
      }
    } else if (typeof data.schemaMarkup === 'object' && Object.keys(data.schemaMarkup).length > 0) {
      parsedContactSchema = data.schemaMarkup;
    }
  }

  return (
    <>
      {parsedContactSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(parsedContactSchema) }}
        />
      )}
      <PageHeader
        title={title}
        bgImage={bgImage}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: title },
        ]}
      />

      <div className="">
        <ContactSection data={data} />
      </div>

      <LocationsSection locations={data?.locations || []} />
    </>
  );
}
