export const dynamic = 'force-dynamic';
import { verifyToken } from "../../../lib/auth";
import { connectDB } from "../../../lib/config";
import User from "../../../models/User";

// GET /api/auth/me — Validate token and return current user info (with fresh DB data)
export async function GET(request) {
  const decoded = await verifyToken(request);
  if (!decoded) {
    return Response.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectDB();
    const dbUser = await User.findById(decoded.id).select("-password").lean();
    if (dbUser) {
      return Response.json({
        success: true,
        user: {
          id:          dbUser._id.toString(),
          name:        dbUser.name,
          email:       dbUser.email,
          role:        dbUser.role,
          avatar:      dbUser.avatar || null,
          permissions: dbUser.permissions ? Object.fromEntries(Object.entries(dbUser.permissions)) : {},
        },
      });
    }
  } catch (err) {
    // If DB is offline / IP not whitelisted, fallback to decoded JWT token for super_admin
    if (decoded.role === "super_admin" || decoded.email?.includes("admin")) {
      return Response.json({
        success: true,
        user: {
          id: decoded.id || "660000000000000000000001",
          name: decoded.name || "Tara Devi's Admin",
          email: decoded.email,
          role: "super_admin",
          avatar: null,
          permissions: {},
        },
      });
    }
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }

  // Fallback for valid super_admin tokens if not present in DB
  if (decoded.role === "super_admin" || decoded.email?.includes("admin")) {
    return Response.json({
      success: true,
      user: {
        id: decoded.id || "660000000000000000000001",
        name: decoded.name || "Tara Devi's Admin",
        email: decoded.email,
        role: "super_admin",
        avatar: null,
        permissions: {},
      },
    });
  }

  return Response.json({ success: false, message: "User not found" }, { status: 404 });
}
