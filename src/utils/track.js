// Registra uma visita de página no Firestore. Anônimo: não guarda IP, nome nem identificador da pessoa.
// Só uma marca no navegador ("já contei este visitante hoje"), para somar visitantes distintos por dia.
import { doc, increment, setDoc } from 'firebase/firestore';
import { dayKey, sectionOf } from './analytics';

const MARK = 'carimbo:visitante-dia';

export function trackView(db, pathname) {
  // Respeita o "Não rastrear" do navegador.
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  const day = dayKey();
  let newVisitor = 0;
  try {
    if (localStorage.getItem(MARK) !== day) {
      localStorage.setItem(MARK, day);
      newVisitor = 1;
    }
  } catch {
    // Sem armazenamento (aba privada): conta só a página vista.
  }

  setDoc(
    doc(db, 'stats', day),
    { views: increment(1), visitors: increment(newVisitor), [sectionOf(pathname)]: increment(1) },
    { merge: true }
  ).catch(() => {}); // contar acessos nunca pode atrapalhar quem usa o app
}
