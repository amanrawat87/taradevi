import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import HomeAbout from "../../models/HomeAbout";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { uploadFile, isUploadFile } from "../../../lib/upload";

const DEFAULT_HOME_ABOUT = [
    {
        _id: "6724a1b00000000000000011",
        title: "Embodying Himalayan Luxury, Architectural Poise & Pristine Mountain Serenity",
        description: "Tara Devi's Group is established upon a deep reverence for the majestic pine valleys and sacred summits of Himachal Pradesh. We craft bespoke residential sanctuaries harmoniously woven into untouched alpine landscapes.",
        image: "/images/about-tara-devi.jpg",
        alt: "Tara Devi Heritage Mountain Sanctuary"
    }
];

// get, post, put, delete banner api
export async function GET() {
    try {
        await connectDB();
        let homeAbout = await HomeAbout.find();
        if (!homeAbout || homeAbout.length === 0) {
            try {
                const created = await HomeAbout.create({
                    title: DEFAULT_HOME_ABOUT[0].title,
                    description: DEFAULT_HOME_ABOUT[0].description,
                    image: DEFAULT_HOME_ABOUT[0].image,
                    alt: DEFAULT_HOME_ABOUT[0].alt,
                });
                homeAbout = [created];
            } catch (seedErr) {
                console.warn("HomeAbout auto-seed warning:", seedErr.message);
            }
        }
        if (!homeAbout || homeAbout.length === 0) {
            return Response.json(DEFAULT_HOME_ABOUT);
        }
        return Response.json(homeAbout);
    } catch (error) {
        console.warn("DB connection warning in /api/home-about GET, serving active frontend fallback:", error.message);
        return Response.json(DEFAULT_HOME_ABOUT);
    }
}

export async function POST(request) {
    try {
        await connectDB();

        const formData = await request.formData();

        const title = formData.get("title") || "";
        const description = formData.get("description") || "";
        const image = formData.get("image"); // FILE
        const alt = formData.get("alt") || "";

        let imageUrl = undefined;

        if (isUploadFile(image)) {
            imageUrl = await uploadFile(image, "home-about", "homeabout");
        }

        const updateData = { title, description, alt };
        if (imageUrl) updateData.image = imageUrl;

        // Upsert
        let homeAbout = await HomeAbout.findOne();
        if (homeAbout) {
            // if we uploaded a new image, try to delete the old one
            if (imageUrl && homeAbout.image && homeAbout.image.startsWith("/uploads/")) {
                try {
                    const oldImagePath = path.join(process.cwd(), 'public', homeAbout.image);
                    if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
                } catch (fsErr) {
                    console.warn("Could not delete old home-about image:", fsErr.message);
                }
            }
            homeAbout = await HomeAbout.findByIdAndUpdate(homeAbout._id, updateData, { new: true });
        } else {
            homeAbout = await HomeAbout.create(updateData);
        }

        
    // On-Demand Revalidation
    revalidatePath('/', 'layout');
    return Response.json({
            message: "Home about saved successfully",
            data: homeAbout,
        });

    } catch (error) {
        return Response.json(
            { message: "Upload failed", error: error.message },
            { status: 500 }
        );
    }
}
