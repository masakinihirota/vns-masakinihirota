"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useCreateNation } from "./nations.logic";

interface NationCreateModalProps {
  onSuccess?: () => void;
}

export const NationCreateModal = ({ onSuccess }: NationCreateModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { createNation } = useCreateNation();

  const handleCreate = async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login");
      setLoading(false);
      return;
    }

    try {
      await createNation(name, description, user.id);
      setOpen(false);
      setName("");
      setDescription("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to create nation", error);
      alert("Failed to create nation. Please ensure you have 1000 points.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>建国する (Create Nation)</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Nation</DialogTitle>
          <DialogDescription>
            Establish your own nation.
            <br />
            <span className="font-bold text-red-500">
              Foundation Fee: 1000 Points
            </span>
          </DialogDescription>
        </DialogHeader>
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
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Pay 1000 Points & Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
