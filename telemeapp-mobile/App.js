import React from "react";
import { InfoProvider } from "./src/Context/GlobalContext";
import Routes from "./src/routes";

export default function App() {
  return (
    <InfoProvider>
      <Routes />
    </InfoProvider>
  )
}
