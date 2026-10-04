import { describe, expect, it } from "vitest";
import { classifySynopsisError, isSynopsisErrorCategory } from "@/lib/ai/synopsis-error";

describe("classificação de erros de sinopse", () => {
  it("classifica falhas de autenticação por status ou código", () => {
    expect(classifySynopsisError({ status: 401 })).toBe("authentication");
    expect(classifySynopsisError({ code: "invalid_api_key" })).toBe("authentication");
  });

  it("classifica falta de créditos sem depender do provider", () => {
    expect(classifySynopsisError({
      status: 429,
      code: "credit_balance_exhausted",
      type: "insufficient_quota",
    })).toBe("credits");
    expect(classifySynopsisError({ error: { type: "insufficient_quota" } })).toBe("credits");
    expect(classifySynopsisError({ status: 402 })).toBe("credits");
  });

  it("classifica erros de conexão e timeout", () => {
    expect(classifySynopsisError({ name: "APIConnectionError" })).toBe("connection");
    expect(classifySynopsisError({ message: "fetch failed", cause: { code: "ECONNRESET" } })).toBe("connection");
  });

  it("classifica erros sem detalhes reconhecidos como inesperados", () => {
    expect(classifySynopsisError(new Error("erro sem categoria conhecida"))).toBe("unexpected");
    expect(classifySynopsisError(null)).toBe("unexpected");
  });

  it("aceita apenas categorias conhecidas vindas da URL", () => {
    expect(isSynopsisErrorCategory("credits")).toBe(true);
    expect(isSynopsisErrorCategory("constructor")).toBe(false);
  });
});
