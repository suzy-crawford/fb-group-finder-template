// FB Group Finder - AI prompts (fbgPrompts.js)
// Everything the AI is asked lives here. The search itself, the activity bar, the ad-wall maths,
// ranking and the spreadsheet are done in code (fbgLogic.js), never by the AI.

const who = (s) => [
  `Service: ${s.service}`,
  `Ideal client: ${s.ideal_client}`,
  `Based in: ${[s.town, s.region, s.country].filter(Boolean).join(", ")}`,
  `Where their clients are: ${s.client_reach === "local" ? "local only" : s.client_reach === "worldwide" ? "worldwide" : `anywhere in ${s.country}`}`,
  s.avoid ? `Groups to avoid: ${s.avoid}` : "",
].filter(Boolean).join("\n");

// ---------- Step 2: search keywords ----------

export const KEYWORD_SCHEMA = {
  type: "object",
  properties: {
    niche: { type: "array", items: { type: "object", properties: { keyword: { type: "string" }, why: { type: "string" } }, required: ["keyword", "why"] } },
    local: { type: "array", items: { type: "object", properties: { keyword: { type: "string" }, why: { type: "string" } }, required: ["keyword", "why"] } },
    notes: { type: "string" },
  },
  required: ["niche", "local", "notes"],
};

export function keywordPrompt(s) {
  return `You choose Facebook group search keywords for a freelance marketer who wants leads from Facebook groups. Their clients are businesses, so every keyword must find groups where business owners actually talk, not groups of marketers and not advertising walls.

${who(s)}

The search keeps only groups whose name or description contains EVERY word of the keyword, so long phrases return nothing.

RULES
- Every keyword is 2 to 3 words. Never longer.
- NICHE keywords (give 6): words the ideal client calls THEMSELVES, not words for what the marketer sells. Examples: an ads manager for clinics -> "med spa owners", "aesthetics business", "clinic owners UK"; a social media manager for restaurants -> "restaurant owners UK", "cafe owners UK", "coffee shop owners"; an ads manager for coaches -> "coaching business", "life coaches", "online coaches".
- If their clients are in one country, add the country to niche keywords (for example "restaurant owners UK"); without it, results come back from other countries.
- Use "owners" or the job title owners use for themselves, never broad industry words like "hospitality", "catering" or "pub landlords" (those return jobs, staff, equipment and property groups). For beauty and aesthetics the role words work best: "nail techs UK", "lash techs UK", "aesthetic practitioners UK", "hairdressers UK".
- Avoid ambiguous single words ("injectors" returned diesel fuel-injector groups).
- LOCAL keywords (give 8): short phrases built from the town, the nearest bigger town or city, the county or state, and one or two neighbouring towns within about 30 minutes. Mix business and community searches:
  business: "<town> business", "<town> small business", "<town> networking", "<county or state> business"
  community: "<town> ${s.country === "United States" || s.country === "Canada" ? "moms" : "mums"}", "<town> parents", "<town> community", "<town> chat", "<neighbouring town> community"
- UK: use "mums", never "moms", and add the county for business searches. US: use "moms", search the city, then the state, because many US towns share a name.
- If the town is also an everyday word (Reading, Bath, Deal, March, Wells, Street, Ware, Sale), add the county to every local keyword using it ("Reading Berkshire") or use a neighbouring town instead.
- If the town or county shares its name with another place (Leeds, Perth, Cambridge, Bracknell, Berkshire), say so in notes so wrong-place groups get removed later.
${s.client_reach === "local" ? "- Their clients are local only, so niche keywords should include the county or state, not the country." : ""}

For each keyword give one short line on why. In notes, give one or two plain sentences of anything to watch for (same-named places, a thin niche). If there's nothing, return an empty string.`;
}

// ---------- Step 4: check each shortlisted group ----------

export const SCREEN_SCHEMA = {
  type: "object",
  properties: {
    groups: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          keep: { type: "boolean" },
          drop_reason: { type: "string" },
          category: { type: "string", enum: ["Niche", "Local - business", "Local - community"] },
          advertising_is_main_purpose: { type: "boolean" },
          bans_lead_post: { type: "boolean" },
          rules_look_wrong: { type: "boolean" },
          may_qualify: { type: "boolean" },
          why_it_fits: { type: "string" },
          posting_rules: { type: "string" },
        },
        required: ["key", "keep", "drop_reason", "category", "advertising_is_main_purpose", "bans_lead_post", "rules_look_wrong", "may_qualify", "why_it_fits", "posting_rules"],
      },
    },
  },
  required: ["groups"],
};

export function screenPrompt(s, groups) {
  const list = groups.map((g) => [
    `KEY: ${g.key}`,
    `Name: ${g.name}`,
    `Found by: "${g.search_query}" (${g.kind === "local" ? "local search" : "niche search"})`,
    `Members: ${g.members} | Posts in 30 days: ${g.posts_30} | Privacy: ${g.privacy}`,
    `Description: ${g.description || "(none)"}`,
    `Rules: ${g.rules || "(none)"}`,
  ].join("\n")).join("\n\n");

  return `You check Facebook groups for a freelance marketer who wants to find clients in them. Judge every group below and return one entry per KEY.

${who(s)}

DROP a group (keep: false, short drop_reason) when ANY of these is true:
- It's for marketers, or it's run by marketers ("learn marketing strategies with us"). The admin is a competitor.
- It's a jobs, buy/sell, "free advertising", offers, directory or for-sale group, or a foodie, fan, sports, council or lost-and-found group.
- It's in the wrong country, or it's a same-named town, county or state somewhere else (Leeds, Alabama; Perth, Australia; Berkshire County, Massachusetts; Bracknell, Tasmania). Towns that are also everyday words (Reading, Bath) often match book clubs or other places: check the place really matches.
- You can't join it: membership is limited to qualified practitioners, people with a directory listing, "hairdressers only" and so on. If the marketer might qualify, keep it and set may_qualify true.
- Its description or rules ban marketers or service providers: "no marketing 'help'", "social media experts will be banned", "service providers may only reply under owners' questions". Facebook's standard "No promotions or spam" rule is NOT a ban on marketers; almost every group has it and it just means no adverts.
- It was found by a NICHE search but it's for consumers, not business owners (a foodie group found by "restaurant owners").
- For LOCAL community and mums groups: only drop if it bans all business owners from mentioning what they do AND helpful content isn't possible either. Never drop a mums or community group for promo wording. Only drop a community group if it's specifically for buying and selling, jobs, or a topic unrelated to everyday local life.
- Local groups must be for the marketer's town or city, their county, state or region, or a neighbouring town within about 30 minutes. Further away doesn't count.

KEEP everything else, including groups run by a supplier ("Run by an insurance company") and groups with a promo day; say so in why_it_fits or posting_rules.

For every group also set:
- category: "Niche" for owners in the target industry; "Local - business" for local business and networking groups; "Local - community" for local mums, parents, town chat and community groups.
- advertising_is_main_purpose: true only if the description is mostly about advertising ("free advertising", "list your business", "advertise any time") and says nothing about advice, support, questions, networking or recommendations. Many good business groups say "promote your business" somewhere; that alone is not enough. (The activity maths is done separately, so don't drop a group for this.)
- bans_lead_post: true if the rules ban posts offering free advice that could lead to business ("no free advice that could lead to business sales").
- rules_look_wrong: true if the rules clearly belong to a different kind of group (a restaurant group with toy-car collector rules). Then posting_rules is "Check on joining".
- why_it_fits: one short line on who's in it and why it fits, for example "UK restaurant and caf\u00E9 owners asking each other for advice. Run by a supplier".
- posting_rules: what the rules say about business posts, for example "Business posts on Saturdays only" or "Promo thread every Monday". If the rules say nothing useful, "Check on joining".

GROUPS
${list}`;
}

// ---------- Step 4E: more keywords when a category falls short ----------

export const MORE_SCHEMA = {
  type: "object",
  properties: { keywords: { type: "array", items: { type: "object", properties: { keyword: { type: "string" }, kind: { type: "string", enum: ["niche", "local"] }, why: { type: "string" } }, required: ["keyword", "kind", "why"] } } },
  required: ["keywords"],
};

export function moreKeywordsPrompt(s, used, short) {
  return `A Facebook group search for a freelance marketer came up short. Suggest up to 5 NEW search keywords, 2 to 3 words each, to find more groups.

${who(s)}

Still needed: ${short.niche ? `${short.niche} more niche groups` : ""}${short.niche && short.local ? " and " : ""}${short.local ? `${short.local} more local groups` : ""}.
Already searched (don't repeat these): ${used.join("; ")}.

For niche: other words the ideal client calls themselves, with the country if their clients are national. For local: neighbouring towns within about 30 minutes, the region, or "<town> community/chat/${s.country === "United States" || s.country === "Canada" ? "moms" : "mums"}" style searches for nearby towns. Keep every keyword to 2 or 3 words.`;
}

// ---------- Step 6: posts written for this business ----------

export const POSTS_SCHEMA = {
  type: "object",
  properties: {
    topic: { type: "string" },
    quick_win: { type: "string" },
    story: { type: "string" },
    intro: { type: "string" },
  },
  required: ["topic", "quick_win", "story", "intro"],
};

export function postsPrompt(s, business) {
  return `Write Facebook group posts for a freelance marketer to paste into groups where their ideal clients hang out. Casual, human, like a real person talking, never like a business. ${business?.spelling === "UK" ? "UK spelling." : "US spelling."} No hashtags.

${who(s)}
${business?.name ? `Business: ${business.name}` : ""}
${business?.whose === "client" && business?.sent_as ? `Posts are sent as: ${business.sent_as}` : ""}
Real client result (may be empty): ${s.result_story || "(none given)"}

Return:
- topic: the topic words for their lead struggles post, finishing the sentence "answer any questions anyone has about ...". Match their service: ads manager or agency -> "growing their business and getting more leads"; social media manager -> "social media, and what to post to actually get enquiries"; content creator -> "content, and what to film or post to get more customers"; email marketer -> "email marketing, and getting past customers to come back"; Google ads or SEO -> "showing up on Google when people search for what you do". Adapt to their exact service and ideal client.
- quick_win: one specific, useful tip their ideal client can use today, in 2 to 3 sentences, ending with a question like "Has anyone else found this?". Never mention the marketer's service or prices.
- story: a short story about a client's problem and what changed, ending with a question like "What's the biggest thing holding you back with <topic> at the moment?". Use ONLY the real client result above. If there is none, write the post with clearly marked placeholders in square brackets, for example [client type], [what we changed], [result, e.g. 20 to 45 covers]. Never invent a result or a number.
- intro: an introduction post for local groups, for the group's business or promo day: "Hi, I'm [name], a <service> based in <town>. I help <ideal client> <result>. If anyone ever has questions about <topic>, I'm always happy to help." Keep [name] as a placeholder, and use a placeholder for the result if no real one was given.`;
}
