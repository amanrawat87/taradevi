import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import HomeSeo from "../../models/HomeSeo";

const DEFAULT_HOME_SEO = [
    {
        _id: "6724a1b00000000000000041",
        pageSlug: "home",
        title: "Tara Devi's Group | Luxury Mountain Residences in Shimla & Kufri",
        metaDescription: "First-generation visionaries setting a new standard for luxury mountain living in Himachal Pradesh. Explore Tara Devi Enclave in Shimla and luxury mountain villas in Kufri.",
        metaKeywords: ["Tara Devi's Group", "Luxury Mountain Residences", "Shimla Real Estate", "Tara Devi Enclave", "Kufri Mountain Villas", "Himachal Luxury Living"],
        canonicalUrl: "https://taradevis.com",
        ogTitle: "Tara Devi's Group | Luxury Mountain Residences in Himachal Pradesh",
        ogDescription: "Contemporary luxury in harmony with the Himalayan topography. Offering those who seek a retreat in the hills a residence of permanence, refinement, and complete peace of mind.",
        ogImage: "/images/tara-enclave-banner-2.jpg",
        twitterCard: "summary_large_image",
        robots: "index, follow",
        h1: "Setting a New Standard for Luxury Mountain Living",
        schema: {
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "Tara Devi's Group",
            "url": "https://taradevis.com",
            "logo": "https://taradevis.com/images/tara-devis-seal.png",
            "description": "Luxury mountain residences and enclaves in Himachal Pradesh"
        }
    }
];

export async function GET() {
    try {
        await connectDB();
        let homeSeo = await HomeSeo.find().lean();
        if (!homeSeo || homeSeo.length === 0) {
            try {
                const created = await HomeSeo.create({ ...DEFAULT_HOME_SEO[0], _id: undefined });
                homeSeo = [created.toObject ? created.toObject() : created];
            } catch (seedErr) {
                console.warn("HomeSeo auto-seed warning:", seedErr.message);
            }
        }
        if (!homeSeo || homeSeo.length === 0) {
            return Response.json(DEFAULT_HOME_SEO);
        }
        homeSeo.sort((a, b) => (a.pageSlug === 'home' ? -1 : b.pageSlug === 'home' ? 1 : 0));
        return Response.json(homeSeo);
    } catch (error) {
        console.warn("DB connection warning in /api/home-seo GET, serving active frontend fallback:", error.message);
        return Response.json(DEFAULT_HOME_SEO);
    }
}

export async function POST(request) {
    try {
        await connectDB();

        const contentType = request.headers.get('content-type') || '';

        let body = {};

        if (contentType.includes('application/json')) {
            body = await request.json();
        } else {
            // form-data or x-www-form-urlencoded
            const formData = await request.formData();
            body = Object.fromEntries(formData.entries());
            // metaKeywords comes as comma string from form-data — convert to array
            if (body.metaKeywords && typeof body.metaKeywords === 'string') {
                body.metaKeywords = body.metaKeywords.split(',').map(k => k.trim()).filter(Boolean);
            }
            // schema comes as JSON string from form-data — sanitize and parse it
            if (body.schema && typeof body.schema === 'string') {
                let s = body.schema.trim();
                s = s.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '$1').trim();
                s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
                try { body.schema = JSON.parse(s); } catch { body.schema = {}; }
            }
        }

        const updateData = {
            pageSlug:        'home', // Enforce canonical home slug
            title:           body.title           || '',
            metaDescription: body.metaDescription || '',
            metaKeywords:    body.metaKeywords    || [],
            canonicalUrl:    body.canonicalUrl    || '',
            ogTitle:         body.ogTitle         || '',
            ogDescription:   body.ogDescription   || '',
            ogImage:         body.ogImage         || '',
            twitterCard:     body.twitterCard     || 'summary_large_image',
            robots:          body.robots          || 'index, follow',
            schema:          body.schema          || {},
            h1:              body.h1              || '',
            updatedAt:       new Date().toISOString().split('T')[0],
        };

        const homeSeo = await HomeSeo.findOneAndUpdate(
            { pageSlug: 'home' },
            updateData,
            { new: true, upsert: true }
        );

        // On-demand revalidation to immediately clear ISR cache for homepage
        revalidatePath('/', 'layout');
        revalidatePath('/');
        revalidatePath('/sitemap.xml');

        return Response.json({ message: "HomeSeo saved successfully", data: homeSeo });
    } catch (error) {
        return Response.json({ message: "Save failed", error: error.message }, { status: 500 });
    }
}
