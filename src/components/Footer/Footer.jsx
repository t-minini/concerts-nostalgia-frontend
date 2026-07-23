import { Link } from 'react-scroll';
import style from './Footer.module.css';

export function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.footer__container}>
        <Link
          to="hero"
          smooth={true}
          className={style['footer__title-container']}
        >
          <h2 className={style.footer__title}>concerts nostalgia</h2>
          <p className={style.footer__text}>
            my live concerts journey, revisited
          </p>
        </Link>
        <div className={style['footer__links-container']}>
          <a
            rel="noreferrer"
            title="linkedin"
            target={'_blank'}
            className={style.footer__link}
            href="https://www.linkedin.com/in/tulio-minini/"
          >
            linkedIn
          </a>
          <a
            title="github"
            rel="noreferrer"
            target={'_blank'}
            className={style.footer__link}
            href="https://github.com/t-minini"
          >
            github
          </a>
          <a
            rel="noreferrer"
            target={'_blank'}
            title="Send me an e-mail"
            className={style.footer__link}
            href="mailto:tulio.mminini@gmail.com"
          >
            email
          </a>
          <a
            rel="noreferrer"
            title="website"
            target={'_blank'}
            className={style.footer__link}
            href="https://tuliominini.com/"
          >
            website
          </a>
        </div>
      </div>
      <div className={style['footer__copyright-container']}>
        <p className={style['footer__copyright-text']}>
          &copy; 2026 Designed and built by Tulio Minini
        </p>
      </div>
    </footer>
  );
}
