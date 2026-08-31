/**
 * Enderecos publicos do sitio. Toda ligacao interna nasce daqui, e nunca de
 * string solta em componente. As rotas sao relativas a raiz, sem esquema nem
 * host, que e o que o RNF-10 exige para a adocao futura de dominio proprio
 * nao quebrar endereco nenhum.
 */
export const SITE_ROUTES = {
  home: '/',
  catalog: '/projetos',
  project: '/projetos/:slug',
  notFound: '/404',
} as const;

export type SiteRouteName = keyof typeof SITE_ROUTES;

const SLUG_TOKEN = ':slug';

/**
 * Monta o endereco da pagina de um projeto (RF-08).
 *
 * @example projectRoute('shortsmaker') // '/projetos/shortsmaker'
 */
export function projectRoute(slug: string): string {
  const trimmed = slug.trim();
  if (trimmed.length === 0) {
    throw new Error(`slug invalido: recebido ${JSON.stringify(slug)}, esperado texto nao vazio`);
  }
  return SITE_ROUTES.project.replace(SLUG_TOKEN, trimmed);
}

/** Rotas fixas do sitio, sem as parametrizadas — as de projeto vem do catalogo. */
export function staticRoutes(): readonly string[] {
  return Object.values(SITE_ROUTES).filter((route) => !route.includes(SLUG_TOKEN));
}
