import './Header.css'

function Header() {
    return (
        <header className="header">
            <div className="header-left">
                <div className="header-logo">
                    <span className="logo-denso">DENSO</span>
                    <span className="logo-ai">AI</span>
                </div>
                <span className="header-title">Sales Forecasting Platform</span>
            </div>
            <div className="header-right">
                <div className="header-avatar">
                    <span>J</span>
                </div>
            </div>
        </header>
    )
}

export default Header
