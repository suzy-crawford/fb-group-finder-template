import { base44 } from "@/api/base44Client";

// One helper for every AI call in the app. InvokeLLM is blocked in the browser,
// so this goes through the generateWithAI backend function.
export async function callAI({ prompt, response_json_schema }) {
  const response = await base44.functions.invoke("generateWithAI", { prompt, response_json_schema });
  const data = response?.data ?? response;
  if (data && data.error) {
    throw new Error(data.error);
  }
  let result = data?.result;
  if (typeof result === "string") {
    try {
      result = JSON.parse(result);
    } catch (e) {
      // leave as a string if it isn't JSON
    }
  }
  return result;
}