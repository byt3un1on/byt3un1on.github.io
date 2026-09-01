/** Subcomando `pipeline mode` (RF-09): imprime o modo em vigor, uma linha, sem enfeite. */
export interface IResolveModeCommand {
  execute(): Promise<number>;
}
