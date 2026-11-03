import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../../lib/config";
import Category from "../../../models/Category";
import { uploadFile, isUploadFile } from "../../../../lib/upload";

// PUT to update a Category
export async function PUT(request, context) {
    try {
        await connectDB();
        
        // Ensure params are awaited before use (Next.js 15+ App Router behavior)
        const params = await context.params;
        const id = params.id;
        
        if (!id) {
            return Response.json({ message: "Category ID is required" }, { status: 400 });
        }

        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return Response.json({ message: "Category not found" }, { status: 404 });
        }

        const formData = await request.formData();

        // Basic fields with fallback to existingCategory
        const name = formData.has("name") ? formData.get("name") : existingCategory.name;
        const slug = formData.has("slug") ? formData.get("slug") : existingCategory.slug;
        const description = formData.has("description") ? (formData.get("description") || "") : (existingCategory.description || "");
        const breadcrumb = formData.has("breadcrumb") ? (formData.get("breadcrumb") || "") : (existingCategory.breadcrumb || "");
        const alt = formData.has("alt") ? (formData.get("alt") || "") : (existingCategory.alt || "");
        const sort = formData.has("sort") ? Number(formData.get("sort")) : (existingCategory.sort ?? 0);
        const isActive = formData.has("isActive") ? (formData.get("isActive") !== "false") : existingCategory.isActive;

        // SEO fields with fallback to existingCategory
        const metatag = formData.has("metatag") ? (formData.get("metatag") || "") : (existingCategory.metatag || "");
        const metaDescription = formData.has("metaDescription") ? (formData.get("metaDescription") || "") : (existingCategory.metaDescription || "");
        const canonicalUrl = formData.has("canonicalUrl") ? (formData.get("canonicalUrl") || "") : (existingCategory.canonicalUrl || "");
        const ogTitle = formData.has("ogTitle") ? (formData.get("ogTitle") || "") : (existingCategory.ogTitle || "");
        const ogDescription = formData.has("ogDescription") ? (formData.get("ogDescription") || "") : (existingCategory.ogDescription || "");
        const twitterCard = formData.has("twitterCard") ? (formData.get("twitterCard") || "summary_large_image") : (existingCategory.twitterCard || "summary_large_image");
        const robots = formData.has("robots") ? (formData.get("robots") || "index, follow") : (existingCategory.robots || "index, follow");

        // Schema mapping
        let schemaObj = existingCategory.schemaMarkup || {};
        const hasSchemaField = formData.has("schema") || formData.has("schemaMarkup");
        if (hasSchemaField) {
            let schemaRaw = formData.get("schema") || formData.get("schemaMarkup") || "";
            if (typeof schemaRaw === 'string') {
                schemaRaw = schemaRaw.trim();
                schemaRaw = schemaRaw.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '$1').trim();
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
        let metakeywords = existingCategory.metakeywords || [];
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

        if (!name || !slug) {
            return Response.json({ message: "Name and slug are required" }, { status: 400 });
        }

        // Check if slug exists on another document
        const duplicateSlug = await Category.findOne({ slug, _id: { $ne: id } });
        if (duplicateSlug) {
            return Response.json({ message: "Slug already exists" }, { status: 400 });
        }

        // Handle file uploads
        const imageFile = formData.get("image");
        let imageUrl = existingCategory.image;

        if (isUploadFile(imageFile)) {
            imageUrl = await uploadFile(imageFile, "categories", "category");
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                name,
                slug,
                description,
                breadcrumb,
                image: imageUrl,
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

        // On-Demand Revalidation
        revalidatePath('/', 'layout');
        revalidatePath('/sitemap.xml');
        return Response.json(updatedCategory);

    } catch (error) {
        console.error("Category Update Error:", error);
        return Response.json(
            { message: "Failed to update category", error: error.message },
            { status: 500 }
        );
    }
}

// DELETE a Category
export async function DELETE(request, context) {
    try {
        await connectDB();
        const params = await context.params;
        const id = params.id;

        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return Response.json({ message: "Category not found" }, { status: 404 });
        }

        // On-Demand Revalidation
        revalidatePath('/', 'layout');
        revalidatePath('/sitemap.xml');
        return Response.json({ message: "Category deleted successfully" });
    } catch (error) {
        return Response.json(
            { message: "Failed to delete category", error: error.message },
            { status: 500 }
        );
    }
}
