import type { CompanyInfo, PersonRecord, SocialLink, LogoAsset, CauseInfo } from "../types";
import { popularCauses } from "./causes";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

export async function loadDefaultLogo(): Promise<LogoAsset | null> {
  try {
    const response = await fetch('/usage-tap-logo.svg');
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          resolve({
            dataUrl: reader.result as string,
            width: img.width,
            height: img.height,
            name: 'usage-tap-logo.svg'
          });
        };
        img.onerror = () => resolve(null);
        img.src = reader.result as string;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export const defaultCompany: CompanyInfo = {
  companyName: "Usage Tap",
  tagline:
    "Predictable usage-based billing and insights for every AI feature you ship",
  website: "usagetap.com",
};

export const defaultPeople: PersonRecord[] = [
  {
    id: createId(),
    fullName: "Troy Magennis",
    role: "Chief Technology Officer",
    email: "troy@usagetap.com",
    pronouns: "he/him",
    location: "Seattle, USA",
    timezone: "UTC-8",
    socialLinks: createSocialLinks([
      ["LinkedIn", "https://www.linkedin.com/in/troymagennis"],
      ["X", "https://x.com/t_magennis"],
    ]),
    // Pre-selected causes requested
    causes: ((): CauseInfo[] => {
      const wanted = new Set(["red-cross", "unhcr"]);
      return popularCauses.filter(c => wanted.has(c.id));
    })()
  },
  {
    id: createId(),
    fullName: "Chris Hefley",
    role: "Chief Executive Officer",
    email: "chris@usagetap.com",
    pronouns: "",
    location: "San Diego, USA",
    timezone: "UTC-8",
    socialLinks: createSocialLinks([
      ["LinkedIn", "https://www.linkedin.com/in/chrishefley"],
    ]),
  },
];

function createSocialLinks(entries: Array<[string, string]>): SocialLink[] {
  return entries.map(([label, url]) => ({
    id: createId(),
    label,
    url,
  }));
}
