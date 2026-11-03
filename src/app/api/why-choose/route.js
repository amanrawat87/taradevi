import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import WhyChoose from "../../models/whyChoose";
import { z } from "zod";
import { uploadFile, isUploadFile } from "../../../lib/upload";

const DEFAULT_WHY_CHOOSE = [
    {
        _id: "6724a1b00000000000000021",
        title: "High-Altitude Engineering & Seismic Safety",
        content: "Engineered for high-altitude mountain topography with earthquake-resistant structural frameworks adhering to stringent seismic safety codes.",
        icon: "/images/tara-enclave-banner-1.jpg",
        status: "active",
        sort: 1
    },
    {
        _id: "6724a1b00000000000000022",
        title: "Metro Living Conveniences",
        content: "Dedicated high-speed optical fiber, 24/7 power backup, central heating provisions, and smart home automation in mountain calm.",
        icon: "/images/tara-enclave-banner-2.jpg",
        status: "active",
        sort: 2
    },
    {
        _id: "6724a1b00000000000000023",
        title: "Sustainable Topography Integration",
        content: "Zero-waste construction methodologies and eco-conscious architectural layouts that naturally contour with the hillside deodar slopes.",
        icon: "/images/about-tara-devi.jpg",
        status: "active",
        sort: 3
    },
    {
        _id: "6724a1b00000000000000024",
        title: "Himalayan Wellness & Heated Pool",
        content: "Year-round temperature-controlled infinity pool overlooking breathtaking pine valleys, accompanied by a mountain meditation pavilion.",
        icon: "/images/residence-property-1.jpg",
        status: "active",
        sort: 4
    },
    {
        _id: "6724a1b00000000000000025",
        title: "Pristine Himalayan Air & Elevation",
        content: "Perched above 6,200 feet elevation with pristine Air Quality Index (AQI sub-25), providing unpolluted alpine freshness for life.",
        icon: "/images/residence-property-2.jpg",
        status: "active",
        sort: 5
    },
    {
        _id: "6724a1b00000000000000026",
        title: "Gated Security & Estate Concierge",
        content: "Round-the-clock 3-tier surveillance, biometric access, on-demand housekeeping, and private concierge for every residential need.",
        icon: "/images/tara-gallery-1.jpg",
        status: "active",
        sort: 6
    }
];

// get, post, put, delete banner api
export async function GET() {
    try {
        await connectDB();
        let whyChoose = await WhyChoose.find().sort({ sort: 1 });
        if (!whyChoose || whyChoose.length === 0) {
            try {
                await WhyChoose.insertMany(DEFAULT_WHY_CHOOSE.map(({ _id, ...item }) => item));
                whyChoose = await WhyChoose.find().sort({ sort: 1 });
            } catch (seedErr) {
                console.warn("WhyChoose auto-seed warning:", seedErr.message);
            }
        }
        if (!whyChoose || whyChoose.length === 0) {
            return Response.json(DEFAULT_WHY_CHOOSE);
        }
        return Response.json(whyChoose);
    } catch (error) {
        console.warn("DB connection warning in /api/why-choose GET, serving active frontend fallback:", error.message);
        return Response.json(DEFAULT_WHY_CHOOSE);
    }
}

export async function POST(request) {
    try {
        await connectDB();

        const formData = await request.formData();

        const title = formData.get("title");
        const content = formData.get("content");
        const status = formData.get("status");
        const sort = Number(formData.get("sort"));
        const icon = formData.get("icon"); // FILE

        if (!isUploadFile(icon)) {
            return Response.json(
                { message: "Valid icon file is required" },
                { status: 400 }
            );
        }

        const imageUrl = await uploadFile(icon, "why-choose", "why");

        // save to DB
        const whyChoose = await WhyChoose.create({
            title,
            content,
            status,
            sort,
            icon: imageUrl,
        });

        
    // On-Demand Revalidation
    revalidatePath('/', 'layout');
    return Response.json({
            message: "Why choose item created successfully",
            data: whyChoose,
        });

    } catch (error) {
        return Response.json(
            { message: "Upload failed", error: error.message },
            { status: 500 }
        );
    }
}

