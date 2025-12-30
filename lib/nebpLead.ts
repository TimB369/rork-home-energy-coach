type LeadPayload = {
  name: string;
  phone: string;
  email: string;
  address: string;
  home_type: string;
  main_issue: string;
  contact_time?: string | null;
};

const API_URL = "https://euyqhbwusqtxdzjwayqr.supabase.co/functions/v1/api";

export async function submitLead(payload: LeadPayload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      address: payload.address,
      home_type: payload.home_type,
      main_issue: payload.main_issue,
      contact_time: payload.contact_time ?? null,
    }),
  });

  const contentType = res.headers.get("content-type") ?? "";
  const text = await res.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON but got "${contentType}" (status ${res.status}). First 200 chars: ${text.slice(0, 200)}`
    );
  }

  const json = JSON.parse(text);

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${JSON.stringify(json)}`);
  }

  return json as { success: true; id: string };
}
