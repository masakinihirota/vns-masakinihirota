import { Plus, Search, Shield, User, Terminal, Clock, AlertTriangle } from "lucide-react";
import React from "react";
import { ActionMenu } from "./components/action-menu";
import { Button, Card, Badge, Input, Label, Modal } from "./local-ui";
import { UserProfile, getTypeColor } from "./profile-list.logic";

interface ProfileListViewProps {
  profiles: UserProfile[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Create Modal State
  isCreateOpen: boolean;
  setIsCreateOpen: (isOpen: boolean) => void;
  newName: string;
  setNewName: (name: string) => void;
  newHandle: string;
  setNewHandle: (handle: string) => void;
  newType: string;
  setNewType: (type: string) => void;
  handleCreate: () => void;
  // Item Actions
  handleDuplicate: (profile: UserProfile) => void;
  setDeleteTarget: (id: string | null) => void;
  // Delete Modal
  deleteTarget: string | null;
  handleDelete: () => void;
}

export const ProfileListView: React.FC<ProfileListViewProps> = ({
  profiles,
  searchQuery,
  setSearchQuery,
  isCreateOpen,
  setIsCreateOpen,
  newName,
  setNewName,
  newHandle,
  setNewHandle,
  newType,
  setNewType,
  handleCreate,
  handleDuplicate,
  setDeleteTarget,
  deleteTarget,
  handleDelete,
}) => {
  const filteredProfiles = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.handle.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 selection:bg-blue-500/30">
      {/* Background Decor */}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
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

        {/* MOBILE SEARCH */}
        <div className="md:hidden">
          <Input
            placeholder="Search profiles..."
            className="bg-slate-900 border-slate-800"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
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
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50 group-hover:opacity-100 transition-opacity ${
                  getTypeColor(profile.attributes.type).split(" ")[1]
                }`}
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
                      <p className="text-xs font-mono text-slate-500 mt-1">{profile.handle}</p>
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
                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{profile.bio}</p>
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

          {/* New Profile Placeholder Card */}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewHandle(e.target.value)}
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
};
