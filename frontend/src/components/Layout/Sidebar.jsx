import './Sidebar.css'

const menuItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'area-creation', label: 'Area Creation', icon: 'area' }
]

const icons = {
    home: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10L10 3L17 10M5 8.5V16.5C5 16.7761 5.22386 17 5.5 17H8.5V13C8.5 12.4477 8.94772 12 9.5 12H10.5C11.0523 12 11.5 12.4477 11.5 13V17H14.5C14.7761 17 15 16.7761 15 16.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    area: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    ),
}

function Sidebar({ currentPage, onNavigate }) {
    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                    >
                        <span className="sidebar-icon">{icons[item.icon]}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar
