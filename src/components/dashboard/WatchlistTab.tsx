import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Bell, Edit2, TrendingUp, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface WatchlistItem {
  id: string;
  asset_type: string;
  asset_id: string;
  asset_name: string;
  asset_symbol?: string;
  alert_enabled: boolean;
  alert_price_above?: number;
  alert_price_below?: number;
  alert_volume_threshold?: number;
  notes?: string;
}

export const WatchlistTab = () => {
  const { user } = useAuthUser();
  const { toast } = useToast();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WatchlistItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [assetType, setAssetType] = useState<string>("ipo");
  const [assetName, setAssetName] = useState("");
  const [assetSymbol, setAssetSymbol] = useState("");
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [priceAbove, setPriceAbove] = useState("");
  const [priceBelow, setPriceBelow] = useState("");
  const [volumeThreshold, setVolumeThreshold] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  const fetchWatchlist = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load watchlist",
        variant: "destructive",
      });
    } else {
      setWatchlist(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setAssetType("ipo");
    setAssetName("");
    setAssetSymbol("");
    setAlertEnabled(false);
    setPriceAbove("");
    setPriceBelow("");
    setVolumeThreshold("");
    setNotes("");
    setEditingItem(null);
  };

  const handleAdd = async () => {
    if (!user || !assetName.trim()) {
      toast({
        title: "Error",
        description: "Asset name is required",
        variant: "destructive",
      });
      return;
    }

    const assetId = `${assetType}-${assetName.toLowerCase().replace(/\s+/g, "-")}`;

    const { error } = await supabase.from("watchlist").insert({
      user_id: user.id,
      asset_type: assetType,
      asset_id: assetId,
      asset_name: assetName,
      asset_symbol: assetSymbol || null,
      alert_enabled: alertEnabled,
      alert_price_above: priceAbove ? parseFloat(priceAbove) : null,
      alert_price_below: priceBelow ? parseFloat(priceBelow) : null,
      alert_volume_threshold: volumeThreshold ? parseFloat(volumeThreshold) : null,
      notes: notes || null,
    });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already in watchlist",
          description: "This asset is already in your watchlist",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add to watchlist",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Success",
        description: "Added to watchlist",
      });
      setIsAddDialogOpen(false);
      resetForm();
      fetchWatchlist();
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    const { error } = await supabase
      .from("watchlist")
      .update({
        alert_enabled: alertEnabled,
        alert_price_above: priceAbove ? parseFloat(priceAbove) : null,
        alert_price_below: priceBelow ? parseFloat(priceBelow) : null,
        alert_volume_threshold: volumeThreshold ? parseFloat(volumeThreshold) : null,
        notes: notes || null,
      })
      .eq("id", editingItem.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Watchlist item updated",
      });
      setEditingItem(null);
      resetForm();
      fetchWatchlist();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("watchlist").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Removed from watchlist",
      });
      fetchWatchlist();
    }
  };

  const openEditDialog = (item: WatchlistItem) => {
    setEditingItem(item);
    setAssetType(item.asset_type);
    setAssetName(item.asset_name);
    setAssetSymbol(item.asset_symbol || "");
    setAlertEnabled(item.alert_enabled);
    setPriceAbove(item.alert_price_above?.toString() || "");
    setPriceBelow(item.alert_price_below?.toString() || "");
    setVolumeThreshold(item.alert_volume_threshold?.toString() || "");
    setNotes(item.notes || "");
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "ipo":
        return <TrendingUp className="h-5 w-5" />;
      case "stock":
      case "crypto":
      case "commodity":
        return <DollarSign className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Watchlist</h2>
          <p className="text-muted-foreground">Track and monitor your favorite assets</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            Start tracking IPOs, stocks, crypto, and commodities
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Asset
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map((item) => (
            <div key={item.id} className="bg-card rounded-lg border p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getAssetIcon(item.asset_type)}
                  <div>
                    <p className="font-semibold">{item.asset_name}</p>
                    {item.asset_symbol && (
                      <p className="text-xs text-muted-foreground">{item.asset_symbol}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditDialog(item)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Bell
                    className={`h-4 w-4 ${
                      item.alert_enabled ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-muted-foreground">
                    Alerts: {item.alert_enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>

                {item.alert_price_above && (
                  <p className="text-xs text-muted-foreground">
                    Alert above: ${item.alert_price_above}
                  </p>
                )}
                {item.alert_price_below && (
                  <p className="text-xs text-muted-foreground">
                    Alert below: ${item.alert_price_below}
                  </p>
                )}
                {item.notes && (
                  <p className="text-xs text-muted-foreground mt-2">{item.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || editingItem !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingItem(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Watchlist Item" : "Add to Watchlist"}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update alert settings and notes"
                : "Add a new asset to track and set up alerts"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!editingItem && (
              <>
                <div className="space-y-2">
                  <Label>Asset Type</Label>
                  <Select value={assetType} onValueChange={setAssetType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ipo">IPO</SelectItem>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="commodity">Commodity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Asset Name *</Label>
                  <Input
                    placeholder="e.g., TechCorp Inc."
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Symbol/Ticker (optional)</Label>
                  <Input
                    placeholder="e.g., TECH"
                    value={assetSymbol}
                    onChange={(e) => setAssetSymbol(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <Label>Enable Alerts</Label>
              <Switch checked={alertEnabled} onCheckedChange={setAlertEnabled} />
            </div>

            {alertEnabled && (
              <>
                <div className="space-y-2">
                  <Label>Alert if price goes above</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 100"
                    value={priceAbove}
                    onChange={(e) => setPriceAbove(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Alert if price goes below</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 50"
                    value={priceBelow}
                    onChange={(e) => setPriceBelow(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Volume threshold (optional)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 1000000"
                    value={volumeThreshold}
                    onChange={(e) => setVolumeThreshold(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={editingItem ? handleUpdate : handleAdd}
              className="w-full"
            >
              {editingItem ? "Update" : "Add to Watchlist"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
