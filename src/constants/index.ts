import { Permissoes } from "@/stores/permissionsStore";

export const ALL_PERMISSIONS = [
  Permissoes.admin,
  Permissoes.lancamento,
  Permissoes.periodo,
  Permissoes.verLancamentos,
  Permissoes.editarLancamentos,
  Permissoes.verPeriodos,
  Permissoes.editarPeriodos,
  Permissoes.deletarLancamentos,
  Permissoes.deletarPeriodos,
];

export const BASIC_PERMISSIONS = [
  Permissoes.lancamento,
  Permissoes.verLancamentos,
];

export const GPS_CONSTANTS = {
  DEFAULT_LATITUDE: -23.5505,
  DEFAULT_LONGITUDE: -46.6333,
};
