import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import Banner from "../../models/Banner";
import { z } from "zod";
import { uploadFile, isUploadFile } from "../../../lib/upload";

const DEFAULT_BANNERS = [
    {
        _id: "6724a1b00000000000000001",
        title: "Setting a New Standard for Luxury Mountain Living",
        subtitle: "Tara Devi Enclave — Premium 2 & 3 BHK Mountain Residences Under Active Construction in the Foothills of Shimla",
        buttonText: "Explore Residences",
        url: "#residences",
        image: "/images/tara-enclave-banner-2.jpg",
        alt: "Tara Devi Enclave Himalayan Valley Panorama",
        status: "active",
        sort: 1,
        showCertifications: true,
        createdAt: new Date().toISOString()
    },
    {
        _id: "6724a1b00000000000000002",
        title: "Where Modern Architecture Meets Himalayan Serenity",
        subtitle: "Tara Devi Enclave — Harmonized with Natural Alpine Topography & Ancient Deodar Pine Slopes at 6,200+ Ft.",
        buttonText: "Explore Residences",
        url: "#residences",
        image: "/images/tara-enclave-banner-1.jpg",
        alt: "Tara Devi Enclave Aerial Drone View",
        status: "active",
        sort: 2,
        showCertifications: true,
        createdAt: new Date().toISOString()
    }
];

// get, post, put, delete banner api

export async function GET() {
    try {
        await connectDB();
        let banners = await Banner.find().sort({ sort: 1 }).lean();
        if (!banners || banners.length === 0) {
            try {
                await Banner.insertMany(DEFAULT_BANNERS.map(({ _id, ...b }) => b));
                banners = await Banner.find().sort({ sort: 1 }).lean();
            } catch (seedErr) {
                console.warn("Banner auto-seed failed:", seedErr.message);
            }
        }
        if (!banners || banners.length === 0) {
            return Response.json(DEFAULT_BANNERS);
        }
        return Response.json(banners);
    } catch (error) {
        console.warn("DB connection warning in /api/banner GET, serving active frontend fallback:", error.message);
        return Response.json(DEFAULT_BANNERS);
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const formData = await request.formData();
        const title = formData.get("title");
        const subtitle = formData.get("subtitle");
        const url = formData.get("url");
        const buttonText = formData.get("buttonText");
        const alt = formData.get("alt");
        const status = formData.get("status");
        const sort = Number(formData.get("sort"));
        const showCertifications = formData.get("showCertifications") === "true";
        const image = formData.get("image");

        if (!isUploadFile(image)) {
            return Response.json(
                { message: "Valid image is required" },
                { status: 400 }
            );
        }

        const imageUrl = await uploadFile(image, "banner", "banner");

        // save to DB
        const banner = await Banner.create({
            title,
            subtitle,
            url,
            buttonText,
            alt,
            status,
            sort,
            showCertifications,
            image: imageUrl,
        });

        // Trigger on-demand ISR revalidation so Vercel updates the frontend instantly
        const { revalidatePath } = require("next/cache");
        revalidatePath('/', 'layout');

        return Response.json({
            message: "Banner created successfully",
            data: banner,
        });

    } catch (error) {
        return Response.json(
            { message: "Upload failed", error: error.message },
            { status: 500 }
        );
    }
}

