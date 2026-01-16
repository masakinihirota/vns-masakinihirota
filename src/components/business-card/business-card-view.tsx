import { LinkIcon, MailIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BusinessCardConfig,
  BusinessCardContent,
} from "@/lib/db/business-cards";
import { UserProfile } from "@/lib/db/user-profiles";

// Mock types if not available globally
export type Work = {
  id: string;
  title: string;
  category?: string;
  url?: string;
  thumbnail_url?: string;
};

export type Skill = {
  id: string;
  name: string;
  level?: string;
};

type BusinessCardViewProps = {
  profile: UserProfile;
  config: BusinessCardConfig;
  content?: BusinessCardContent;
  works?: Work[];
  skills?: Skill[];
  className?: string;
};

export function BusinessCardView({
  profile,
  config,
  content = {},
  works = [],
  skills = [],
  className,
}: BusinessCardViewProps) {
  // Filter works based on config
  const displayedWorks = works.filter((work) =>
    config.selected_works_ids?.includes(work.id)
  );

  return (
    <Card
      className={`w-full max-w-md bg-white text-slate-900 shadow-xl overflow-hidden border border-slate-200 ${className}`}
    >
      <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 w-full" />
      <CardHeader className="flex flex-row items-center gap-4 pb-2 space-y-0">
        <Avatar className="h-20 w-20 border-2 border-white shadow-md">
          <AvatarImage
            src={profile.avatar_url ?? ""}
            alt={profile.display_name}
          />
          <AvatarFallback className="bg-slate-100 text-slate-500 text-xl font-bold">
            {profile.display_name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          {config.show_display_name !== false && (
            <CardTitle className="text-2xl font-bold tracking-tight">
              {profile.display_name}
            </CardTitle>
          )}
          {(config.custom_title || config.show_role_type !== false) && (
            <CardDescription className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              {config.custom_title || profile.role_type || "Member"}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Bio Section */}
        {(config.custom_bio ||
          (config.show_purposes !== false && profile.purposes)) && (
          <div className="text-sm text-slate-600 leading-relaxed italic">
            "
            {config.custom_bio ||
              profile.purposes?.join(", ") ||
              profile.purpose}
            "
          </div>
        )}

        {/* Trust Visualizer Area */}
        {(content.trust?.response_time ||
          content.trust?.completion_rate ||
          content.trust?.revision_policy) && (
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
            {content.trust.response_time && (
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] uppercase text-slate-400 font-bold">
                  Response
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {content.trust.response_time}
                </span>
              </div>
            )}
            {content.trust.completion_rate && (
              <div className="flex flex-col items-center text-center border-l border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 font-bold">
                  Completion
                </span>
                <span className="text-xs font-semibold text-green-600">
                  {content.trust.completion_rate}
                </span>
              </div>
            )}
            {content.trust.revision_policy && (
              <div className="flex flex-col items-center text-center border-l border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 font-bold">
                  Revision
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {content.trust.revision_policy}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Value Matching Area */}
        {(content.value?.feedback_stance ||
          content.value?.ai_stance ||
          content.value?.self_management?.length) && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {content.value.feedback_stance === "commercial" && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
                >
                  🤝 Commercial First
                </Badge>
              )}
              {content.value.feedback_stance === "artistic" && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200"
                >
                  🛡️ Artistic First
                </Badge>
              )}
              {content.value.feedback_stance === "balanced" && (
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                >
                  ⚖️ Balanced Stance
                </Badge>
              )}

              {content.value.ai_stance === "no_ai" && (
                <Badge
                  variant="outline"
                  className="border-green-200 text-green-700 bg-green-50"
                >
                  🚫 No Generative AI
                </Badge>
              )}
              {content.value.ai_stance === "ai_assisted" && (
                <Badge
                  variant="outline"
                  className="border-amber-200 text-amber-700 bg-amber-50"
                >
                  🤖 AI Assisted
                </Badge>
              )}
              {content.value.ai_stance === "ai_full" && (
                <Badge
                  variant="outline"
                  className="border-indigo-200 text-indigo-700 bg-indigo-50"
                >
                  ✅ AI Powered
                </Badge>
              )}
            </div>
            {content.value.self_management &&
              content.value.self_management.length > 0 && (
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                  {content.value.self_management.includes("weekend_off") && (
                    <span className="flex items-center gap-1">
                      ✅ Weekend Off
                    </span>
                  )}
                  {content.value.self_management.includes("no_politics") && (
                    <span className="flex items-center gap-1">
                      ✅ No Politics
                    </span>
                  )}
                  {content.value.self_management.includes("low_sns") && (
                    <span className="flex items-center gap-1">
                      ✅ Low SNS @ Crunch
                    </span>
                  )}
                </div>
              )}
          </div>
        )}

        {/* PR / Communication Area */}
        {(content.pr?.comm_style || content.pr?.promotion_level) && (
          <div className="text-xs bg-slate-50 p-3 rounded-md space-y-2">
            {content.pr.promotion_level && (
              <div className="flex gap-2">
                <span className="font-semibold text-slate-600 min-w-[70px]">
                  Promo:
                </span>
                <span className="text-slate-800">
                  {content.pr.promotion_level}
                </span>
              </div>
            )}
            {content.pr.comm_style && (
              <div className="flex gap-2">
                <span className="font-semibold text-slate-600 min-w-[70px]">
                  Contact:
                </span>
                <span className="text-slate-800">{content.pr.comm_style}</span>
              </div>
            )}
          </div>
        )}

        {/* External Links */}
        {config.show_external_links !== false && profile.external_links && (
          <div className="flex flex-wrap gap-3 text-sm pt-2">
            {Object.entries(profile.external_links).map(([key, url]) => (
              <a
                key={key}
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
              >
                <LinkIcon className="w-3 h-3" />
                <span className="capitalize text-xs">{key}</span>
              </a>
            ))}
          </div>
        )}

        <Separator />

        {/* Skills */}
        {config.show_skills !== false && skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="bg-white text-slate-600 px-2 py-0.5 rounded text-xs border border-slate-200 shadow-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Works / Portfolio */}
        {displayedWorks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Selected Works
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {displayedWorks.map((work) => (
                <a
                  key={work.id}
                  href={work.url || "#"}
                  target="_blank"
                  className="group block border border-slate-100 rounded-md p-2 hover:bg-slate-50 hover:border-blue-100 transition-all bg-white shadow-sm"
                >
                  <div className="font-medium text-sm truncate group-hover:text-blue-600">
                    {work.title}
                  </div>
                  {work.category && (
                    <div className="text-[10px] text-slate-400">
                      {work.category}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
