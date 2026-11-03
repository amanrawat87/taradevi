'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Home,
  FileText,
  Package,
  FileEdit,
  MessageSquare,
  Contact,
  Settings,
  Image as ImageIcon,
  Users,
  Award,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Zap,
  Sparkles
} from 'lucide-react';

const NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    permission: null,
  },
  {
    id: 'home',
    label: 'Home Management',
    icon: Home,
    permission: 'home',
    children: [
      { label: 'Hero Banners',       href: '/dashboard/home/banner' },
      { label: 'About Section',      href: '/dashboard/home/about' },
      { label: 'Why Choose & Amenities', href: '/dashboard/home/why-choose' },
      { label: 'Heading Text',       href: '/dashboard/home/heading-text' },
      { label: 'Homepage SEO',       href: '/dashboard/home/seo' },
    ],
  },
  {
    id: 'inner-pages',
    label: 'Inner Pages',
    icon: FileText,
    permission: 'inner_pages',
    href: '/dashboard/inner-pages/sections',
  },
  {
    id: 'custom-pages',
    label: 'Custom Pages',
    icon: FileText,
    permission: 'inner_pages',
    href: '/dashboard/custom-pages',
  },
  {
    id: 'products',
    label: 'Product Management',
    icon: Package,
    permission: 'products',
    children: [
      { label: 'Product Categories', href: '/dashboard/products/categories' },
      { label: 'All Products',       href: '/dashboard/products' },
    ],
  },
  {
    id: 'blogs',
    label: 'Blogs Management',
    icon: FileEdit,
    href: '/dashboard/blogs',
    permission: 'blogs',
  },
  {
    id: 'enquiries',
    label: 'Enquiry Management',
    icon: MessageSquare,
    href: '/dashboard/enquiries',
    permission: 'enquiries',
  },
  {
    id: 'contact-cms',
    label: 'Contact Page CMS',
    icon: Contact,
    href: '/dashboard/contact',
    permission: 'contact_cms',
  },
  {
    id: 'gallery',
    label: 'Gallery Management',
    icon: ImageIcon,
    href: '/dashboard/gallery',
    permission: 'gallery',
  },
  // {
  //   id: 'team',
  //   label: 'Team & Jobs',
  //   icon: Users,
  //   href: '/dashboard/team',
  //   permission: 'team',
  // },
  {
    id: 'certifications',
    label: 'Certifications',
    icon: Award,
    href: '/dashboard/certifications',
    permission: 'certifications',
  },
  {
    id: 'email-templates',
    label: 'Email Templates',
    icon: MessageSquare,
    href: '/dashboard/email-templates',
    permission: 'email_templates',
  },
  {
    id: 'file-manager',
    label: 'File Manager',
    icon: FileText,
    href: '/dashboard/files',
    permission: 'file_manager',
  },
  {
    id: 'global-settings',
    label: 'Global Settings',
    icon: Settings,
    permission: 'global_settings',
    children: [
      { label: 'General Settings', href: '/dashboard/settings' },
      { label: 'Page Banners',     href: '/dashboard/settings/page-banners' },
    ],
  },
  {
    id: 'ai-features',
    label: 'AI Features',
    icon: Sparkles,
    href: '/dashboard/advanced/ai',
    permission: 'ai_features',
  },
];

const ADMIN_NAV = [
  {
    id: 'manage-users',
    label: 'Manage Users',
    icon: ShieldCheck,
    href: '/dashboard/users',
  },
  {
    id: 'security-settings',
    label: 'Security Settings',
    icon: ShieldCheck,
    href: '/dashboard/security',
  },
  {
    id: 'advanced',
    label: 'Advanced Features',
    icon: Zap,
    children: [
      { label: 'SEO Health Audit',    href: '/dashboard/advanced/seo-audit' },
      { label: 'Redirect Manager',    href: '/dashboard/advanced/redirects' },
      { label: 'Sitemap Manager',     href: '/dashboard/advanced/sitemap' },
      { label: 'Integrations & Code', href: '/dashboard/advanced/integrations' },
      { label: 'Performance Monitor', href: '/dashboard/advanced/performance' },
      { label: 'Error & 404 Monitor', href: '/dashboard/advanced/error-monitor' },
      { label: 'Activity Logs',       href: '/dashboard/logs' },
      { label: 'Cache Management',    href: '/dashboard/advanced/cache' },
      { label: 'Maintenance Mode',    href: '/dashboard/advanced/maintenance' },
      { label: 'Backup Management',   href: '/dashboard/advanced/backups' },
    ],
  },
];

function NestedNavChild({ child, pathname }) {
  const isActive = child.children.some(c => pathname === c.href);
  const [open, setOpen] = useState(isActive);
  return (
    <div className="space-y-1">
      <div 
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium cursor-pointer transition-colors",
          isActive || open ? "text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
        )}
      >
        <span>{child.label}</span>
        <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-90")} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-3 border-l border-slate-700/50 ml-3 space-y-1 overflow-hidden"
          >
            {child.children.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className={cn(
                  "block px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors",
                  pathname === sub.href
                    ? "text-[#E4C794] bg-[#0E3326]/80 border-l-2 border-[#CFA86E] font-medium"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                )}
              >
                {sub.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ item, isActive, isChildActive, hasModuleAccess, isHovered }) {
  const [open, setOpen] = useState(isChildActive);
  const pathname = usePathname();

  useEffect(() => {
    if (!isHovered) {
      setOpen(false);
    } else {
      if (isChildActive) setOpen(true);
    }
  }, [isHovered, isChildActive]);

  if (item.permission && !hasModuleAccess(item.permission)) return null;

  const hasChildren = item.children && item.children.length > 0;

  const isItemActive = isActive || isChildActive;

  const content = (
    <div className={cn(
      "flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-all group cursor-pointer",
      "group-hover/aside:px-3",
      isItemActive
        ? "group-hover/aside:bg-[#0E3326] group-hover/aside:border group-hover/aside:border-[#CFA86E]/40 group-hover/aside:shadow-sm text-[#E4C794]"
        : "text-slate-400 group-hover/aside:hover:bg-slate-800/80 group-hover/aside:hover:text-white"
    )}>
      {/* Icon wrapper: in collapsed mode, a centered square; in expanded, just the icon */}
      <div className={cn(
        "shrink-0 flex items-center justify-center rounded-lg transition-all duration-200",
        // collapsed: fixed 36×36 square with active bg
        "w-9 h-9 group-hover/aside:w-5 group-hover/aside:h-5 group-hover/aside:rounded-none group-hover/aside:bg-transparent",
        isItemActive
          ? "bg-[#0E3326] border border-[#CFA86E]/40 shadow-sm group-hover/aside:bg-transparent"
          : "bg-transparent hover:bg-slate-800/80 group-hover/aside:hover:bg-transparent"
      )}>
        <item.icon className={cn(
          "w-5 h-5 shrink-0 transition-colors",
          isItemActive ? "text-[#E4C794]" : "text-slate-400 group-hover:text-white"
        )} />
      </div>
      <span className="flex-1 truncate opacity-0 group-hover/aside:opacity-100 max-lg:opacity-100 transition-all duration-300 w-0 group-hover/aside:w-auto max-lg:w-auto overflow-hidden">{item.label}</span>
      {hasChildren && (
        <ChevronRight className={cn(
          "w-4 h-4 shrink-0 transition-all duration-200 opacity-0 group-hover/aside:opacity-100 max-lg:opacity-100 w-0 group-hover/aside:w-auto max-lg:w-auto",
          open && "rotate-90"
        )} />
      )}
    </div>
  );

  return (
    <div className="space-y-1">
      {hasChildren ? (
        <div onClick={() => setOpen(!open)}>{content}</div>
      ) : (
        <Link href={item.href}>{content}</Link>
      )}

      <AnimatePresence initial={false}>
        {hasChildren && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-7 space-y-1 opacity-0 group-hover/aside:opacity-100 max-lg:opacity-100 transition-opacity duration-300"
          >
            {item.children.map((child) => {
              if (child.children) {
                return <NestedNavChild key={child.label} child={child} pathname={pathname} />;
              }
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-[13px] font-medium transition-colors",
                    pathname === child.href
                      ? "text-[#E4C794] bg-[#0E3326]/80 border-l-2 border-[#CFA86E] font-medium"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  )}
                >
                  {child.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const pathname = usePathname();
  const { user, hasModuleAccess, isSuperAdmin } = useAuth();
  const [sections, setSections] = useState([]);
  const [globalSettings, setGlobalSettings] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchSections = () => {
      fetch('/api/sections')
        .then(res => res.json())
        .then(json => {
          if (Array.isArray(json)) {
            setSections(json);
          } else if (json.data && Array.isArray(json.data)) {
            setSections(json.data);
          }
        })
        .catch(err => console.error("Failed to fetch sections", err));
    };

    fetchSections();
    window.addEventListener('sectionsUpdated', fetchSections);

    fetch('/api/global-settings')
      .then(res => res.json())
      .then(json => {
        if (json.data) setGlobalSettings(json.data);
      })
      .catch(err => console.error("Failed to fetch global settings", err));

    return () => window.removeEventListener('sectionsUpdated', fetchSections);
  }, []);

  useEffect(() => {
    // Close mobile sidebar automatically on route change
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [pathname]);

  const dynamicNav = NAV.map(item => {
    if (item.id === 'inner-pages') {
      return {
        ...item,
        children: [
          { label: 'Manage Sections', href: '/dashboard/inner-pages/sections' },
          { 
            label: 'Manage Pages', 
            children: sections.map(sec => ({
              label: sec.name || sec.sectionName || 'Unnamed Section',
              href: `/dashboard/inner-pages/${sec.slug}`
            }))
          }
        ]
      };
    }
    return item;
  });

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "border-r border-[#1e293b] bg-[#0f172a] shrink-0 flex flex-col h-screen fixed lg:sticky top-0 z-[70] transition-all duration-300 group/aside overflow-x-hidden",
          mobileMenuOpen 
            ? "w-[260px] translate-x-0" 
            : "w-[260px] -translate-x-full lg:w-[84px] lg:translate-x-0 lg:hover:w-[260px]"
        )}
      >
      <div className="p-6 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 shrink-0 bg-white/10 border border-[#CFA86E]/40 rounded-lg flex items-center justify-center shadow-sm overflow-hidden relative">
            <Image src={globalSettings.adminLogo || "/images/tara-devis-seal.png"} alt="Logo" fill className="object-contain p-0.5" />
          </div>
          <span className="font-serif font-bold text-base tracking-wide text-[#E4C794] opacity-0 group-hover/aside:opacity-100 max-lg:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden w-0 group-hover/aside:w-auto max-lg:w-auto">{globalSettings.adminTitle || "Tara Devi's Group"}</span>
        </div>
        
        <div className="space-y-4">
           <div>
             <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3 opacity-0 group-hover/aside:opacity-100 max-lg:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden w-0 group-hover/aside:w-auto max-lg:w-auto">Main Menu</p>
             <nav className="space-y-1">
                {dynamicNav.map((item) => {
                  const isActive = pathname === item.href;
                  const isChildActive = item.children?.some(c => pathname === c.href);
                  return (
                    <NavItem 
                      key={item.id} 
                      item={item} 
                      isActive={isActive} 
                      isChildActive={isChildActive}
                      hasModuleAccess={hasModuleAccess}
                      isHovered={isHovered}
                    />
                  );
                })}
             </nav>
           </div>

           {isSuperAdmin && isSuperAdmin() && (
             <div>
               <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3 opacity-0 group-hover/aside:opacity-100 max-lg:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden w-0 group-hover/aside:w-auto max-lg:w-auto">Administration</p>
               <nav className="space-y-1">
                  {ADMIN_NAV.map((item) => {
                    const isActive = pathname === item.href;
                    const isChildActive = item.children?.some(c => pathname === c.href);
                    return (
                      <NavItem 
                        key={item.id} 
                        item={item} 
                        isActive={isActive} 
                        isChildActive={isChildActive}
                        hasModuleAccess={() => true} // Super admins have access to all admin items
                        isHovered={isHovered}
                      />
                    );
                  })}
               </nav>
             </div>
           )}
        </div>
      </div>
      
      <div className="p-6 border-t border-[#1e293b] bg-[#0b1221]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0E3326] border border-[#CFA86E]/40 overflow-hidden shrink-0 shadow-sm flex items-center justify-center text-[#E4C794] font-bold text-sm">
             {user?.avatar
               ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
               : (user?.name || 'A').charAt(0).toUpperCase()
             }
          </div>
          <div className="min-w-0 opacity-0 group-hover/aside:opacity-100 max-lg:opacity-100 transition-all duration-300 w-0 group-hover/aside:w-auto max-lg:w-auto overflow-hidden whitespace-nowrap">
            <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-[11px] font-medium text-slate-400 truncate tracking-wide">
              {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
            </p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
