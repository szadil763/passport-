// Sobre o Carimbo: para quem é, como o conteúdo é feito, privacidade e créditos.
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { AUTHOR, CONTACT, MISSION, TECH } from '../data/credits';
import { Logo } from '../components/Icons';

export default function About() {
  usePageTitle('Sobre e créditos');
  return (
    <article className="stack about">
      <Logo className="hero-stamp" />
      <h1>Sobre o Carimbo</h1>
      <p className="lead">{MISSION}</p>

      <section aria-labelledby="para-quem">
        <h2 id="para-quem">Para quem é</h2>
        <p>
          Estudar fora é mais possível do que parece, com ou sem dinheiro. O Carimbo existe para mostrar os
          caminhos. <Link to="/mitos">Veja os mitos e as verdades.</Link>
        </p>
        <p>
          Para quem quer aprender um idioma, fazer intercâmbio, estudar ou trabalhar fora do Brasil, e para
          professores e escolas que apoiam esses alunos. O app reúne destinos, cidades, cursos online e bolsas
          em português, com um passo a passo até a chegada.
        </p>
      </section>

      <section aria-labelledby="como-fazemos">
        <h2 id="como-fazemos">Como o conteúdo é feito</h2>
        <ul className="bullets">
          <li>Todo visto e todo edital tem link para o site oficial. Regras e prazos mudam: confirme sempre na fonte.</li>
          <li>O app não inventa valores nem datas. Quando uma informação não foi confirmada, ele avisa.</li>
          <li>Os cursos e as bolsas listados são só indicações. O Carimbo não tem vínculo com as instituições citadas.</li>
        </ul>
      </section>

      <section aria-labelledby="privacidade">
        <h2 id="privacidade">Sua privacidade</h2>
        <p>
          Você pode explorar tudo sem criar conta. Quando entra, o app guarda só o seu perfil, o seu caminho, o
          seu orçamento e os seus favoritos, e só você consegue ler esses dados.
        </p>
        <p>
          O app também conta os acessos de forma anônima, para sabermos quantas pessoas usam cada tela. Não
          guardamos nome, e-mail nem endereço de IP nessa contagem. Se o seu navegador pede "não rastrear", o
          app respeita.
        </p>
      </section>

      <section aria-labelledby="creditos">
        <h2 id="creditos">Créditos</h2>
        <ul className="bullets">
          <li>
            <strong>Desenvolvido por:</strong> {AUTHOR || 'a equipe do Carimbo'}, com apoio do Claude Code, da
            Anthropic.
          </li>
          {TECH.map((t) => <li key={t}>{t}.</li>)}
          <li><strong>Conteúdo:</strong> sites oficiais de governos, universidades e programas, indicados em cada página. As marcas pertencem aos seus donos.</li>
        </ul>
      </section>

      {CONTACT && (
        <section aria-labelledby="contato">
          <h2 id="contato">Contato</h2>
          <p>
            Encontrou um erro, um link quebrado ou quer sugerir um curso ou uma bolsa? Escreva para{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>
        </section>
      )}

      <p><Link to="/">Voltar ao início</Link></p>
    </article>
  );
}
