/**
 * Incremento semantico derivado dos commits convencionais (RF-10). A ordem do
 * arranjo e a ordem de precedencia: um commit incompativel no meio de dez
 * correcoes eleva a major, e nao a patch.
 */
export const VERSION_BUMPS = ['patch', 'minor', 'major'] as const;

export type VersionBump = (typeof VERSION_BUMPS)[number];

export function isVersionBump(value: unknown): value is VersionBump {
  return typeof value === 'string' && VERSION_BUMPS.includes(value as VersionBump);
}

/** Devolve o maior entre dois incrementos, pela precedencia declarada acima. */
export function highestVersionBump(left: VersionBump, right: VersionBump): VersionBump {
  return VERSION_BUMPS.indexOf(left) >= VERSION_BUMPS.indexOf(right) ? left : right;
}
