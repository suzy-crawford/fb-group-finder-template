import React from "react";

// SheFreelances AI icon set. Replaces Lucide (banned by the brand rules).
// Every icon: 24px grid, 1.75 stroke, rounded caps and joins, currentColor.
// The first group comes from the brand kit (brand-kit/icons). The rest were drawn
// to the same rules for things the kit doesn't cover yet.

function makeIcon(name, d) {
  const Icon = React.forwardRef(({ className = "w-5 h-5", strokeWidth, size, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size || 24}
      height={size || 24}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      <path d={d} />
    </svg>
  ));
  Icon.displayName = name;
  return Icon;
}

// From the brand kit (v2 adds home, search, bell, settings, plus, chevrons, copy, refresh, send, mail, pin)
export const Calendar = makeIcon("Calendar", "M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM4 10h16M9 3v4M15 3v4");
export const Clients = makeIcon("Clients", "M5.5 7.5h13a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2zM9 7.5v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3.5 12.5h17");
export const Close = makeIcon("Close", "M6 6l12 12M18 6L6 18");
export const Community = makeIcon("Community", "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 19.5c.6-3 2.8-5 5.5-5s4.9 2 5.5 5M16.5 11.5a2.5 2.5 0 1 0 0-5M16.5 14.5c2.2.2 3.6 1.9 4 5");
export const Complete = makeIcon("Complete", "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM8.5 12.2l2.4 2.4 4.6-5");
export const Highlight = makeIcon("Highlight", "M14 4.5l5.5 5.5-8 8H6v-5.5zM4 20.5h8");
export const Lessons = makeIcon("Lessons", "M12 6.5C10.5 5.2 8.3 4.5 4 4.5v13c4.3 0 6.5.7 8 2 1.5-1.3 3.7-2 8-2v-13c-4.3 0-6.5.7-8 2zM12 6.5v13");
export const LiveCalls = makeIcon("LiveCalls", "M5 6.5h9a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM16 10.5l5-3v9l-5-3");
export const Locked = makeIcon("Locked", "M7 10.5h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM8 10.5V8a4 4 0 0 1 8 0v2.5");
export const Menu = makeIcon("Menu", "M4 7h16M4 12h16M4 17h16");
export const Messages = makeIcon("Messages", "M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-4.5 3.5V6A1.5 1.5 0 0 1 5 4.5z");
export const Offer = makeIcon("Offer", "M4 4h8.2L20 11.8 11.8 20 4 12.2zM8.5 8.5h.01");
export const Play = makeIcon("Play", "M8 5.5v13l10.5-6.5z");
export const Progress = makeIcon("Progress", "M5 19.5v-6M12 19.5v-10M19 19.5v-15");

export const Home = makeIcon("Home", "M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z");

export const Bell = makeIcon("Bell", "M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 20.5h4");

export const Settings = makeIcon("Settings", "M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4");

export const ArrowUp = makeIcon("ArrowUp", "M12 19V5M6 11l6-6 6 6");

// Drawn to the same rules (not in the kit yet)
export const Check = makeIcon("Check", "M5 12.5l4.5 4.5L19 7.5");
export const ChevronRight = makeIcon("ChevronRight", "M10 7l5 5-5 5");
export const ChevronLeft = makeIcon("ChevronLeft", "M14.5 5.5L8 12l6.5 6.5");
export const ChevronDown = makeIcon("ChevronDown", "M7 10l5 5 5-5");
export const ChevronUp = makeIcon("ChevronUp", "M5.5 14.5L12 8l6.5 6.5");
export const ArrowLeft = makeIcon("ArrowLeft", "M19.5 12h-15M10.5 6l-6 6 6 6");
export const ArrowRight = makeIcon("ArrowRight", "M4.5 12h15M13.5 6l6 6-6 6");
export const Search = makeIcon("Search", "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4");
export const Alert = makeIcon("Alert", "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM12 7.5v5.5M12 16.5h.01");
export const Info = makeIcon("Info", "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM12 11v5.5M12 7.5h.01");
export const User = makeIcon("User", "M12 11.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c.8-3.7 3.8-6 7.5-6s6.7 2.3 7.5 6");
export const Copy = makeIcon("Copy", "M10 9h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zM5 15V5a1 1 0 0 1 1-1h10");
export const ExternalLink = makeIcon("ExternalLink", "M13.5 4.5h6v6M19.5 4.5l-8 8M17.5 13.5v5a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18.5v-10A1.5 1.5 0 0 1 6 7h5");
export const Refresh = makeIcon("Refresh", "M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4");
export const Trash = makeIcon("Trash", "M4.5 7h15M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M6.5 7l1 12a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5l1-12");
export const Pencil = makeIcon("Pencil", "M15 5.5l3.5 3.5L9 18.5H5.5V15zM13 7.5l3.5 3.5");
export const Mail = makeIcon("Mail", "M5 6.5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zM4.5 7.5 12 13l7.5-5.5");
export const Phone = makeIcon("Phone", "M6.5 4.5h3l1.5 4-2 1.5a10 10 0 0 0 5 5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.5 1.5A15 15 0 0 1 5 6a1.5 1.5 0 0 1 1.5-1.5z");
export const MapPin = makeIcon("MapPin", "M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z");
export const Globe = makeIcon("Globe", "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5s1.2-6.1 3.5-8.5z");
export const Instagram = makeIcon("Instagram", "M7.5 3.5h9a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4zM12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM17 7h.01");
export const ImagePic = makeIcon("ImagePic", "M5.5 4.5h13a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1zM4.5 15.5l4.5-4.5 4 4 2.5-2.5 4 4M14.5 9h.01");
export const ListLines = makeIcon("ListLines", "M9 7h11M9 12h11M9 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01");
export const LinkChain = makeIcon("LinkChain", "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1");
export const Megaphone = makeIcon("Megaphone", "M3.5 9.5h3l7-4.5v14l-7-4.5h-3zM17 9.5a3.5 3.5 0 0 1 0 5");
export const Beaker = makeIcon("Beaker", "M9 3.5h6M10 3.5v6L4.8 18.2A1.5 1.5 0 0 0 6.1 20.5h11.8a1.5 1.5 0 0 0 1.3-2.3L14 9.5v-6M7.2 14.5h9.6");
export const Facebook = makeIcon("Facebook", "M14.5 20.5v-7h2.5l.5-3h-3V8.5c0-1 .5-1.5 1.5-1.5h1.5V4.5h-2.5c-2.2 0-3.5 1.4-3.5 3.6v2.4H9v3h2.5v7");
export const Send = makeIcon("Send", "M20.5 3.5L10 14M20.5 3.5l-6.5 17-4-6.5-6.5-4z");
export const Plus = makeIcon("Plus", "M12 5v14M5 12h14");
export const Minus = makeIcon("Minus", "M5 12h14");
export const Dot = makeIcon("Dot", "M12 12h.01");
export const More = makeIcon("More", "M6 12h.01M12 12h.01M18 12h.01");
export const Grip = makeIcon("Grip", "M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01");
export const SignIn = makeIcon("SignIn", "M10 7.5l4.5 4.5-4.5 4.5M14.5 12h-10M13.5 4.5h4.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-4.5");
export const AddUser = makeIcon("AddUser", "M10 11.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 20.5c.7-3.7 3.4-6 7-6 1.6 0 3 .4 4.1 1.2M18.5 14.5v6M15.5 17.5h6");
export const Shield = makeIcon("Shield", "M12 3.5l7 2.5v5.5c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9V6zM8.8 12l2.2 2.2 4.2-4.4");
export const Panel = makeIcon("Panel", "M5 4.5h14A1.5 1.5 0 0 1 20.5 6v12a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18V6A1.5 1.5 0 0 1 5 4.5zM9.5 4.5v15");

// Names the old Lucide imports used, mapped to the brand set.
export {
  Close as X,
  Complete as CheckCircle2,
  Alert as AlertCircle,
  Alert as AlertTriangle,
  Locked as Lock,
  Refresh as RefreshCw,
  Trash as Trash2,
  Offer as FileText,
  User as UserIcon,
  More as MoreHorizontal,
  Grip as GripVertical,
  SignIn as LogIn,
  AddUser as UserPlus,
  Shield as ShieldCheck,
  Panel as PanelLeft,
  Home as LayoutDashboard,
  Home as Business,
  Dot as Circle,
};

// Meta Ads Builder (Oct 2026)
export const Store = makeIcon("Store", "M4 9.5l1.5-5h13L20 9.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5.5 12v7.5h13V12M10 19.5v-4.5h4v4.5");
export const Tag = makeIcon("Tag", "M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-6.1 6.1a1.5 1.5 0 0 1-2.1 0zM8 8h.01");
export const Target = makeIcon("Target", "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01");
export const FormDoc = makeIcon("FormDoc", "M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5zM9 8h6M9 12h6M9 16h3");
export const Cart = makeIcon("Cart", "M3.5 4.5h2l2 10h10l2-7H7M9.5 19.5h.01M16.5 19.5h.01");
export const Question = makeIcon("Question", "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM9.6 9.5a2.5 2.5 0 0 1 4.8.8c0 1.7-2.4 2.2-2.4 3.7M12 17h.01");
export const Wand = makeIcon("Wand", "M4.5 19.5l11-11M13.5 6.5l2 2M18 3.5v3M16.5 5h3M19.5 10v2M18.5 11h2M8 3.5v2M7 4.5h2");
export const Camera = makeIcon("Camera", "M4 8h3l1.5-2.5h7L17 8h3v11H4zM12 16.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z");
export const Video = makeIcon("Video", "M4 6.5h11v11H4zM15 10.5l5-3v9l-5-3");
export const ThumbUp = makeIcon("ThumbUp", "M7.5 10.5v9h-3v-9zM7.5 10.5l3.5-6.5a2 2 0 0 1 2 2.5l-.6 3h5.4a1.7 1.7 0 0 1 1.7 2l-1.2 6.3a2 2 0 0 1-2 1.7H7.5");
export const Comment = makeIcon("Comment", "M4.5 5.5h15v10h-9l-4 3.5v-3.5h-2z");
export const Share = makeIcon("Share", "M13.5 5l6 6-6 6v-3.5c-4.5 0-7 1.2-9 4 .7-4.6 3-8.2 9-9z");
export const Star = makeIcon("Star", "M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8z");
