# Copy instructions for FB Group Finder 1.0.0

This repository is a finished, tested app. Your job is to copy it into this Base44 app exactly, one part at a time.

## Rules (follow every one)

- Copy, don't build. Do not plan, design, redesign, improve, simplify, rename, merge or split anything.
- For every file in the part you're asked to do: open its link, and create the file at exactly that path with exactly that content, character for character.
- Never write your own version of a file, never summarize a file, and never leave a file out. If a file is long, keep going until it's complete.
- Don't create files that aren't listed, and don't change files from other parts.
- Only do the part the user asks for, then stop and say which files you created.
- A new Base44 app already has some of these files (for example src/lib/app-params.js and src/api/base44Client.js). Replace them with the repo's version anyway, even if yours looks almost the same. Only the repo's exact version passes the Copy check.
- Don't fix build errors between parts. If the app shows an error before the last part, leave it: it means a file from a later part isn't there yet. Never edit, rename or add an export to any file to make an error go away.
- The data entities are in base44/entities and the backend functions are in base44/functions. Create them exactly as written.
- Images load from the internet by themselves. Don't create or download image files.
- Spacing, line breaks and a missing final newline don't matter (the check ignores them), and Base44 reformatting entity files is fine. Don't spend time on those.
- Don't compare or re-check files after writing them, and don't test the app between parts. The app's Copy check does all of that at the end, so extra checking only uses up credits.

There are 4 parts. After the last part, the user opens Settings, then Check my setup. Its Copy check compares every file with this list and names any file that isn't an exact copy.

## Part 1

First make sure these setup files match (install every package listed in package.json):

- package.json: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/package.json
- vite.config.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/vite.config.js
- jsconfig.json: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/jsconfig.json
- postcss.config.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/postcss.config.js
- components.json: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/components.json

Then create these files:

- tailwind.config.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/tailwind.config.js
- base44/entities/AppSettings.jsonc: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/base44/entities/AppSettings.jsonc
- base44/entities/Business.jsonc: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/base44/entities/Business.jsonc
- base44/entities/GroupSearch.jsonc: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/base44/entities/GroupSearch.jsonc
- base44/entities/User.jsonc: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/base44/entities/User.jsonc
- src/components/ui/use-toast.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/ui/use-toast.jsx
- src/components/brand/icons.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/brand/icons.jsx
- src/lib/utils.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/utils.js
- src/components/ui/toast.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/ui/toast.jsx
- src/components/ui/toaster.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/ui/toaster.jsx
- src/lib/query-client.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/query-client.js
- src/lib/app-params.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/app-params.js
- src/api/base44Client.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/api/base44Client.js
- src/lib/PageNotFound.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/PageNotFound.jsx
- src/lib/AuthContext.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/AuthContext.jsx
- src/components/UserNotRegisteredError.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/UserNotRegisteredError.jsx
- src/components/ScrollToTop.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/ScrollToTop.jsx
- src/components/shared/Skeleton.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/shared/Skeleton.jsx
- src/components/ProtectedRoute.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/ProtectedRoute.jsx
- src/lib/assets.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/assets.js
- src/lib/constants.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/constants.js
- src/components/AppLayout.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/AppLayout.jsx
- src/App.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/App.jsx
- src/lib/version.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/version.js
- src/lib/brandStyles.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/brandStyles.js
- src/index.css: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/index.css
- src/lib/theme.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/theme.js
- src/main.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/main.jsx
- src/components/shared/ToolHero.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/shared/ToolHero.jsx
- src/components/shared/CopyButton.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/shared/CopyButton.jsx
- src/components/shared/UpdateBanner.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/shared/UpdateBanner.jsx
- src/pages/Home.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/pages/Home.jsx

## Part 2

- base44/functions/apify/entry.ts: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/base44/functions/apify/entry.ts
- base44/functions/generateWithAI/entry.ts: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/base44/functions/generateWithAI/entry.ts
- src/lib/authReturnTo.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/authReturnTo.js
- src/lib/callAI.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/callAI.js
- src/lib/copyCheck.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/copyCheck.js
- src/lib/fbgLogic.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/fbgLogic.js
- src/lib/fbgPrompts.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/fbgPrompts.js
- src/lib/fbgRunner.js: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/lib/fbgRunner.js
- src/components/AuthLayout.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/AuthLayout.jsx
- src/components/GoogleIcon.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/GoogleIcon.jsx
- src/components/shared/PageHeader.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/shared/PageHeader.jsx
- src/components/shared/SelectableCard.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/shared/SelectableCard.jsx
- src/components/shared/Tabs.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/shared/Tabs.jsx
- src/components/ui/button.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/ui/button.jsx
- src/components/ui/input-otp.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/ui/input-otp.jsx
- src/components/ui/input.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/ui/input.jsx
- src/components/ui/label.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/components/ui/label.jsx
- src/pages/ForgotPassword.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/pages/ForgotPassword.jsx
- src/pages/Login.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/pages/Login.jsx
- src/pages/OAuthConsent.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/pages/OAuthConsent.jsx
- src/pages/Register.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/pages/Register.jsx
- src/pages/ResetPassword.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/pages/ResetPassword.jsx
- src/pages/Search.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/pages/Search.jsx

## Part 3

- src/pages/Settings.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/pages/Settings.jsx
- src/pages/SetupCheck.jsx: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/pages/SetupCheck.jsx
- src/brand/app.css: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/brand/app.css
- src/brand/brand2-1.css: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/brand/brand2-1.css
- src/brand/brand2-2.css: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/brand/brand2-2.css

## Part 4

- src/brand/brand2-3.css: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/brand/brand2-3.css
- src/brand/brand2-4.css: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/brand/brand2-4.css
- src/brand/kit2/components.css: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/brand/kit2/components.css
- src/brand/kit2/tokens.css: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/brand/kit2/tokens.css
- src/brand/tokens.css: https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v1.0.0/src/brand/tokens.css
