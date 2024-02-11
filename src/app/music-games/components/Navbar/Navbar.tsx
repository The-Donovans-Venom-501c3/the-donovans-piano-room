import logo from '../../assets/svg/Logo.svg';
import './Navbar.scss';

export default function Navbar() {
  return (
    <header>
      <a href='https://thedonovanspianoroom.com'>
        <img src={logo} alt='' />
      </a>

      <a className='navigation-link' href='/'>
        Games
      </a>
    </header>
  );
}
