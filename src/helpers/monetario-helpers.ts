export const formatarMonetarioBRparaArmazenamento = (valor) => {
  let valorLimpo = valor.replace('R$', '').trim();

  valorLimpo = valorLimpo.replace(',', '.');

  return parseFloat(valorLimpo);
};

export const calcularTotalDespesas = (listaTotais: Array<number>) => {
  return listaTotais.reduce((total, numero) => total + parseFloat(numero.toString()), 0);
};
