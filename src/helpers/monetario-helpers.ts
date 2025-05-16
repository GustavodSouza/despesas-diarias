export const formatarMonetarioBRparaArmazenamento = (valor) => {
  if (!valor || typeof valor !== 'string') return 0;

  const valorLimpo = valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();

  const numero = parseFloat(valorLimpo);
  return isNaN(numero) ? 0 : numero;
};

export const calcularTotalDespesas = (listaTotais: Array<number>) => {
  return listaTotais.reduce((total, numero) => total + parseFloat(numero.toString()), 0);
};
