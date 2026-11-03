import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import { NextResponse } from "next/server";

import GalleryImage from "../../models/GalleryImage";
import { uploadFile, isUploadFile } from "../../../lib/upload";

const DEFAULT_GALLERY_IMAGES = [
    {
        _id: "6724a1b00000000000000051",
        caption: "Tara Devi Enclave — Himalayan Valley & Mountain Horizon",
        url: "/images/tara-enclave-banner-2.jpg",
        category: "Vistas",
        sort: 1,
        date: new Date().toISOString().split('T')[0]
    },
    {
        _id: "6724a1b00000000000000052",
        caption: "Tara Devi Residences — Multi-Story Hillside Elevation & Forest Backdrop",
        url: "/images/residence-property-1.jpg",
        category: "Architecture",
        sort: 2,
        date: new Date().toISOString().split('T')[0]
    },
    {
        _id: "6724a1b00000000000000053",
        caption: "Panoramic Aerial View — Enclave Nestled in Pine Valleys",
        url: "/images/about-tara-devi.jpg",
        category: "Nature",
        sort: 3,
        date: new Date().toISOString().split('T')[0]
    },
    {
        _id: "6724a1b00000000000000054",
        caption: "Tara Devi Enclave — Scenic Mountain Approach & Gated Living",
        url: "/images/tara-enclave-banner-1.jpg",
        category: "Vistas",
        sort: 4,
        date: new Date().toISOString().split('T')[0]
    },
    {
        _id: "6724a1b00000000000000055",
        caption: "Signature Alpine Architecture & Distinctive Green Rooflines",
        url: "/images/residence-property-2.jpg",
        category: "Architecture",
        sort: 5,
        date: new Date().toISOString().split('T')[0]
    },
    {
        _id: "6724a1b00000000000000056",
        caption: "Tara Devi Himalayan Sanctuary — Serene Forest Slopes at 6,200+ Ft.",
        url: "/images/tara-gallery-1.jpg",
        category: "Nature",
        sort: 6,
        date: new Date().toISOString().split('T')[0]
    }
];

export async function GET(request) {
    try {
        await connectDB();
        let images = await GalleryImage.find().sort({ sort: 1, createdAt: -1 }).lean();
        if (!images || images.length === 0) {
            try {
                await GalleryImage.insertMany(DEFAULT_GALLERY_IMAGES.map(({ _id, ...img }) => img));
                images = await GalleryImage.find().sort({ sort: 1, createdAt: -1 }).lean();
            } catch (seedErr) {
                console.warn("Gallery auto-seed warning:", seedErr.message);
            }
        }
        if (!images || images.length === 0) {
            return NextResponse.json(DEFAULT_GALLERY_IMAGES);
        }
        return NextResponse.json(images);
    } catch (error) {
        console.warn("DB connection warning in /api/gallery-images GET, serving active frontend fallback:", error.message);
        return NextResponse.json(DEFAULT_GALLERY_IMAGES);
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const formData = await request.formData();
        
        // Upload multiple images
        // Frontend will send them as files[0], files[1]... and captions[0]...
        const files = [];
        const captions = [];
        
        for (let [key, value] of formData.entries()) {
            if (key.startsWith('files[')) {
                files.push(value);
            } else if (key.startsWith('captions[')) {
                captions.push(value);
            }
        }

        if (files.length === 0) {
            return Response.json({ message: "No files uploaded" }, { status: 400 });
        }

        const createdImages = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const caption = captions[i] || "";
            
            if (isUploadFile(file)) {
                const fileUrl = await uploadFile(file, "gallery", "gal");

                const img = await GalleryImage.create({
                    caption,
                    url: fileUrl,
                    date: new Date().toISOString().split('T')[0] // current date YYYY-MM-DD
                });
                createdImages.push(img);
            }
        }

        
    // On-Demand Revalidation
    revalidatePath('/', 'layout');
    return Response.json({
            message: `${createdImages.length} images uploaded successfully`,
            data: createdImages,
        });

    } catch (error) {
        return Response.json({ message: "Upload failed", error: error.message }, { status: 500 });
    }
}
