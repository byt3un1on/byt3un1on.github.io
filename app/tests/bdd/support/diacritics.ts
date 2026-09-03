/**
 * Remove os diacriticos de um texto, preservando tudo o mais — letra, espaco,
 * pontuacao e caixa.
 *
 * Existe para o cenario de RF-11: se o texto novo, sem os acentos, e identico
 * ao que a vitrine publicava antes, entao a correcao mexeu na grafia e em nada
 * mais. Frase reescrita, encurtada ou reordenada quebra a igualdade.
 *
 * A decomposicao canonica separa a letra do acento; o intervalo `̀-ͯ`
 * e o bloco Unicode das marcas combinantes, e e ele que se descarta.
 *
 * @example semDiacriticos('Endereço não encontrado') // 'Endereco nao encontrado'
 */
export function semDiacriticos(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '');
}
