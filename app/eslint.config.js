// @ts-check
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'out-tsc/**'],
  },
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked, ...angular.configs.tsRecommended],
    languageOptions: {
      parserOptions: {
        // vitest.config.ts e configuracao de ferramenta, nao codigo da aplicacao:
        // fica fora do tsconfig e entra no lint pelo projeto padrao.
        projectService: { allowDefaultProject: ['vitest.config.ts'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      // Tipagem explicita e regra dura do estilo da organizacao.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      // Nomes de componente seguem o prefixo bu, em kebab-case.
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'bu', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'bu', style: 'kebab-case' },
      ],
    },
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      // O Principio 3 exige expectativa dinamica: `expect(mock.metodo)`, com
      // referencia real ao metodo, e nunca o nome dele em string. E exatamente
      // essa referencia que `unbound-method` sinaliza. Desligar aqui preserva a
      // regra onde ela protege — no codigo de producao — sem obrigar o teste a
      // usar string, que e o defeito que a constituicao quer impedir.
      '@typescript-eslint/unbound-method': 'off',
      // O Cucumber exige que a funcao do passo tenha um parametro por
      // placeholder da expressao, mesmo quando o passo nao o usa. Sublinhado a
      // frente e a marcacao convencional para parametro deliberadamente ocioso.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
  },
);
