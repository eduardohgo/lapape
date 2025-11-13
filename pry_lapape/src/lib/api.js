const ENV_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim() || "";

function buildURL(base, path) {
  if (!base) {
    throw new Error(
      "No se configuró la URL base del API. Define NEXT_PUBLIC_API_BASE o NEXT_PUBLIC_API_URL."
    );
  }

  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export async function api(path, { method = "POST", body, headers } = {}) {
  const url = buildURL(ENV_BASE, path);
  const token = (typeof window !== "undefined")
    ? (localStorage.getItem("token") || sessionStorage.getItem("token"))
    : null;

  const res = await fetch(url, {
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
