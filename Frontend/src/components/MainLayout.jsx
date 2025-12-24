import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ErrorBoundary from './ErrorBoundary'

const MainLayout = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname === '/admin'

  return (
    <>
      <Header />
      <main className="flex-grow-1" style={{ background: 'var(--bg-secondary)' }}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default MainLayout

