export type SynopsisErrorCategory = "authentication" | "credits" | "connection" | "unexpected";

export function isSynopsisErrorCategory(value: unknown): value is SynopsisErrorCategory {
  return value === "authentication" || value === "credits" || value === "connection" || value === "unexpected";
}

type ErrorDetails = {
  name?: unknown;
  message?: unknown;
  status?: unknown;
  code?: unknown;
  type?: unknown;
  error?: unknown;
  cause?: unknown;
};

function asErrorDetails(value: unknown): ErrorDetails | undefined {
  return typeof value === "object" && value !== null ? value as ErrorDetails : undefined;
}

export function classifySynopsisError(error: unknown): SynopsisErrorCategory {
  const details = asErrorDetails(error);
  if (!details) return "unexpected";

  const nestedError = asErrorDetails(details.error);
  const status = typeof details.status === "number" ? details.status : undefined;
  const identifiers = [details.code, details.type, nestedError?.code, nestedError?.type]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();
  const messages = [details.message, nestedError?.message, asErrorDetails(details.cause)?.message]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();

  if (status === 401 || /authentication|invalid_api_key|api_key_invalid|unauthorized|unauthenticated/.test(identifiers)) {
    return "authentication";
  }

  if (
    status === 402 ||
    /credit_balance_exhausted|insufficient_quota|quota_exceeded|resource_exhausted|billing_hard_limit/.test(identifiers) ||
    /credit balance exhausted|insufficient (api )?credits?|insufficient quota|quota exceeded|billing hard limit|resource exhausted/.test(messages)
  ) {
    return "credits";
  }

  const cause = asErrorDetails(details.cause);
  const connectionDetails = `${details.name ?? ""} ${identifiers} ${messages} ${cause?.name ?? ""} ${cause?.code ?? ""}`.toLowerCase();
  if (
    /apiconnection|networkerror|fetch failed|network request failed|connection error|timed? ?out|econn|enotfound|eai_again|socket hang up/.test(connectionDetails)
  ) {
    return "connection";
  }

  return "unexpected";
}
