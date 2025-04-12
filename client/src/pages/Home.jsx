import Header from "../components/Home/Header";
import PlayerSection from "../components/Home/PlayerSection";
import LobbySection from "../components/Home/LobbySection";
import Footer from "../components/Home/Footer";
import useRestorePlayer from "../hooks/restorePlayer.js";
import usePlayerStore from "../stores/playerStore.js";

const Home = () => {

  useRestorePlayer(); // in case page refreshes, to update socket id in local and mongo db;
  const {player} = usePlayerStore(); // get the player if exists for conditional renders;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-between p-6">
      <Header />
      <div className="flex flex-col gap-8 items-center mt-10 flex-grow">
        <PlayerSection />
        {player && player._id ? <LobbySection /> : <></>}
         {/*^^ only render the lobby section if there is player present in state AND made on the db*/}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
