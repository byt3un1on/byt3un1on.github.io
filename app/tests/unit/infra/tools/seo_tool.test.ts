import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { describe, expect, it, vi } from 'vitest';
import { SeoTool } from '../../../../infra/tools/seo_tool.ts';

function montar(): { tool: SeoTool; title: Title; meta: Meta } {
  const title = { setTitle: vi.fn() } as unknown as Title;
  const meta = { updateTag: vi.fn() } as unknown as Meta;
  TestBed.configureTestingModule({
    providers: [SeoTool, { provide: Title, useValue: title }, { provide: Meta, useValue: meta }],
  });
  return { tool: TestBed.inject(SeoTool), title, meta };
}

describe('SeoTool', () => {
  it('deve definir o titulo da pagina quando aplicado', () => {
    // Arrange
    const { tool, title } = montar();

    // Act
    tool.apply('Byte Union — projetos', 'Catalogo de projetos');

    // Assert
    expect(title.setTitle).toHaveBeenCalledExactlyOnceWith('Byte Union — projetos');
  });

  it('deve definir a descricao da pagina quando aplicado', () => {
    // Arrange
    const { tool, meta } = montar();

    // Act
    tool.apply('titulo', 'Catalogo de projetos da oficina');

    // Assert
    expect(meta.updateTag).toHaveBeenCalledExactlyOnceWith({
      name: 'description',
      content: 'Catalogo de projetos da oficina',
    });
  });
});
