export type CollectionNavigationParams = {
  view?: string;
  status?: string;
  q?: string;
  platform?: string;
  genre?: string;
};

export type GameNavigationParams = {
  view?: string;
  collection?: string;
};

export type GameNavigationView = "library" | "collection";
export type GameNavigationContext = {
  active: "library" | "collection" | "customCollections";
  breadcrumbLabel: string;
  breadcrumbHref: string;
  collectionId: string | null;
  view: GameNavigationView | null;
};

export function getGameNavigationContext(params: GameNavigationParams): GameNavigationContext {
  const collectionId = params.collection?.match(/^[A-Za-z0-9_-]{1,100}$/)?.[0];
  if (collectionId) {
    return {
      active: "customCollections" as const,
      breadcrumbLabel: "Coleções",
      breadcrumbHref: `/collections/${encodeURIComponent(collectionId)}`,
      collectionId,
      view: null,
    };
  }

  const view: GameNavigationView = params.view === "collection" ? "collection" : "library";
  return {
    active: view,
    breadcrumbLabel: view === "collection" ? "Minha coleção" : "Visão geral",
    breadcrumbHref: view === "collection" ? COLLECTION_HREF : "/?view=library",
    collectionId: null,
    view,
  };
}

export function addGameNavigationQuery(path: string, context: GameNavigationContext, extra: Record<string, string> = {}) {
  const query = new URLSearchParams();
  if (context.collectionId) query.set("collection", context.collectionId);
  else if (context.view) query.set("view", context.view);
  for (const [key, value] of Object.entries(extra)) query.set(key, value);
  const suffix = query.toString();
  return suffix ? `${path}?${suffix}` : path;
}

export function getCollectionNavigation(params: CollectionNavigationParams): {
  isCollection: boolean;
  active: "library" | "collection";
  heading: string;
  viewParam: GameNavigationView;
  clearHref: string;
  hasClearableFilters: boolean;
  hasCustomFilters: boolean;
} {
  const isCollection = params.view === "collection" || (!params.view && params.status === "BACKLOG");

  return {
    isCollection,
    active: isCollection ? "collection" as const : "library" as const,
    heading: isCollection ? "Minha coleção" : "Visão geral",
    viewParam: isCollection ? "collection" : "library",
    clearHref: isCollection ? "/?view=collection&status=BACKLOG" : "/?view=library",
    hasClearableFilters: Boolean(
      params.q || params.platform || params.genre || (params.status && !(isCollection && params.status === "BACKLOG")),
    ),
    hasCustomFilters: Boolean(
      params.q || params.platform || params.genre || (params.status && !(isCollection && params.status === "BACKLOG")),
    ),
  };
}

export const COLLECTION_HREF = "/?view=collection&status=BACKLOG";
