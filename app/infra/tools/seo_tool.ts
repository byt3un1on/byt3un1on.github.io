import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import type { ISeoTool } from '../../interfaces/infra/tools/i_seo_tool.ts';

/** RNF-06: titulo e descricao unicos por rota publica. */
@Injectable()
export class SeoTool implements ISeoTool {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  public apply(title: string, description: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
  }
}
