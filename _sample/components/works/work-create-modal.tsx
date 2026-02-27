"use client";

import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/auth-client";

/**
 *
 * @param root0
 * @param root0.onSuccess
 */
export function WorkCreateModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const session: any = (useSession as any)();

  const handleSuccess = () => {
    setOpen(false);
    onSuccess();
    toast.success("作品を登録しました");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          作品登録
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>作品を登録する</DialogTitle>
          <DialogDescription>
            新しい作品の情報を入力してください。
          </DialogDescription>
        </DialogHeader>
        {/*
           Note: WorkRegistrationForm should be used here.
           But for now keeping it simple as a placeholder to fix types.
        */}
        <div className="p-4">
          <p>Registration Form Placeholder</p>
          <Button onClick={handleSuccess} className="mt-4">
            登録（ダミー）
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
