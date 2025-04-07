import Header from "../components/Header";
import PlayerSection from "../components/PlayerSection";
import LobbySection from "../components/LobbySection";
import Footer from "../components/Footer";
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
        {player ? <LobbySection /> : <></>}
         {/*^^ only render the lobby section if there is player present*/}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
