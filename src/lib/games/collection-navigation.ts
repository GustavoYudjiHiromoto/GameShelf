export type CollectionNavigationParams = {
  view?: string;
  status?: string;
  q?: string;
  platform?: string;
  genre?: string;
};

export function getCollectionNavigation(params: CollectionNavigationParams) {
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
  };
}

export const COLLECTION_HREF = "/?view=collection&status=BACKLOG";
