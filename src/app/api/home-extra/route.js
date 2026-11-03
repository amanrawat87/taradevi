import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import HomeExtra from "../../models/HomeExtra";
import { z } from "zod";
import fs from "fs";
import path from "path";

const DEFAULT_HOME_EXTRA = [
    {
        _id: "6724a1b00000000000000031",
        choose_title: "Curated Living & Architectural Amenities",
        choose_subtitle: "Thoughtfully crafted mountain infrastructure blending alpine luxury with modern living.",
        product_title: "Signature Himalayan Residences & Enclaves",
        product_subtitle: "Explore our premier residential developments across Shimla and Kufri.",
        certified_title: "RERA Approved & Environmentally Certified",
        work_title: "Visionary Execution & On-Site Progress",
        work_subtitle: "Uncompromising engineering quality at every stage of alpine construction.",
        blog_title: "Himalayan Living Insights & Journal",
        blog_subtitle: "Stories of mountain architecture, alpine wellness, and real estate excellence.",
        contact_title: "Schedule Your Private Site Tour",
        contact_subtitle: "Experience Tara Devi Enclave firsthand in the scenic foothills of Shimla."
    }
];

// get, post, put, delete banner api
export async function GET() {
    try {
        await connectDB();
        let homeExtra = await HomeExtra.find();
        if (!homeExtra || homeExtra.length === 0) {
            try {
                const created = await HomeExtra.create({ ...DEFAULT_HOME_EXTRA[0], _id: undefined });
                homeExtra = [created];
            } catch (seedErr) {
                console.warn("HomeExtra auto-seed warning:", seedErr.message);
            }
        }
        if (!homeExtra || homeExtra.length === 0) {
            return Response.json(DEFAULT_HOME_EXTRA);
        }
        return Response.json(homeExtra);
    } catch (error) {
        console.warn("DB connection warning in /api/home-extra GET, serving active frontend fallback:", error.message);
        return Response.json(DEFAULT_HOME_EXTRA);
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
            const formData = await request.formData();
            body = Object.fromEntries(formData.entries());
        }

        const updateData = {
            choose_title: body.choose_title || "",
            choose_subtitle: body.choose_subtitle || "",
            product_title: body.product_title || "",
            product_subtitle: body.product_subtitle || "",
            certified_title: body.certified_title || "",
            work_title: body.work_title || "",
            work_subtitle: body.work_subtitle || "",
            blog_title: body.blog_title || "",
            blog_subtitle: body.blog_subtitle || "",
            contact_title: body.contact_title || "",
            contact_subtitle: body.contact_subtitle || "",
        };

        // Upsert: Find the first one and update it, or create if none exists.
        let homeExtra = await HomeExtra.findOne();
        if (homeExtra) {
            homeExtra = await HomeExtra.findByIdAndUpdate(homeExtra._id, updateData, { new: true });
        } else {
            homeExtra = await HomeExtra.create(updateData);
        }

        
    // On-Demand Revalidation
    revalidatePath('/', 'layout');
    return Response.json({
            message: "HomeExtra saved successfully",
            data: homeExtra,
        });

    } catch (error) {
        return Response.json(
            { message: "Save failed", error: error.message },
            { status: 500 }
        );
    }
}
