import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Room from "./pages/room";
import Chat from "./pages/chat";
import Protected from "./components/protected";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/*
         * Oturum açmayan kullanıcıların girmesini istemiyiceğim sayfaları protected kapsayıcısı router ile sarmalıyoruz
         */}
        <Route element={<Protected />}>
          <Route path="/room" element={<Room />} />
          <Route path="/chat/:room" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
