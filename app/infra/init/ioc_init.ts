import { InjectionToken, type Provider } from '@angular/core';
import { StaticCatalogRepository } from '../../adapters/repositories/static_catalog_repository.ts';
import { FilterProjectsByTechnologyUseCase } from '../../core/application/showcase/filter_projects_by_technology_use_case.ts';
import { FindProjectBySlugUseCase } from '../../core/application/showcase/find_project_by_slug_use_case.ts';
import { ListProjectsUseCase } from '../../core/application/showcase/list_projects_use_case.ts';
import { ListTechnologiesUseCase } from '../../core/application/showcase/list_technologies_use_case.ts';
import { SeoTool } from '../tools/seo_tool.ts';
import type { IStaticCatalogRepository } from '../../interfaces/adapters/repositories/i_static_catalog_repository.ts';
import type { IFilterProjectsByTechnologyUseCase } from '../../interfaces/core/application/showcase/i_filter_projects_by_technology_use_case.ts';
import type { IFindProjectBySlugUseCase } from '../../interfaces/core/application/showcase/i_find_project_by_slug_use_case.ts';
import type { IListProjectsUseCase } from '../../interfaces/core/application/showcase/i_list_projects_use_case.ts';
import type { IListTechnologiesUseCase } from '../../interfaces/core/application/showcase/i_list_technologies_use_case.ts';
import type { ISeoTool } from '../../interfaces/infra/tools/i_seo_tool.ts';

/**
 * Os tokens moram aqui, e nao junto das interfaces: `InjectionToken` e do
 * Angular, e declara-lo no contrato faria `core` depender do framework.
 */
export const STATIC_CATALOG_REPOSITORY = new InjectionToken<IStaticCatalogRepository>(
  'IStaticCatalogRepository',
);
export const LIST_PROJECTS_USE_CASE = new InjectionToken<IListProjectsUseCase>(
  'IListProjectsUseCase',
);
export const FILTER_PROJECTS_USE_CASE = new InjectionToken<IFilterProjectsByTechnologyUseCase>(
  'IFilterProjectsByTechnologyUseCase',
);
export const LIST_TECHNOLOGIES_USE_CASE = new InjectionToken<IListTechnologiesUseCase>(
  'IListTechnologiesUseCase',
);
export const FIND_PROJECT_USE_CASE = new InjectionToken<IFindProjectBySlugUseCase>(
  'IFindProjectBySlugUseCase',
);
export const SEO_TOOL = new InjectionToken<ISeoTool>('ISeoTool');

/** Sem condicao a decidir: cada interface tem uma implementacao so. */
export const IOC_PROVIDERS: readonly Provider[] = [
  {
    provide: STATIC_CATALOG_REPOSITORY,
    useFactory: (): IStaticCatalogRepository => new StaticCatalogRepository(),
  },
  {
    provide: LIST_PROJECTS_USE_CASE,
    useFactory: (repository: IStaticCatalogRepository): IListProjectsUseCase =>
      new ListProjectsUseCase(repository),
    deps: [STATIC_CATALOG_REPOSITORY],
  },
  {
    provide: FILTER_PROJECTS_USE_CASE,
    useFactory: (repository: IStaticCatalogRepository): IFilterProjectsByTechnologyUseCase =>
      new FilterProjectsByTechnologyUseCase(repository),
    deps: [STATIC_CATALOG_REPOSITORY],
  },
  {
    provide: LIST_TECHNOLOGIES_USE_CASE,
    useFactory: (repository: IStaticCatalogRepository): IListTechnologiesUseCase =>
      new ListTechnologiesUseCase(repository),
    deps: [STATIC_CATALOG_REPOSITORY],
  },
  {
    provide: FIND_PROJECT_USE_CASE,
    useFactory: (repository: IStaticCatalogRepository): IFindProjectBySlugUseCase =>
      new FindProjectBySlugUseCase(repository),
    deps: [STATIC_CATALOG_REPOSITORY],
  },
  { provide: SEO_TOOL, useClass: SeoTool },
];
