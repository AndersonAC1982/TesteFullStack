// Aplica máscara de CPF (000.000.000-00)
 
export const maskCPF = (value: string): string => {
  // Remove tudo que não é dígito
  const cleaned = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const limited = cleaned.slice(0, 11);
  
  // Aplica a máscara
  let masked = limited;
  if (limited.length > 3) {
    masked = `${limited.slice(0, 3)}.${limited.slice(3)}`;
  }
  if (limited.length > 6) {
    masked = `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
  }
  if (limited.length > 9) {
    masked = `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
  }
  
  return masked;
};

// Remove máscara do CPF
 
export const unmaskCPF = (value: string): string => {
  return value.replace(/\D/g, '');
};

// Formata valor monetário (R$ 0.000,00)
export const formatCurrency = (value: number): string => {
  // Se o valor for nulo, indefinido ou não for um número, retorna R$ 0,00
  if (value === undefined || value === null || isNaN(value)) {
    return 'R$ 0,00';
  }

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

// Aplica máscara de moeda durante a digitação

export const maskCurrency = (value: string): string => {
  // Remove tudo que não é dígito
  const cleaned = value.replace(/\D/g, '');
  
  if (!cleaned) return '';
  
  // Converte para número (centavos)
  const number = parseFloat(cleaned) / 100;
  
  // Formata como moeda
  return formatCurrency(number);
};

// Remove máscara da moeda e retorna o valor numérico

export const unmaskCurrency = (value: string): number => {
  // Remove R$, pontos e substitui vírgula por ponto
  const cleaned = value.replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};
