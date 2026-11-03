import mongoose from "mongoose";

const GlobalSettingSchema = new mongoose.Schema({
    // Branding
    logoImage: { type: String, default: "/images/logo.png" },
    adminLogo: { type: String, default: "/jindal-logo.jpg" },
    favicon: { type: String, default: "/favicon.ico" },
    adminTitle: { type: String, default: "Jindal Metals" },
    footerDescription: { 
        type: String, 
        default: "Leading manufacturer and supplier of high-quality metal products delivering excellence and innovation." 
    },

    // Contact Info
    primaryEmail: { type: String, default: "info@jindalmetals.com" },
    primaryPhone: { type: String, default: "+91 93235 82341" },
    footerPhone: { type: String, default: "+91 98765 43210" },
    address: { type: String, default: "New Delhi, India" },

    // Brochures
    pdf1Text: { type: String, default: "Stainless steel BROCHURE" },
    pdf1Url: { type: String, default: "/pdf/company-profile.pdf" },
    
    pdf2Text: { type: String, default: "High Carbon & H & T BROCHURE" },
    pdf2Url: { type: String, default: "#" },

    // Dynamic Social Media Links
    socialLinks: {
        type: [{
            platform: String,
            url: String,
            icon: String,
            isActive: { type: Boolean, default: true }
        }],
        default: [
            { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'bi-linkedin' },
            { platform: 'Facebook', url: 'https://facebook.com', icon: 'bi-facebook' },
            { platform: 'Twitter', url: 'https://x.com', icon: 'bi-twitter-x' },
            { platform: 'Instagram', url: 'https://instagram.com', icon: 'bi-instagram' }
        ]
    },

    // Maintenance Mode
    isMaintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: "We are currently undergoing scheduled maintenance. Please check back soon." },
    emergencyShutdown: { type: Boolean, default: false },

    // Integrations
    googleAnalyticsId: { type: String, default: "" },
    googleTagManagerId: { type: String, default: "" },
    googleSearchConsoleKey: { type: String, default: "" },

    // Custom Code Injection
    customHeadCode: { type: String, default: "" },
    customBodyCode: { type: String, default: "" },

    // SEO — Schema & Robots.txt
    schemaMarkup: { type: mongoose.Schema.Types.Mixed, default: {} },
    robotsTxt: { type: String, default: "User-agent: *\nAllow: /\n\nSitemap: /sitemap.xml" },

    // AI Settings - Multi-provider with fallback
    geminiApiKey: { type: String, default: "" },
    openRouterApiKey: { type: String, default: "" },
    groqApiKey: { type: String, default: "" },
    cerebrasApiKey: { type: String, default: "" },
    aiProviderSequence: { type: String, default: "groq,cerebras,openrouter,gemini" },
    preferredAiProvider: { type: String, default: "auto" } // "auto" | "openrouter" | "groq" | "cerebras" | "gemini"
}, { timestamps: true });

// Force-delete any cached model to ensure schema changes are always picked up.
// This is safe in production (runs once on cold start) and fixes HMR caching in development.
if (mongoose.models['GlobalSetting']) {
    delete mongoose.models['GlobalSetting'];
}

export default mongoose.model("GlobalSetting", GlobalSettingSchema);
