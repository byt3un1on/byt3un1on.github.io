/** Log estruturado. Campos nomeados, nunca texto livre interpolado. */
export interface ILoggerTool {
  info(message: string, fields?: Readonly<Record<string, unknown>>): void;
  error(message: string, fields?: Readonly<Record<string, unknown>>): void;
}
