import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

const MainLayout = () => {
  const location = useLocation()
  const isChatPage = location.pathname === '/chat'

  return (
    <>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      {!isChatPage && <Footer />}
      <ScrollToTop />
    </>
  )
}

export default MainLayout
