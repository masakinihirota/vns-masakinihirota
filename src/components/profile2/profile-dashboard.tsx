/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Plus,
  MoreVertical,
  Edit3,
  Copy,
  Trash2,
  User,
  Shield,
  Terminal,
  Clock,
  Search,
  LayoutGrid,
  List,
  AlertTriangle,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";

/**
 * ---------------------------------------------------------------------
 * MOCK DATA & TYPES
 * ---------------------------------------------------------------------
 */

interface UserProfile {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatarColor: string;
  lastUpdated: string;
  attributes: {
    purpose: string;
    role: string;
    type: "Main" | "Sub" | "Game" | "Work";
  };
}

const INITIAL_PROFILES: UserProfile[] = [
  {
    id: "p-001",
    name: "Alpha Operator",
    handle: "@alpha_op",
    bio: "メインの開発用アカウント。全システム権限を所有。緊急時のオーバーライドが可能。",
    avatarColor: "bg-blue-600",
    lastUpdated: "2024-05-10 14:30",
    attributes: { purpose: "Development", role: "Admin", type: "Main" },
  },
  {
    id: "p-002",
    name: "Night Owl",
    handle: "@night_gamer",
    bio: "深夜帯のゲーム配信およびコミュニティ活動用。FPS/RTSを中心に活動。",
    avatarColor: "bg-purple-600",
    lastUpdated: "2024-05-09 02:15",
    attributes: { purpose: "Gaming", role: "Player", type: "Game" },
  },
  {
    id: "p-003",
    name: "Public Relations",
    handle: "@official_pr",
    bio: "対外的なアナウンスを行うための広報アカウント。表現は常に丁寧語。",
    avatarColor: "bg-emerald-600",
    lastUpdated: "2024-05-01 09:00",
    attributes: { purpose: "Business", role: "Editor", type: "Work" },
  },
  {
    id: "p-004",
    name: "Ghost Shell",
    handle: "@null_ptr",
    bio: "匿名リサーチおよび情報収集用。足跡を残さない設定。",
    avatarColor: "bg-slate-600",
    lastUpdated: "2024-04-20 11:45",
    attributes: { purpose: "Research", role: "Viewer", type: "Sub" },
  },
];

/**
 * ---------------------------------------------------------------------
 * UI COMPONENTS (Simulating Shadcn UI for single-file portability)
 * ---------------------------------------------------------------------
 */

const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}: any) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants: any = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    destructive:
      "bg-red-900 text-red-100 hover:bg-red-800 border border-red-800",
    outline:
      "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-100",
    secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
    ghost: "hover:bg-slate-800 text-slate-400 hover:text-slate-100",
    link: "text-blue-500 underline-offset-4 hover:underline",
  };
  const sizes: any = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }: any) => (
  <div
    className={`rounded-xl border border-slate-800 bg-slate-950/50 text-slate-100 shadow text-card-foreground ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }: any) => {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variants: any = {
    default:
      "border-transparent bg-blue-900 text-blue-100 hover:bg-blue-900/80",
    secondary:
      "border-transparent bg-slate-800 text-slate-100 hover:bg-slate-800/80",
    outline: "text-slate-100",
  };
  return (
    <div className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const Input = ({ className = "", ...props }: any) => (
  <input
    className={`flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ children, className = "", ...props }: any) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  >
    {children}
  </label>
);

// Custom Modal (Dialog substitute)
const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-slate-100">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-slate-400">{description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4 text-slate-400" />
          <span className="sr-only">Close</span>
        </button>
        <div className="py-4">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Dropdown Mock (Simplified for preview)
const ActionMenu = ({ onEdit, onDuplicate, onDelete }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  // Click outside to close (simplified)
  useEffect(() => {
    const close = () => setIsOpen(false);
    if (isOpen) window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [isOpen]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e: any) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="h-8 w-8 text-slate-400 hover:text-white"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-10 w-48 overflow-hidden rounded-md border border-slate-800 bg-slate-900 p-1 shadow-md animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1.5 text-xs font-semibold text-slate-400">
            Actions
          </div>
          <button
            onClick={onEdit}
            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-800 hover:text-slate-100 text-slate-300"
          >
            <Edit3 className="mr-2 h-4 w-4" /> Edit Config
          </button>
          <button
            onClick={onDuplicate}
            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-800 hover:text-slate-100 text-slate-300"
          >
            <Copy className="mr-2 h-4 w-4" /> Duplicate
          </button>
          <div className="my-1 h-px bg-slate-800" />
          <button
            onClick={onDelete}
            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-red-900/30 text-red-500 hover:text-red-400"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * ---------------------------------------------------------------------
 * MAIN APPLICATION COMPONENT
 * ---------------------------------------------------------------------
 */

export default function ProfileDashboard() {
  const [profiles, setProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Create Form States
  const [newName, setNewName] = useState("");
  const [newHandle, setNewHandle] = useState("");
  const [newType, setNewType] = useState("Sub");

  // --- Handlers ---

  const handleCreate = () => {
    if (!newName || !newHandle) return; // Simple validation

    const newProfile: UserProfile = {
      id: `p-${crypto.randomUUID()}`,
      name: newName,
      handle: newHandle.startsWith("@") ? newHandle : `@${newHandle}`,
      bio: "No description provided yet.",
      avatarColor: "bg-slate-500",
      lastUpdated: "Just now",
      attributes: {
        purpose: "General",
        role: "User",
        type: newType as any,
      },
    };

    setProfiles([newProfile, ...profiles]);
    setIsCreateOpen(false);
    // Reset form
    setNewName("");
    setNewHandle("");
  };

  const handleDuplicate = (profile: UserProfile) => {
    const duplicated: UserProfile = {
      ...profile,
      id: `p-${crypto.randomUUID()}`,
      name: `${profile.name} (Copy)`,
      lastUpdated: "Just now",
    };
    setProfiles([duplicated, ...profiles]);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setProfiles(profiles.filter((p) => p.id !== deleteTarget));
      setDeleteTarget(null);
    }
  };

  // --- Helpers ---
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Main":
        return "border-blue-500 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]";
      case "Game":
        return "border-purple-500 text-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.2)]";
      case "Work":
        return "border-emerald-500 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
      default:
        return "border-slate-500 text-slate-500";
    }
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 selection:bg-blue-500/30">
      {/* Background Decor (Optional Grid) */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 pointer-events-none opacity-20" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/60 pb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-500" />
              Identity Dashboard
            </h1>
            <p className="text-slate-400 max-w-lg">
              管理下のユーザープロファイル一覧。
              <span className="font-mono text-xs text-slate-500 ml-2 bg-slate-900 px-1 py-0.5 rounded border border-slate-800">
                SYS.VER.2.4.0
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search profiles..."
                className="pl-9 bg-slate-900 border-slate-800 focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Initialize Profile
            </Button>
          </div>
        </div>

        {/* MOBILE SEARCH (Visible only on small screens) */}
        <div className="md:hidden">
          <Input
            placeholder="Search profiles..."
            className="bg-slate-900 border-slate-800"
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* PROFILE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProfiles.map((profile) => (
            <Card
              key={profile.id}
              className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:border-slate-600 hover:shadow-2xl hover:shadow-black/50 bg-slate-900/40 backdrop-blur-sm"
            >
              {/* Type Indicator Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50 group-hover:opacity-100 transition-opacity ${getTypeColor(profile.attributes.type).split(" ")[1]}`}
              />

              <div className="p-5 flex-1 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg ${profile.avatarColor} flex items-center justify-center text-white shadow-inner ring-1 ring-white/10`}
                    >
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 leading-tight group-hover:text-blue-400 transition-colors">
                        {profile.name}
                      </h3>
                      <p className="text-xs font-mono text-slate-500 mt-1">
                        {profile.handle}
                      </p>
                    </div>
                  </div>

                  {/* Actions Dropdown */}
                  <ActionMenu
                    onEdit={() => alert(`Navigating to edit: ${profile.id}`)}
                    onDuplicate={() => handleDuplicate(profile)}
                    onDelete={() => setDeleteTarget(profile.id)}
                  />
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={`${getTypeColor(profile.attributes.type)} bg-transparent border`}
                  >
                    {profile.attributes.type}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {profile.attributes.role}
                  </Badge>
                </div>

                {/* Bio */}
                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                  {profile.bio}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-auto border-t border-slate-800/50 bg-slate-950/30 p-3 px-5 flex items-center justify-between text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3 h-3" />
                  {profile.id}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {profile.lastUpdated}
                </span>
              </div>
            </Card>
          ))}

          {/* New Profile Placeholder Card (Optional visual cue) */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/20 p-8 text-slate-500 hover:border-blue-500/50 hover:bg-slate-900/50 hover:text-blue-500 transition-all group min-h-[280px]"
          >
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:border-blue-500/30 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <Plus className="w-8 h-8" />
            </div>
            <p className="font-medium">Create New Identity</p>
          </button>
        </div>

        {/* Empty Search Result */}
        {filteredProfiles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>No profiles found matching your query.</p>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Initialize New Profile"
        description="新しい識別子の基本情報を入力してください。詳細は後で編集可能です。"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Profile</Button>
          </>
        }
      >
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-slate-400">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Ex: Ghost Unit"
              className="col-span-3"
              value={newName}
              onChange={(e: any) => setNewName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="handle" className="text-right text-slate-400">
              Handle
            </Label>
            <Input
              id="handle"
              placeholder="@handle"
              className="col-span-3"
              value={newHandle}
              onChange={(e: any) => setNewHandle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right text-slate-400">
              Type
            </Label>
            <div className="col-span-3 flex gap-2">
              {["Main", "Sub", "Game", "Work"].map((type) => (
                <button
                  key={type}
                  onClick={() => setNewType(type)}
                  className={`px-3 py-1 rounded text-xs border transition-all ${
                    newType === type
                      ? `${getTypeColor(type)} bg-slate-900`
                      : "border-slate-800 text-slate-500 hover:border-slate-600"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Alert Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Are you absolutely sure?"
        description="この操作は取り消せません。このプロファイルに関連付けられたすべてのデータが完全に削除されます。"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-900 hover:bg-red-800 text-white border-red-800"
            >
              Permanently Delete
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-3 p-3 mb-2 rounded bg-red-950/20 border border-red-900/30 text-red-200 text-sm">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span>Warning: This action is irreversible.</span>
        </div>
      </Modal>
    </div>
  );
}
