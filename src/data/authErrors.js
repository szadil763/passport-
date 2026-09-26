// Traduz os códigos de erro do Firebase Auth para mensagens claras em português.
// Cada mensagem diz o que aconteceu e o que a pessoa pode fazer.
const MESSAGES = {
  'auth/invalid-credential': 'E-mail ou senha incorretos. Confira e tente de novo.',
  'auth/wrong-password': 'Senha incorreta. Confira e tente de novo.',
  'auth/user-not-found': 'Não encontramos conta com esse e-mail. Toque em "Criar conta".',
  'auth/invalid-email': 'Esse e-mail não parece válido. Confira se está escrito certo.',
  'auth/missing-password': 'Digite sua senha.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/email-already-in-use': 'Esse e-mail já tem conta. Toque em "Entrar" para acessar.',
  'auth/user-disabled': 'Essa conta foi desativada. Fale com o suporte do app.',
  'auth/too-many-requests': 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.',
  'auth/network-request-failed': 'Sem conexão com a internet. Verifique sua rede e tente de novo.',
  'auth/popup-closed-by-user': 'Você fechou a janela do Google antes de terminar. Tente de novo.',
  'auth/popup-blocked': 'O navegador bloqueou a janela do Google. Permita pop-ups para este site.',
  'auth/account-exists-with-different-credential':
    'Esse e-mail já está ligado a outra forma de login. Entre com e-mail e senha.',
  'auth/operation-not-allowed':
    'Esse tipo de login não está ativado no Firebase. Ative no console (Authentication > Método de login).',
  'auth/unauthorized-domain':
    'Este endereço não está autorizado no Firebase. Adicione o domínio em Authentication > Configurações.',
  'auth/invalid-api-key': 'A chave do Firebase está errada. Confira o arquivo .env.',
};

// Códigos que não são erro de verdade (a pessoa só cancelou): não mostramos nada.
const SILENT = new Set(['auth/cancelled-popup-request']);

export function authErrorMessage(error) {
  if (SILENT.has(error?.code)) return '';
  return MESSAGES[error?.code] ?? 'Não foi possível entrar agora. Tente de novo em instantes.';
}
