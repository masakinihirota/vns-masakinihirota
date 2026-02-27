"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
import type { Group } from "@/lib/db/types";

import { createGroup, getMyProfiles } from "./groups.logic";

/**
 *
 * @param root0
 * @param root0.onSuccess
 */
export function CreateGroupModal({
  onSuccess,
}: {
  onSuccess?: (group: Group) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const session: any = (useSession as any)();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]); // Removed Tables reference, using any[] as placeholder
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");

  useEffect(() => {
    if (open) {
      void getMyProfiles().then((data) => {
        setProfiles(data || []);
        if (data && data.length > 0) {
          setSelectedProfileId(data[0].id);
        }
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedProfileId) return;

    setLoading(true);
    // eslint-disable-next-line no-restricted-syntax
    try {
      const newGroup = await createGroup({
        name,
        description,
        leaderId: selectedProfileId, // Corrected to leaderId
      });
      setOpen(false);
      setName("");
      setDescription("");
      if (onSuccess) onSuccess(newGroup);
      toast.success("グループを作成しました");
    } catch (error) {
      console.error("Failed to create group:", error);
      toast.error("グループの作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Community Group</DialogTitle>
          <DialogDescription>
            Start a new community. You will be the leader.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profile" className="text-right">
                Leader Profile
              </Label>
              <Select
                value={selectedProfileId}
                onValueChange={setSelectedProfileId}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select your profile" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.display_name} ({profile.role_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
