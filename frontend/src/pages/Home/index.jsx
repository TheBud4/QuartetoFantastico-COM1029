import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./style.css";

function Home() {
  return (
    <>
      <div className="container">
        <Sidebar />
        <img src="./background-image.png" alt="backgound-image" />
        <h1>Bem Vindos a SANEM!</h1>
      </div>
    </>
  );
}

export default Home;
