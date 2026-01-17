import {
  Home,
  User,
  Search,
  Heart,
  Flag,
  Users,
  Briefcase,
  Lightbulb,
  Wrench,
  List,
  Link2,
  Grid,
  Trophy,
  Medal,
  Star,
  GraduationCap,
  Settings,
  CreditCard,
  UserCircle,
  UserPlus,
  Layout,
  Eye,
  Sparkles,
  PenTool,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  // core
  "/": Home,
  "/matching": Heart,
  "/user-profiles": User,
  "/profiles": User,
  "/user-profiles/new": UserPlus,
  "/user-profiles/prototypes/simple": Layout,
  "/user-profiles/prototypes/ui-view": Eye,
  "/user-profiles/prototypes/complex": Sparkles,
  "/user-profiles/prototypes/creation": PenTool,

  // community / org
  "/groups": Users,
  "/nations": Flag,

  // discovery / works
  "/search": Search,
  "/home": Home,
  "/home/search": Search,
  "/recommendations": Star,
  "/works": Briefcase,

  // features
  "/values": Lightbulb,
  "/skills": Wrench,
  "/lists": List,
  "/chains": Link2,
  "/mandala": Grid,

  // progress / gamification
  "/achievements": Trophy,
  "/badges": Medal,
  "/results": Star,

  // misc
  "/notifications": Star,
  "/tutorial": GraduationCap,

  // account / billing
  "/settings": Settings,
  "/pricing": CreditCard,
  "/root-accounts": UserCircle,

  // public footer
  "/help": GraduationCap,
  "/about": Star,
  "/contact": Star,
  "/privacy": Star,
  "/terms": Star,
  "/onboarding": GraduationCap,
  "/onboarding/guest": GraduationCap,
  "/register": UserPlus,
  "/oasis": Lightbulb,
  "/messages": User,
  "/activity": Star,
};

// Get icon for manifest route (fallback is List)
export const iconFor = (manifestPath: string): LucideIcon => {
  const key = manifestPath === "/" ? "/" : manifestPath;
  return ICON_MAP[key] ?? List;
};
