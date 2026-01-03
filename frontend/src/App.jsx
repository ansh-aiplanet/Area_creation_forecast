import { useState } from 'react'
import Layout from './components/Layout/Layout'
import AreaCreation from './pages/AreaCreation/AreaCreation'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('area-creation')

  const renderPage = () => {
    switch (currentPage) {
      case 'area-creation':
        return <AreaCreation />
      default:
        return <AreaCreation />
    }
  }

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}

export default App
