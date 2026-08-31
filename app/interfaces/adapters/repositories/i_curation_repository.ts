import type { CurationDto } from '../../../core/domain/dtos/curation_dto';

/** Le a curadoria versionada (RF-04). O caminho vem do `IConfigTool`. */
export interface ICurationRepository {
  read(): Promise<CurationDto>;
}
