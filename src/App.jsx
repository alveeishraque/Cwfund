import { Outlet } from 'react-router-dom'
import './App.css'
import Nav from './component/Nav/Nav'
import Footer from './component/Footer/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Nav></Nav>
      <Outlet></Outlet>
      <Footer></Footer>
      <ToastContainer position="bottom-right" />
    </>
  )
}

export default App
