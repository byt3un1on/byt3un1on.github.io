import { defineConfig } from 'vitest/config';

/**
 * Configuracao do runner. A cobertura NAO mora aqui: o builder `unit-test` do
 * Angular a gerencia, e as opcoes do arquivo de runner sao ignoradas por ele.
 * Limiar de 90% por arquivo e as exclusoes de fiacao estao em `angular.json`,
 * em `architect.test.options.coverageThresholds` e `coverageExclude`.
 *
 * O `include` abaixo serve ao `make it`, que roda o Vitest direto: os arquivos
 * de integracao usam sufixo `_test_integration.ts`, fora do padrao do Vitest.
 */
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.test.ts', 'tests/it/**/*_test_integration.ts'],
  },
});
