import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import GlobalSetting from "../../models/GlobalSetting";
import fs from "fs";
import path from "path";

import { uploadFile, isUploadFile } from "../../../lib/upload";

const handleUploadAndDeleteOld = async (file, folderName, prefix, oldFilePath) => {
    if (!isUploadFile(file)) return null;

    const newUrl = await uploadFile(file, folderName, prefix);

    // Delete old file if exists and is local
    if (oldFilePath && oldFilePath.startsWith("/uploads/")) {
        const oldPathFull = path.join(process.cwd(), "public", oldFilePath);
        if (fs.existsSync(oldPathFull)) {
            try {
                fs.unlinkSync(oldPathFull);
            } catch (e) {
                console.error("Failed to delete old file:", e);
            }
        }
    }

    return newUrl;
};

const cleanJsonInput = (val) => {
    if (!val || typeof val !== 'string') return val;
    let s = val.trim();
    s = s.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '$1').trim();
    if (s.startsWith('```json')) s = s.slice(7);
    else if (s.startsWith('```')) s = s.slice(3);
    if (s.endsWith('```')) s = s.slice(0, -3);
    return s.trim();
};

const DEFAULT_GLOBAL_SETTINGS = {
    websiteTitle: "Tara Devi's Group | Luxury Mountain Residences",
    adminTitle: "Tara Devi's Group",
    logoImage: "/images/tara-devis-seal.png",
    adminLogo: "/images/tara-devis-seal.png",
    favicon: "/images/tara-devis-seal.png",
    primaryPhone: "+91-9871177761",
    contactEmail: "info@taradevis.com",
    address: "Tara Devi Foothills, Shimla, Himachal Pradesh",
    socialLinks: [
        { platform: "Instagram", url: "https://instagram.com" },
        { platform: "LinkedIn", url: "https://linkedin.com" }
    ]
};

export async function GET() {
    try {
        await connectDB();
        let settingsDoc = await GlobalSetting.findOne();
        if (!settingsDoc) {
            settingsDoc = await GlobalSetting.create(DEFAULT_GLOBAL_SETTINGS);
        }
        
        let settings = settingsDoc.toObject();

        // Migrate legacy social fields if socialLinks hasn't been set up yet
        if (!settings.socialLinks || settings.socialLinks.length === 0) {
            const rawDoc = await mongoose.connection.db.collection('globalsettings').findOne({ _id: settingsDoc._id });
            if (rawDoc && (rawDoc.linkedinUrl || rawDoc.facebookUrl || rawDoc.twitterUrl || rawDoc.instagramUrl)) {
                const legacyLinks = [];
                if (rawDoc.linkedinUrl) legacyLinks.push({ platform: 'LinkedIn', url: rawDoc.linkedinUrl, icon: 'bi-linkedin' });
                if (rawDoc.facebookUrl) legacyLinks.push({ platform: 'Facebook', url: rawDoc.facebookUrl, icon: 'bi-facebook' });
                if (rawDoc.twitterUrl) legacyLinks.push({ platform: 'Twitter', url: rawDoc.twitterUrl, icon: 'bi-twitter-x' });
                if (rawDoc.instagramUrl) legacyLinks.push({ platform: 'Instagram', url: rawDoc.instagramUrl, icon: 'bi-instagram' });
                
                settingsDoc.socialLinks = legacyLinks;
                await settingsDoc.save();
                settings.socialLinks = legacyLinks;
            }
        }

        return Response.json({ success: true, data: settings });
    } catch (error) {
        console.warn("DB connection warning in /api/global-settings GET, serving active frontend fallback:", error.message);
        return Response.json({ success: true, data: DEFAULT_GLOBAL_SETTINGS });
    }
}

export async function PUT(request) {
    try {
        await connectDB();
        const formData = await request.formData();

        let settings = await GlobalSetting.findOne();
        if (!settings) {
            settings = new GlobalSetting();
        }

        // Process File Uploads
        const logoImage = formData.get("logoImage");
        if (isUploadFile(logoImage)) {
            const newLogo = await handleUploadAndDeleteOld(logoImage, "settings", "logo", settings.logoImage !== "/images/logo.png" ? settings.logoImage : null);
            if (newLogo) settings.logoImage = newLogo;
        }

        const adminLogo = formData.get("adminLogo");
        if (isUploadFile(adminLogo)) {
            const newAdminLogo = await handleUploadAndDeleteOld(adminLogo, "settings", "adminlogo", settings.adminLogo !== "/jindal-logo.jpg" ? settings.adminLogo : null);
            if (newAdminLogo) settings.adminLogo = newAdminLogo;
        }

        const favicon = formData.get("favicon");
        if (isUploadFile(favicon)) {
            const newFavicon = await handleUploadAndDeleteOld(favicon, "settings", "favicon", settings.favicon !== "/favicon.ico" ? settings.favicon : null);
            if (newFavicon) settings.favicon = newFavicon;
        }

        const pdf1Url = formData.get("pdf1Url");
        if (isUploadFile(pdf1Url)) {
            const newPdf = await handleUploadAndDeleteOld(pdf1Url, "pdf", "pdf1", settings.pdf1Url !== "/pdf/company-profile.pdf" ? settings.pdf1Url : null);
            if (newPdf) settings.pdf1Url = newPdf;
        }

        const pdf2Url = formData.get("pdf2Url");
        if (isUploadFile(pdf2Url)) {
            const newPdf = await handleUploadAndDeleteOld(pdf2Url, "pdf", "pdf2", settings.pdf2Url !== "#" ? settings.pdf2Url : null);
            if (newPdf) settings.pdf2Url = newPdf;
        }

        // Text Fields
        const textFields = [
            "adminTitle",
            "footerDescription", "primaryEmail", "primaryPhone", "footerPhone", "address",
            "pdf1Text", "pdf2Text",
            "googleAnalyticsId", "googleTagManagerId", "googleSearchConsoleKey",
            // Custom Code Injection
            "customHeadCode", "customBodyCode", "robotsTxt",
            // AI Provider Keys
            "geminiApiKey", "openRouterApiKey", "groqApiKey", "cerebrasApiKey",
            "preferredAiProvider", "aiProviderSequence"
        ];

        textFields.forEach(field => {
            if (formData.has(field)) {
                settings[field] = formData.get(field);
            }
        });

        // Parse Dynamic Social Links
        if (formData.has("socialLinks")) {
            try {
                settings.socialLinks = JSON.parse(formData.get("socialLinks"));
            } catch (e) {
                console.error("Failed to parse social links:", e);
            }
        }

        // Parse Schema Markup
        if (formData.has("schemaMarkup") || formData.has("schema")) {
            let schemaRaw = formData.get("schemaMarkup") ?? formData.get("schema");
            if (typeof schemaRaw === 'string') {
                schemaRaw = cleanJsonInput(schemaRaw);
                if (schemaRaw === "" || schemaRaw === "{}") {
                    settings.schemaMarkup = {};
                } else {
                    try {
                        settings.schemaMarkup = JSON.parse(schemaRaw);
                    } catch (err) {
                        return Response.json({
                            success: false,
                            message: `Invalid JSON format in Global Schema Markup: ${err.message}`
                        }, { status: 400 });
                    }
                }
            }
        }

        await settings.save();

        
    // On-Demand Revalidation
    revalidatePath('/', 'layout');
    return Response.json({ success: true, message: "Global Settings updated", data: settings });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: error.message }, { status: 500 });
    }
}
