import { describe, expect, it } from 'vitest';
import { ClassifyVersionBumpUseCase } from '../../../../../core/application/pipeline/classify_version_bump_use_case.ts';

describe('ClassifyVersionBumpUseCase', () => {
  it('deve devolver patch quando nao ha mensagem alguma', () => {
    // Arrange
    const useCase = new ClassifyVersionBumpUseCase();

    // Act
    const incremento = useCase.execute([]);

    // Assert
    expect(incremento).toBe('patch');
  });

  it('deve devolver patch quando so ha correcoes', () => {
    // Arrange
    const useCase = new ClassifyVersionBumpUseCase();

    // Act
    const incremento = useCase.execute(['fix: corrige o rodape', 'fix(vitrine): ajusta o titulo']);

    // Assert
    expect(incremento).toBe('patch');
  });

  it('deve devolver minor quando so ha funcionalidades', () => {
    // Arrange
    const useCase = new ClassifyVersionBumpUseCase();

    // Act
    const incremento = useCase.execute(['feat: publica a vitrine', 'feat(esteira): versiona']);

    // Assert
    expect(incremento).toBe('minor');
  });

  it('deve devolver minor quando ha funcionalidade e correcao na mesma faixa', () => {
    // Arrange
    const useCase = new ClassifyVersionBumpUseCase();

    // Act
    const incremento = useCase.execute(['fix: corrige o rodape', 'feat: publica a vitrine']);

    // Assert
    expect(incremento).toBe('minor');
  });

  it('deve devolver major quando o cabecalho marca mudanca incompativel', () => {
    // Arrange
    const useCase = new ClassifyVersionBumpUseCase();

    // Act
    const incremento = useCase.execute(['feat!: troca o formato do catalogo']);

    // Assert
    expect(incremento).toBe('major');
  });

  it('deve devolver major quando o corpo avisa mudanca incompativel', () => {
    // Arrange
    const useCase = new ClassifyVersionBumpUseCase();

    // Act
    const incremento = useCase.execute([
      'fix: reordena os campos\n\nBREAKING CHANGE: o catalogo antigo nao carrega mais',
    ]);

    // Assert
    expect(incremento).toBe('major');
  });

  it('deve devolver major quando uma unica mensagem incompativel acompanha dez correcoes', () => {
    // Arrange
    const useCase = new ClassifyVersionBumpUseCase();
    const mensagens = [
      ...Array.from({ length: 10 }, (_, indice: number): string => `fix: corrige o item ${indice}`),
      'refactor!: remove o passo antigo',
    ];

    // Act
    const incremento = useCase.execute(mensagens);

    // Assert
    expect(incremento).toBe('major');
  });

  it('deve devolver patch quando a mensagem foge do padrao convencional', () => {
    // Arrange
    const useCase = new ClassifyVersionBumpUseCase();

    // Act
    const incremento = useCase.execute(['ajustes gerais', 'wip']);

    // Assert
    expect(incremento).toBe('patch');
  });

  it('deve devolver minor quando mensagem fora do padrao acompanha uma funcionalidade', () => {
    // Arrange
    const useCase = new ClassifyVersionBumpUseCase();

    // Act
    const incremento = useCase.execute(['ajustes gerais', 'feat: publica a vitrine']);

    // Assert
    expect(incremento).toBe('minor');
  });
});
