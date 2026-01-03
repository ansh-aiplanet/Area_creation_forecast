import Header from './Header'
import Sidebar from './Sidebar'
import './Layout.css'

function Layout({ children, currentPage, onNavigate }) {
    return (
        <div className="layout">
            <Header />
            <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
            <main className="main-content">
                {children}
            </main>
        </div>
    )
}

export default Layout
