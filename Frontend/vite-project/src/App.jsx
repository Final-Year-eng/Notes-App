import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Passrec from "./Passrec";
import ResetPassword from "./ResetPassword";
import Notes from "./Notes";
import Test from "./Test";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/passrec" element={<Passrec />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
