import type { ILoggerTool } from '../../interfaces/infra/tools/i_logger_tool.ts';

/**
 * Log estruturado em JSON, uma linha por evento. Campos nomeados em vez de
 * texto interpolado, para o registro do build ser filtravel por maquina.
 */
export class LoggerTool implements ILoggerTool {
  constructor(private readonly sink: (line: string) => void = console.log) {}

  public info(message: string, fields: Readonly<Record<string, unknown>> = {}): void {
    this.write('info', message, fields);
  }

  public error(message: string, fields: Readonly<Record<string, unknown>> = {}): void {
    this.write('error', message, fields);
  }

  private write(level: string, message: string, fields: Readonly<Record<string, unknown>>): void {
    this.sink(JSON.stringify({ level, message, ...fields }));
  }
}
