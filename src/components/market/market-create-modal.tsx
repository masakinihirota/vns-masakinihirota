"use client";

import { createMarketItemAction } from "@/app/actions/market";
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
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MarketCreateModalProps {
  nationId: string;
  onSuccess: () => void;
}

export const MarketCreateModal = ({
  nationId,
  onSuccess,
}: MarketCreateModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "sell" as "sell" | "buy_request",
    currency: "point",
  });
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!session?.user) {
      toast.error("ログインが必要です");
      setLoading(false);
      return;
    }

    try {
      await createMarketItemAction({
        nation_id: nationId,
        seller_id: session.user.id,
        seller_group_id: null,
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        currency: formData.currency,
        type: formData.type,
        status: "open",
      });
      setOpen(false);
      onSuccess();
      setFormData({
        title: "",
        description: "",
        price: "",
        type: "sell",
        currency: "point",
      });
      toast.success("出品しました");
    } catch (error) {
      console.error("Failed to create item", error);
      toast.error("出品に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Listing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Listing</DialogTitle>
          <DialogDescription>
            List an item for sale or request an item/service.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value: "sell" | "buy_request") =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sell">Sell (I want to sell)</SelectItem>
                <SelectItem value="buy_request">
                  Buy Request (I want to buy)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="col-span-3"
              required
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
