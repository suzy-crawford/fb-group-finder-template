// FB Group Finder - the rules done in code (fbgLogic.js)
// Activity bar, dedupe, name filters, ad-wall maths, ranking, the lead struggles post and the
// spreadsheet. The AI never decides these, so every member gets the same, checkable result.

export const BAR_30 = 300; // 10 posts a day on average = 300 posts in 30 days
export const MAX_ACTIVE = 5; // Apify free plan: 5 runs at once
export const MAX_EXTRA_ROUNDS = 2;

// The same group can come back as www.facebook.com and web.facebook.com, so dedupe on the id after /groups/.
export function groupKey(url) {
  const m = String(url || "").match(/groups\/([^/?#]+)/i);
  return (m ? m[1] : String(url || "")).toLowerCase();
}

const DROP_BY_NAME = [
  /\bmarketing\b/i, /\bmarketers?\b/i, /\bseo\b/i, /\bsocial media managers?\b/i, /\bdigital agency\b/i,
  /\bjobs?\b/i, /\bhiring\b/i, /\bvacanc/i, /\brecruit/i,
  /buy\s*(and|&|\/)?\s*sell/i, /\bfor sale\b/i, /\bmarketplace\b/i, /\bswap\b/i,
  /free advertis/i, /\boffers\b/i, /\bdeals\b/i, /\bdirectory\b/i,
  /lost\s*(and|&)\s*found/i, /\bfoodies?\b/i, /\bfan club\b/i, /\bfans\b/i, /\bcouncil\b/i,
];

const COMMUNITY_WORDS = /\b(mums?|moms?|mothers|parents|community|chat|residents|neighbou?rs|locals|village|town)\b/i;

export function isCommunityName(name) {
  return COMMUNITY_WORDS.test(String(name || ""));
}

export function dropByName(name) {
  const n = String(name || "");
  return DROP_BY_NAME.some((re) => re.test(n));
}

// First cut, applied as each search finishes: dedupe, activity bar, obvious misses by name.
// Below-bar mums/parents groups for the member's own town are kept aside: the main one may be included later.
export function firstCut(existing, incoming, kind, town) {
  const byKey = new Map(existing.map((g) => [g.key, g]));
  let added = 0;
  for (const g of incoming) {
    const key = groupKey(g.url);
    if (!key || byKey.has(key)) continue;
    if (dropByName(g.name)) continue;
    const townMums = kind === "local" && town && new RegExp(`\\b${escapeRe(town)}\\b`, "i").test(g.name) && /\b(mums?|moms?|parents)\b/i.test(g.name);
    if (g.posts_30 < BAR_30 && !townMums) continue;
    byKey.set(key, { ...g, key, kind, url: cleanUrl(g.url), below_bar: g.posts_30 < BAR_30 });
    added++;
  }
  return { list: [...byKey.values()], added };
}

function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function cleanUrl(url) {
  const key = groupKey(url);
  return key ? `https://www.facebook.com/groups/${key}/` : url;
}

// Posts per day per 1,000 members. Over 5 suggests mostly adverts.
export function adRatio(g) {
  const perDay = (g.posts_30 || 0) / 30;
  const k = (g.members || 0) / 1000;
  return k > 0 ? perDay / k : 0;
}

// Combine the AI's judgement with the maths. Returns the group with final fields, or null if dropped.
export function applyScreen(g) {
  const sc = g.screen;
  if (!sc || !sc.keep) return null;
  const community = sc.category === "Local - community";
  const ratioHigh = adRatio(g) > 5;
  let why = sc.why_it_fits || "";
  if (!community) {
    if (sc.advertising_is_main_purpose && ratioHigh) return null; // advertising wall: both tests true
    if (sc.advertising_is_main_purpose || ratioHigh) why = `${why}${why ? ". " : ""}Promo-heavy, so check the feed before posting`;
  }
  if (sc.may_qualify) why = `${why}${why ? ". " : ""}Members only (check you qualify)`;
  let rules = sc.rules_look_wrong ? "Check on joining" : sc.posting_rules || "Check on joining";
  if (sc.bans_lead_post) rules = `Comments only, no Post 1. ${rules}`;
  if (g.below_bar) why = `Below 10/day, kept as your town's main parents group. ${why}`;
  return { ...g, type: sc.category, why_it_fits: why.trim(), posting_rules: rules };
}

const byActivity = (a, b) => (a.screen?.bans_lead_post ? 1 : 0) - (b.screen?.bans_lead_post ? 1 : 0) || b.posts_30 - a.posts_30;

// Top 10 niche, then 10 local with roughly half business and half community.
export function pickFinal(candidates) {
  const ok = candidates.map(applyScreen).filter(Boolean);
  const niche = ok.filter((g) => g.type === "Niche" && !g.below_bar).sort(byActivity).slice(0, 10);
  const biz = ok.filter((g) => g.type === "Local - business" && !g.below_bar).sort(byActivity);
  const com = ok.filter((g) => g.type === "Local - community" && !g.below_bar).sort(byActivity);
  let local = [...biz.slice(0, 5), ...com.slice(0, 5)];
  const rest = [...biz.slice(5), ...com.slice(5)].sort(byActivity);
  while (local.length < 10 && rest.length) local.push(rest.shift());
  // The member's own town mums/parents group can join even below the bar.
  const townMums = ok.filter((g) => g.below_bar && g.type === "Local - community").sort((a, b) => b.posts_30 - a.posts_30)[0];
  if (townMums && !local.some((g) => g.key === townMums.key)) {
    if (local.length < 10) local.push(townMums);
    else local[9] = townMums;
  }
  local = local.sort(byActivity);
  const rank = (arr) => arr.map((g, i) => ({ ...g, rank: i + 1, status: g.status || "Not joined" }));
  return {
    groups: [...rank(niche), ...rank(local)],
    short: { niche: Math.max(0, 10 - niche.length), local: Math.max(0, 10 - local.length) },
  };
}

// ---------- posts ----------

export function leadStrugglesPost(topic) {
  return `I have some free time today, so I thought I'd pop in and answer any questions anyone has about ${topic}. I spend a lot of time replying to people's posts on here, so I thought if I create one post I can help everyone in one go \u{1F602}

So if you're struggling, what is it you're struggling with the most?`;
}

export function leadStrugglesCommunity(topic) {
  return `Any business owners in here? \u{1F64B}\u200D\u2640\uFE0F I have some free time today, so I thought I'd pop in and answer any questions about ${topic}. I spend a lot of time replying to people's posts, so I thought if I create one post I can help everyone in one go \u{1F602}

So if you run a business and you're struggling, what is it you're struggling with the most?`;
}

export const POST1_TIPS = [
  "Post it only when you have 1 to 2 hours free to reply to every comment that day. The replies are where the leads come from.",
  "Reply publicly with a genuinely useful answer to each comment, then ask one follow-up question to keep the conversation going.",
  "Only move to DMs when the person asks, or says something like \u201CI'd love more help with this\u201D.",
  "One group per day. Change the wording slightly each time, because admins and members notice copy-pasted posts.",
  "Check each group's posting rules first. If a group only allows business posts on certain days, post it then.",
  "Never mention your service or prices in the post. The post is about helping. Your profile tells people what you do.",
];

export const RHYTHM = [
  ["Week 1", "Join all 20 groups. Fix your Facebook profile: a headline saying who you help and the result you get, a free resource in your Featured section, and a cover photo with the same message. Comment helpfully on 3 to 5 posts a day."],
  ["Week 2 onwards", "Post 1 in 2 to 3 groups a week, rotating so each group sees it about once a month. Post 2 or 3 in the other groups. Keep commenting daily."],
  ["Monthly", "Mark which groups produced conversations, leave the ones that didn't, and run a new search to find replacements."],
];

export const DONT_AUTOMATE = [
  ["Auto-posting into other people's groups", "Meta shut down the Groups API in 2024. Bot and extension posting breaks Facebook's terms and gets accounts restricted and removed from groups."],
  ["Auto-commenting or auto-DMing members", "Same risk, and members report it as spam."],
  ["Scraping member lists", "It needs your Facebook login, and raises data-protection (GDPR) problems."],
];

// ---------- the spreadsheet ----------

const HEAD = ["Type", "Rank", "Group name", "Link", "Privacy", "Members", "Posts last 30 days", "Avg posts per day", "Meets 10/day?", "Posts last 24 hours", "Why it fits", "Posting rules", "Status", "Date checked"];

function cell(v) {
  const s = String(v ?? "");
  return /[",\n=]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCSV(groups, date) {
  const rows = [HEAD.map(cell).join(",")];
  groups.forEach((g, i) => {
    const r = i + 2;
    rows.push([
      g.type, g.rank, g.name, g.url, g.privacy, g.members, g.posts_30,
      `=ROUND(G${r}/30,0)`, `=IF(G${r}>=300,"Yes","Below 10/day")`,
      g.posts_day, g.why_it_fits, g.posting_rules, g.status || "Not joined", date,
    ].map(cell).join(","));
  });
  return rows.join("\n");
}

export function sheetTitle(s) {
  const d = new Date();
  const month = d.toLocaleString("en-US", { month: "long", year: "numeric" });
  return `Facebook Groups - ${s.business_name || "My business"} - ${s.service ? s.service.slice(0, 60) : "groups"} + ${s.town || ""} (${month})`.replace(/\s+/g, " ");
}

export function downloadCSV(s) {
  const csv = toCSV(s.groups || [], s.checked_date || today());
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${sheetTitle(s).replace(/[\\/:*?"<>|]/g, "")}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export const STATUSES = ["Not joined", "Requested", "Joined", "Left"];
