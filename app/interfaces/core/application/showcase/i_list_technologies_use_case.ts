/** Tecnologias oferecidas ao visitante como criterio de restricao (RF-11). */
export interface IListTechnologiesUseCase {
  execute(): readonly string[];
}
