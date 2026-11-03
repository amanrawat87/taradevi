import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import Product from "../../models/Product";
import Category from "../../models/Category"; // Required for Mongoose populate() on serverless cold starts
import { requirePermission } from "../../lib/auth";
import { uploadFile, isUploadFile } from "../../../lib/upload";

const DEFAULT_PRODUCTS = [
    {
        _id: "6724a1b00000000000000061",
        name: "Tara Devi Enclave — Shimla",
        slug: "tara-devi-enclave-shimla",
        grade: "Under Active Construction • 2 & 3 BHK Luxury Residences",
        description: "Situated in the tranquil foothills of Shimla. Floor-to-ceiling panoramic glass windows, expansive cantilevered timber decks overlooking pine slopes, and radiant underfloor heating provisions.",
        image: "/images/residence-property-1.jpg",
        sort: 1,
        isActive: true,
        category: { name: "Shimla Enclave", slug: "shimla-enclave" }
    },
    {
        _id: "6724a1b00000000000000062",
        name: "Tara Devi Luxury Villas — Kufri",
        slug: "tara-devi-luxury-villas-kufri",
        grade: "Planned Private Mountain Estates • 4 & 5 BHK",
        description: "An exclusive private enclave planned for Kufri at majestic high elevation. Bespoke hillside villas with sweeping views of snow-dusted peaks, private forest lawns, and stone hearths.",
        image: "/images/residence-property-2.jpg",
        sort: 2,
        isActive: true,
        category: { name: "Kufri Villas", slug: "kufri-villas" }
    }
];

// GET all Products
export async function GET() {
    try {
        await connectDB();
        // Populate category to get the category name and slug
        let products = await Product.find().populate('category', 'name slug').sort({ sort: 1 }).lean();
        if (!products || products.length === 0) {
            return Response.json(DEFAULT_PRODUCTS);
        }
        return Response.json(products);
    } catch (error) {
        console.warn("DB connection warning in /api/products GET, serving active frontend fallback:", error.message);
        return Response.json(DEFAULT_PRODUCTS);
    }
}

// POST a new Product
export async function POST(request) {
    const { error } = await requirePermission(request, 'products', 'create');
    if (error) return error;
    try {
        await connectDB();

        const formData = await request.formData();

        // Basic fields
        const name = formData.get("name");
        const slug = formData.get("slug");
        const category = formData.get("category"); // Expecting Category ObjectId
        const grade = formData.get("grade") || "";
        const description = formData.get("description") || "";
        const breadcrumb = formData.get("breadcrumb") || "";
        const alt = formData.get("alt") || "";
        const sort = formData.get("sort") ? Number(formData.get("sort")) : 0;
        const isActive = formData.get("isActive") !== "false"; 

        // SEO fields
        const metatag = formData.get("metatag") || "";
        const metaDescription = formData.get("metaDescription") || "";
        const canonicalUrl = formData.get("canonicalUrl") || "";
        const ogTitle = formData.get("ogTitle") || "";
        const ogDescription = formData.get("ogDescription") || "";
        const twitterCard = formData.get("twitterCard") || "summary_large_image";
        const robots = formData.get("robots") || "index, follow";

        // Schema mapping
        let schemaObj = {};
        const hasSchemaField = formData.has("schema") || formData.has("schemaMarkup");
        if (hasSchemaField) {
            let schemaRaw = formData.get("schema") || formData.get("schemaMarkup") || "";
            if (typeof schemaRaw === 'string') {
                schemaRaw = schemaRaw.trim();
                // Strip wrapping <script...> and </script> tags if provided
                schemaRaw = schemaRaw.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '$1').trim();
                // Strip markdown code fences (```json or ```)
                schemaRaw = schemaRaw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
            }
            if (!schemaRaw || schemaRaw === "" || schemaRaw === "{}") {
                schemaObj = {};
            } else {
                try {
                    schemaObj = JSON.parse(schemaRaw);
                } catch (e) {
                    return Response.json({ message: "Invalid JSON format in Schema Markup: " + e.message }, { status: 400 });
                }
            }
        }

        // Keywords mapping
        let metakeywords = [];
        const kwRaw = formData.get("metakeywords");
        if (kwRaw) {
            try {
                const parsed = JSON.parse(kwRaw);
                if (Array.isArray(parsed)) {
                    metakeywords = parsed.map(k => k.value || k);
                } else if (typeof parsed === 'string') {
                    metakeywords = parsed.split(',').map(s => s.trim()).filter(Boolean);
                }
            } catch (e) {
                metakeywords = kwRaw.split(',').map(s => s.trim()).filter(Boolean);
            }
        }

        if (!name || !slug || !category) {
            return Response.json({ message: "Name, slug, and category are required" }, { status: 400 });
        }

        // Handle file uploads
        const imageFile = formData.get("image");
        const detailImageFile = formData.get("detailImage");
        let imageUrl = "";
        let detailImageUrl = "";

        if (isUploadFile(imageFile)) {
            imageUrl = await uploadFile(imageFile, "products", "prod");
        }

        if (isUploadFile(detailImageFile)) {
            detailImageUrl = await uploadFile(detailImageFile, "products", "detail");
        }

        // Check if slug exists
        const existing = await Product.findOne({ slug });
        if (existing) {
            return Response.json({ message: "Slug already exists" }, { status: 400 });
        }

        const newProduct = await Product.create({
            name,
            slug,
            category,
            grade,
            description,
            breadcrumb,
            image: imageUrl,
            detailImage: detailImageUrl,
            alt,
            sort,
            isActive,
            metatag,
            metaDescription,
            metakeywords,
            canonicalUrl,
            ogTitle,
            ogDescription,
            twitterCard,
            robots,
            schemaMarkup: schemaObj,
        });

        // Populate category before returning so frontend gets the full object
        await newProduct.populate('category', 'name slug');

        // On-Demand Revalidation
        revalidatePath('/', 'layout');
        revalidatePath('/sitemap.xml');
        return Response.json(newProduct, { status: 201 });

    } catch (error) {
        console.error("Product Creation Error:", error);
        return Response.json(
            { message: "Failed to create product", error: error.message },
            { status: 500 }
        );
    }
}
