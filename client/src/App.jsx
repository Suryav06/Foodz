import { BrowserRouter as Router ,Route,Routes } from 'react-router-dom';
import Home from './components/Home';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Info from './components/IGD/Info';
import Ing from './components/IGD/Ing';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Saved from './components/IGD/Saved';
import Error from './components/Err/Error';
import Error1 from './components/Err/Error1';



function App() {
  return (
    <Router>
    <Nav/>
  <Routes>
    
      <Route path='/' element={<Home/>}/>
      <Route path='/info' element={<Info/>}/>
      <Route path='/ing' element={<Ing/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/saved' element={<Saved/>}/>
      <Route path='/err' element={<Error/>}/>
      <Route path='/errr' element={<Error1/>}/>
      
      
    </Routes>
    <Footer/>

 
</Router>
  )
}

export default App