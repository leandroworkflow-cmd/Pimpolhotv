import { createClient } from "@base44/sdk";

const base44 = createClient({
  appId: import.meta.env.VITE_BASE44_APP_ID || "6a3bf9e58663112b2c03128d",
});

export const db = base44;
export default base44;
