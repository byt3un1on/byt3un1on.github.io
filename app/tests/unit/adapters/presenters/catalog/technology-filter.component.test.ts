import { fireEvent, render, screen } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { TechnologyFilterComponent } from '../../../../../adapters/presenters/catalog/technology-filter.component.ts';

describe('TechnologyFilterComponent', () => {
  it('deve oferecer um botao por tecnologia quando renderizado', async () => {
    // Arrange
    await render(TechnologyFilterComponent, {
      inputs: { technologies: ['Go', 'Python'], selected: null },
    });

    // Act
    const botoes = screen.getAllByRole('button');

    // Assert
    expect(botoes.map((b) => b.textContent?.trim())).toEqual(['Todas', 'Go', 'Python']);
  });

  it('deve marcar Todas como pressionado quando nenhuma tecnologia esta escolhida', async () => {
    // Arrange
    await render(TechnologyFilterComponent, {
      inputs: { technologies: ['Go'], selected: null },
    });

    // Act
    const botao = screen.getByRole('button', { name: 'Todas' });

    // Assert
    expect(botao.getAttribute('aria-pressed')).toBe('true');
  });

  it('deve marcar a tecnologia escolhida como pressionada quando ela esta ativa', async () => {
    // Arrange
    await render(TechnologyFilterComponent, {
      inputs: { technologies: ['Go'], selected: 'Go' },
    });

    // Act
    const botao = screen.getByRole('button', { name: 'Go' });

    // Assert
    expect(botao.getAttribute('aria-pressed')).toBe('true');
  });

  it('deve emitir a tecnologia quando o visitante a escolhe', async () => {
    // Arrange
    const selectedChange = vi.fn();
    await render(TechnologyFilterComponent, {
      inputs: { technologies: ['Go'], selected: null },
      on: { selectedChange },
    });

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));

    // Assert
    expect(selectedChange).toHaveBeenCalledExactlyOnceWith('Go');
  });

  it('deve emitir nulo quando o visitante remove a restricao', async () => {
    // Arrange
    const selectedChange = vi.fn();
    await render(TechnologyFilterComponent, {
      inputs: { technologies: ['Go'], selected: 'Go' },
      on: { selectedChange },
    });

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Todas' }));

    // Assert
    expect(selectedChange).toHaveBeenCalledExactlyOnceWith(null);
  });

  it('deve oferecer apenas Todas quando nao ha tecnologia alguma', async () => {
    // Arrange
    await render(TechnologyFilterComponent, {
      inputs: { technologies: [], selected: null },
    });

    // Act
    const botoes = screen.getAllByRole('button');

    // Assert
    expect(botoes).toHaveLength(1);
  });
});
