/** Subcomando `pipeline version` (RF-10): imprime a proxima versao, uma linha, sem enfeite. */
export interface IResolveVersionCommand {
  execute(): Promise<number>;
}
