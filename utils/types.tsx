
// utils/types.tsx

// Este arquivo serve para centralizar todos os tipos e interfaces usados no app.
// Isso ajuda a manter o código mais organizado, reutilizável e fácil de manter.

// Por exemplo, a interface Trufa representa a estrutura de dados de uma trufa.
// Ao definir isso aqui, podemos importar e usar esse tipo em qualquer parte do app,
// garantindo consistência e evitando erros de digitação ou estrutura incorreta.


export interface Trufa {
  image: any;
  id: string;
  nome: string;
  preco: string
  descricao: string;
}
