import {
  Briefcase,
  CreditCard,
  Flag,
  Gift,
  GraduationCap,
  Grid,
  Heart,
  Home,
  Lightbulb,
  Link2,
  List,
  Medal,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Trophy,
  User,
  UserCircle,
  UserPlus,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  // core
  "/": Home,
  "/matching": Heart,
  "/user-profiles": User,
  "/profiles": User,
  "/user-profiles/new": UserPlus,

  // community / org
  "/groups": Users,
  "/nations": Flag,

  // discovery / works
  "/search": Search,
  "/home": Home,
  "/home/search": Search,
  "/recommendations": Star,
  "/works": Briefcase,
  "/market": ShoppingBag,
  "/works/continuous-rating": Star,

  // features
  "/values": Lightbulb,
  "/skills": Wrench,
  "/lists": List,
  "/chains": Link2,
  "/mandala": Grid,

  // progress / gamification
  "/achievements": Trophy,
  "/badges": Medal,
  "/rewards": Gift,
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
