import {  Route, BrowserRouter, Routes, Navigate} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Homepage from './pages/Homepage.js'

import { useEffect } from 'react';
import {gapi} from 'gapi-script'
import Navbar from './components/Navbar';
import Footer from './components/Footer';


const clientId = process.env.REACT_APP_CLIENTID

function App() {


  useEffect(()=>{
    function start(){
      gapi.client.init({
        clientId: clientId,
        scope:""
      })
      gapi.load('client:auth2', start)
    }
  })

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
      <Navbar/>

      <Routes>
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/signup" element={<SignupPage/>} />
      <Route path="/" element={<Homepage/>} />



       
        </Routes>
        <Footer/>
        </BrowserRouter>
    </>
  );
}

export default App;
