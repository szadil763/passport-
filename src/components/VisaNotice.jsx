import { IconAlert } from './Icons';

// Aviso obrigatório em toda informação de visto.
export default function VisaNotice() {
  return (
    <p className="panel notice">
      <IconAlert />
      <span>Regras de visto mudam. Confirme no site oficial.</span>
    </p>
  );
}
