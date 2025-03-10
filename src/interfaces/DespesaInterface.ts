export interface IDespesa extends IInformacoesAdicionais {
  descricao: string;
  data: string;
  preco: number;
  observacao?: string;
  id?: string;
}

export interface IInformacoesAdicionais {
  dt_reg: string;
  mes_ref: string;
  ano_ref: number;
}
