import style from './App.module.css';
import { Hero } from './components/Hero/Hero';
import { Footer } from './components/Footer/Footer';
import { TicketsList } from './components/tickets-list/TicketsList';

function App() {
  return (
    <div className={style.app}>
      <Hero />
      <TicketsList />
      <Footer />
    </div>
  );
}

export default App;
