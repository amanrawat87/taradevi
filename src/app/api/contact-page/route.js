import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import ContactPage from "../../models/ContactPage";
import { uploadFile, isUploadFile } from "../../../lib/upload";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        await connectDB();
        let page = await ContactPage.findOne();
        if (!page) {
            page = await ContactPage.create({});
        }
        return Response.json({ success: true, data: page });
    } catch (error) {
        return Response.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectDB();
        const formData = await request.formData();

        let page = await ContactPage.findOne();
        if (!page) {
            page = new ContactPage();
        }

        // Process File Uploads
        const headerImage = formData.get("headerImage");
        if (isUploadFile(headerImage)) {
            page.headerImage = await uploadFile(headerImage, "contact", "header");

            // Delete old image if it's a local file
            if (page.headerImage && page.headerImage.startsWith("/uploads/")) {
                try {
                    const oldPath = path.join(process.cwd(), "public", page.headerImage);
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                } catch (fsErr) {
                    console.warn("Could not delete old contact header image:", fsErr.message);
                }
            }
        }

        // Text Fields
        if (formData.has("headerTitle")) page.headerTitle = formData.get("headerTitle");
        if (formData.has("contactSubTitle")) page.contactSubTitle = formData.get("contactSubTitle");
        if (formData.has("contactTitle")) page.contactTitle = formData.get("contactTitle");
        if (formData.has("contactDescription")) page.contactDescription = formData.get("contactDescription");
        if (formData.has("mapIframeUrl")) page.mapIframeUrl = formData.get("mapIframeUrl");

        // Locations Array
        if (formData.has("locations")) {
            try {
                const locations = JSON.parse(formData.get("locations"));
                if (Array.isArray(locations)) {
                    page.locations = locations;
                }
            } catch (e) {
                console.error("Invalid locations JSON format");
            }
        }

        // SEO Fields
        if (formData.has("metatag")) page.metatag = formData.get("metatag");
        if (formData.has("metaDescription")) page.metaDescription = formData.get("metaDescription");
        if (formData.has("canonicalUrl")) page.canonicalUrl = formData.get("canonicalUrl");
        if (formData.has("ogTitle")) page.ogTitle = formData.get("ogTitle");
        if (formData.has("ogDescription")) page.ogDescription = formData.get("ogDescription");
        if (formData.has("twitterCard")) page.twitterCard = formData.get("twitterCard");
        if (formData.has("robots")) page.robots = formData.get("robots");

        if (formData.has("metakeywords")) {
            try {
                page.metakeywords = JSON.parse(formData.get("metakeywords"));
            } catch (e) {}
        }
        
        if (formData.has("schemaMarkup") || formData.has("schema")) {
            let sc = formData.get("schemaMarkup") ?? formData.get("schema");
            if (typeof sc === 'string') {
                sc = sc.trim();
                sc = sc.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '$1').trim();
                if (sc.startsWith('```json')) sc = sc.slice(7);
                else if (sc.startsWith('```')) sc = sc.slice(3);
                if (sc.endsWith('```')) sc = sc.slice(0, -3);
                sc = sc.trim();
                if (sc === "" || sc === "{}") {
                    page.schemaMarkup = {};
                } else {
                    try {
                        page.schemaMarkup = JSON.parse(sc);
                    } catch (e) {
                        return Response.json({
                            success: false,
                            message: `Invalid JSON format in Contact Schema Markup: ${e.message}`
                        }, { status: 400 });
                    }
                }
            }
        }

        await page.save();

        
    // On-Demand Revalidation
    revalidatePath('/contact');
    revalidatePath('/', 'layout');
    return Response.json({ success: true, message: "Contact Page updated", data: page });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: error.message }, { status: 500 });
    }
}
