// /client/src/pages/Home.jsx
import { useEffect } from "react";
import Header from "../components/Header";
import PlayerSection from "../components/PlayerSection";
import LobbySection from "../components/LobbySection";
import Footer from "../components/Footer";
import server from "../utils/server";

const Home = () => {

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-between p-6">
      <Header />
      <div className="flex flex-col gap-8 items-center mt-10 flex-grow">
        <PlayerSection />
        <LobbySection />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
