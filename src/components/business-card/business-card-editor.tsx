"use client";

import { Loader2, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { saveBusinessCardSettings } from "@/app/(protected)/user-profiles/[id]/card/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BusinessCard, BusinessCardConfig } from "@/lib/db/business-cards";
import { UserProfile } from "@/lib/db/user-profiles";
import { Work, Skill, BusinessCardView } from "./business-card-view";

type BusinessCardEditorProps = {
  profile: UserProfile;
  initialCard: BusinessCard | null;
  works?: Work[];
  skills?: Skill[];
};

export function BusinessCardEditor({
  profile,
  initialCard,
  works = [],
  skills = [],
}: BusinessCardEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [card, setCard] = useState<Partial<BusinessCard>>({
    is_published: initialCard?.is_published ?? false,
    display_config: initialCard?.display_config ?? {},
    content: initialCard?.content ?? {},
  });

  const config = card.display_config || {};
  const content = card.content || {};

  const handleConfigChange = (key: keyof BusinessCardConfig, value: any) => {
    setCard((prev) => ({
      ...prev,
      display_config: {
        ...prev.display_config,
        [key]: value,
      },
    }));
  };

  const handleContentChange = (
    section: keyof BusinessCard["content"],
    key: string,
    value: any
  ) => {
    setCard((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: {
          ...(prev.content?.[section] || {}),
          [key]: value,
        },
      },
    }));
  };

  const toggleWork = (workId: string) => {
    const selected = config.selected_works_ids || [];
    if (selected.includes(workId)) {
      handleConfigChange(
        "selected_works_ids",
        selected.filter((id) => id !== workId)
      );
    } else {
      handleConfigChange("selected_works_ids", [...selected, workId]);
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveBusinessCardSettings(profile.id, {
        is_published: card.is_published,
        display_config: card.display_config,
        content: card.content,
      });

      if (result.success) {
        toast.success("Business card settings saved");
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Editor Column */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Visibility Toggle */}
            <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg bg-slate-50">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="published" className="font-semibold">
                  Publish Business Card
                </Label>
                <span className="text-xs text-muted-foreground">
                  Make your business card visible to others.
                </span>
              </div>
              <Switch
                id="published"
                checked={card.is_published}
                onCheckedChange={(checked) =>
                  setCard((prev) => ({ ...prev, is_published: checked }))
                }
              />
            </div>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-auto flex-wrap">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="trust">Trust</TabsTrigger>
                <TabsTrigger value="values">Values</TabsTrigger>
                <TabsTrigger value="pr">PR</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Custom Title (Optional)</Label>
                  <Input
                    placeholder={profile.role_type || "e.g. Senior Developer"}
                    value={config.custom_title || ""}
                    onChange={(e) =>
                      handleConfigChange("custom_title", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Custom Bio (Optional)</Label>
                  <Textarea
                    placeholder="Short professional bio..."
                    className="resize-none"
                    value={config.custom_bio || ""}
                    onChange={(e) =>
                      handleConfigChange("custom_bio", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-4 border p-4 rounded bg-slate-50">
                  <h4 className="font-medium text-sm">Display Options</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-name"
                      checked={config.show_display_name !== false}
                      onCheckedChange={(checked) =>
                        handleConfigChange("show_display_name", checked)
                      }
                    />
                    <Label htmlFor="show-name" className="cursor-pointer">
                      Show Display Name
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-role"
                      checked={config.show_role_type !== false}
                      onCheckedChange={(checked) =>
                        handleConfigChange("show_role_type", checked)
                      }
                    />
                    <Label htmlFor="show-role" className="cursor-pointer">
                      Show Role/Title
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-links"
                      checked={config.show_external_links !== false}
                      onCheckedChange={(checked) =>
                        handleConfigChange("show_external_links", checked)
                      }
                    />
                    <Label htmlFor="show-links" className="cursor-pointer">
                      Show External Links
                    </Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trust" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Average Response Time</Label>
                    <Input
                      placeholder="e.g. 4 hours (Business Days)"
                      value={content.trust?.response_time || ""}
                      onChange={(e) =>
                        handleContentChange(
                          "trust",
                          "response_time",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Project Completion Rate (Self-Reported)</Label>
                    <Input
                      placeholder="e.g. 100%"
                      value={content.trust?.completion_rate || ""}
                      onChange={(e) =>
                        handleContentChange(
                          "trust",
                          "completion_rate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Revision Policy</Label> // Using simple input
                    selector for speed
                    <select
                      className="w-full p-2 border rounded-md bg-white text-sm"
                      value={content.trust?.revision_policy || ""}
                      onChange={(e) =>
                        handleContentChange(
                          "trust",
                          "revision_policy",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Policy...</option>
                      <option value="Unlimited (Included)">
                        Unlimited (Included)
                      </option>
                      <option value="Up to 2 times">Up to 2 times</option>
                      <option value="Paid revisions only">
                        Paid revisions only
                      </option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="values" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Feedback Stance</Label>
                    <select
                      className="w-full p-2 border rounded-md bg-white text-sm"
                      value={content.value?.feedback_stance || ""}
                      onChange={(e) =>
                        handleContentChange(
                          "value",
                          "feedback_stance",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Stance...</option>
                      <option value="commercial">
                        🤝 Commercial First (Success Driven)
                      </option>
                      <option value="artistic">
                        🛡️ Artistic First (Preserve Vision)
                      </option>
                      <option value="balanced">⚖️ Balanced</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>AI Usage Stance</Label>
                    <select
                      className="w-full p-2 border rounded-md bg-white text-sm"
                      value={content.value?.ai_stance || ""}
                      onChange={(e) =>
                        handleContentChange(
                          "value",
                          "ai_stance",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Stance...</option>
                      <option value="no_ai">🚫 No Generative AI Used</option>
                      <option value="ai_assisted">
                        🤖 AI Assisted (Drafting/Refining)
                      </option>
                      <option value="ai_full">✅ Full AI Usage</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Self Management</Label>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: "weekend_off", label: "Weekend Off / Offline" },
                        { id: "no_politics", label: "No Political Posts" },
                        {
                          id: "low_sns",
                          label: "Low SNS activity during crunch",
                        },
                      ].map((item) => {
                        const current = content.value?.self_management || [];
                        const isChecked = current.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={item.id}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const newVal = checked
                                  ? [...current, item.id]
                                  : current.filter(
                                      (i: string) => i !== item.id
                                    );
                                handleContentChange(
                                  "value",
                                  "self_management",
                                  newVal
                                );
                              }}
                            />
                            <Label htmlFor={item.id} className="font-normal">
                              {item.label}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pr" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Promotion Support</Label>
                    <Input
                      placeholder="e.g. Will share release post, provide sketches"
                      value={content.pr?.promotion_level || ""}
                      onChange={(e) =>
                        handleContentChange(
                          "pr",
                          "promotion_level",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Communication</Label>
                    <Input
                      placeholder="e.g. Text-only, Notion, Discord call OK"
                      value={content.pr?.comm_style || ""}
                      onChange={(e) =>
                        handleContentChange("pr", "comm_style", e.target.value)
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="mb-2 block">Fixed Skills</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-skills"
                      checked={config.show_skills !== false}
                      onCheckedChange={(checked) =>
                        handleConfigChange("show_skills", checked)
                      }
                    />
                    <Label htmlFor="show-skills">Show Skills Section</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="mb-2 block">Select Works to Display</Label>
                  {works.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No works found in your profile.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border rounded-md p-2">
                      {works.map((work) => (
                        <div
                          key={work.id}
                          className="flex items-start space-x-2 p-2 hover:bg-slate-50 rounded"
                        >
                          <Checkbox
                            id={`work-${work.id}`}
                            checked={config.selected_works_ids?.includes(
                              work.id
                            )}
                            onCheckedChange={() => toggleWork(work.id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`work-${work.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {work.title}
                            </label>
                            {work.category && (
                              <p className="text-xs text-muted-foreground">
                                {work.category}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="pt-4 flex justify-end">
              <Button onClick={handleSave} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Column */}
      <div className="space-y-6">
        <div className="flex flex-col items-center sticky top-6">
          <Label className="mb-4 text-lg font-semibold text-slate-500">
            Live Preview
          </Label>
          <div className="w-full max-w-md transform transition-all duration-300">
            <BusinessCardView
              profile={profile}
              config={config}
              content={content}
              works={works}
              skills={skills}
            />
          </div>
          <p className="mt-4 text-sm text-slate-400 text-center">
            This is how your business card will appear to others.
          </p>
        </div>
      </div>
    </div>
  );
}
