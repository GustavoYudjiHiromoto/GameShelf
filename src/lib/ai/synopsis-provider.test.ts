import { describe, expect, it, vi } from "vitest";
import { createSynopsisService, type SynopsisProvider } from "@/lib/ai/synopsis-provider";

describe("serviço de sinopses", () => {
  it("delegates a solicitação ao provedor configurado", async () => {
    const generate = vi.fn().mockResolvedValue("Uma aventura por um reino subterrâneo.");
    const service = createSynopsisService({ generate } satisfies SynopsisProvider);

    await expect(service.generate({ title: "Hollow Knight", platform: "Switch", genre: "Metroidvania" }))
      .resolves.toBe("Uma aventura por um reino subterrâneo.");
    expect(generate).toHaveBeenCalledWith({ title: "Hollow Knight", platform: "Switch", genre: "Metroidvania" });
  });
});
