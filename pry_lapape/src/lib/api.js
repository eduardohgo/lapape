export async function api(path, { method="POST", body, headers } = {}) {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const token = (typeof window !== "undefined")
    ? (localStorage.getItem("token") || sessionStorage.getItem("token"))
    : null;

  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store"
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || data?.message || "Error de servidor");
  return data;
}
