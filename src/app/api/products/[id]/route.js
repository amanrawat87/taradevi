import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../../lib/config";
import Product from "../../../models/Product";
import { uploadFile, isUploadFile } from "../../../../lib/upload";

// GET a single Product by ID
export async function GET(request, context) {
    try {
        await connectDB();
        const params = await context.params;
        const id = params.id;
        const product = await Product.findById(id).populate('category', 'name slug').lean();
        if (!product) {
            return Response.json({ message: "Product not found" }, { status: 404 });
        }
        return Response.json(product);
    } catch (error) {
        return Response.json({ message: "Failed to fetch product", error: error.message }, { status: 500 });
    }
}

// PUT to update a Product
export async function PUT(request, context) {
    try {
        await connectDB();
        
        const params = await context.params;
        const id = params.id;
        
        if (!id) {
            return Response.json({ message: "Product ID is required" }, { status: 400 });
        }

        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return Response.json({ message: "Product not found" }, { status: 404 });
        }

        const formData = await request.formData();

        // Basic fields with fallback to existingProduct
        const name = formData.has("name") ? formData.get("name") : existingProduct.name;
        const slug = formData.has("slug") ? formData.get("slug") : existingProduct.slug;
        const category = formData.has("category") ? formData.get("category") : existingProduct.category;
        const grade = formData.has("grade") ? (formData.get("grade") || "") : (existingProduct.grade || "");
        const description = formData.has("description") ? (formData.get("description") || "") : (existingProduct.description || "");
        const breadcrumb = formData.has("breadcrumb") ? (formData.get("breadcrumb") || "") : (existingProduct.breadcrumb || "");
        const alt = formData.has("alt") ? (formData.get("alt") || "") : (existingProduct.alt || "");
        const sort = formData.has("sort") ? Number(formData.get("sort")) : (existingProduct.sort ?? 0);
        const isActive = formData.has("isActive") ? (formData.get("isActive") !== "false") : existingProduct.isActive;

        // SEO fields with fallback to existingProduct
        const metatag = formData.has("metatag") ? (formData.get("metatag") || "") : (existingProduct.metatag || "");
        const metaDescription = formData.has("metaDescription") ? (formData.get("metaDescription") || "") : (existingProduct.metaDescription || "");
        const canonicalUrl = formData.has("canonicalUrl") ? (formData.get("canonicalUrl") || "") : (existingProduct.canonicalUrl || "");
        const ogTitle = formData.has("ogTitle") ? (formData.get("ogTitle") || "") : (existingProduct.ogTitle || "");
        const ogDescription = formData.has("ogDescription") ? (formData.get("ogDescription") || "") : (existingProduct.ogDescription || "");
        const twitterCard = formData.has("twitterCard") ? (formData.get("twitterCard") || "summary_large_image") : (existingProduct.twitterCard || "summary_large_image");
        const robots = formData.has("robots") ? (formData.get("robots") || "index, follow") : (existingProduct.robots || "index, follow");

        // Schema mapping
        let schemaObj = existingProduct.schemaMarkup || {};
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
        let metakeywords = existingProduct.metakeywords || [];
        if (formData.has("metakeywords")) {
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
            } else {
                metakeywords = [];
            }
        }

        if (!name || !slug || !category) {
            return Response.json({ message: "Name, slug, and category are required" }, { status: 400 });
        }

        // Check if slug exists on another document
        const duplicateSlug = await Product.findOne({ slug, _id: { $ne: id } });
        if (duplicateSlug) {
            return Response.json({ message: "Slug already exists" }, { status: 400 });
        }

        // Handle file uploads
        const imageFile = formData.get("image");
        const detailImageFile = formData.get("detailImage");
        const existingImageUrl = formData.get("existingImage") || "";
        const existingDetailImageUrl = formData.get("existingDetailImage") || "";

        // Start with whatever the client says is the current URL (they always send it)
        let imageUrl = existingImageUrl || existingProduct.image || "";
        let detailImageUrl = existingDetailImageUrl || existingProduct.detailImage || "";

        // Only overwrite if a real new file was uploaded
        if (isUploadFile(imageFile)) {
            imageUrl = await uploadFile(imageFile, "products", "prod");
        }

        if (isUploadFile(detailImageFile)) {
            detailImageUrl = await uploadFile(detailImageFile, "products", "detail");
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
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
            },
            { new: true }
        );

        await updatedProduct.populate('category', 'name slug');

        // On-Demand Revalidation
        revalidatePath('/', 'layout');
        revalidatePath('/sitemap.xml');
        return Response.json(updatedProduct);

    } catch (error) {
        console.error("Product Update Error:", error);
        return Response.json(
            { message: "Failed to update product", error: error.message },
            { status: 500 }
        );
    }
}

// DELETE a Product
export async function DELETE(request, context) {
    try {
        await connectDB();
        const params = await context.params;
        const id = params.id;

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return Response.json({ message: "Product not found" }, { status: 404 });
        }

        // On-Demand Revalidation
        revalidatePath('/', 'layout');
        revalidatePath('/sitemap.xml');
        return Response.json({ message: "Product deleted successfully" });
    } catch (error) {
        return Response.json(
            { message: "Failed to delete product", error: error.message },
            { status: 500 }
        );
    }
}
