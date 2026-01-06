import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default MainLayout
