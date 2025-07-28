import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import NewHeader from './components/Header/NewHeader'
import NewFooter from './components/Footer/NewFooter'

function App() {

  return (
    <>
    {/* <Header /> */}
    <NewHeader />
    <Outlet />
    {/* <Footer /> */}
    <NewFooter />
    </>
  )
}

export default App
