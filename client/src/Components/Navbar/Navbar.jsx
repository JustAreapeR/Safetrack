import React, { useEffect } from 'react'
import { BiMenuAltRight } from 'react-icons/bi'
import logo from '../../images/logo.png'
import { Link } from "react-router-dom"
import toast from 'react-hot-toast'
import '../../styles/navbar.css'
import { useAuth } from '../../context/auth'

const Navbar = () => {
    const [auth, setAuth] = useAuth()

    const handleSubmit = () => {
        setAuth({
            ...auth,
            user: null,
            token: ''
        })
        localStorage.removeItem('auth')
        toast.success('Logged Out Successfully')
    }

    useEffect(() => {
        const navBar = document.querySelectorAll('.nav-link')
        const navCollapse = document.querySelector('.navbar-collapse.collapse')

        const handleNavClick = () => {
            navCollapse.classList.remove('show')
        }

        navBar.forEach((a) => {
            a.addEventListener('click', handleNavClick)
        })

        return () => {
            navBar.forEach((a) => {
                a.removeEventListener('click', handleNavClick)
            })
        }
    }, [])

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <Link to='/' className="navbar-brand">
                    <img src={logo} alt="SafeTrack Logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <BiMenuAltRight size={35} />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav menu-navbar-nav">
                        <li className="nav-item">
                            <Link to='/' className="nav-link" aria-current="page">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/about' className="nav-link" aria-current="page">About Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/contact' className="nav-link" aria-current="page">Contact Us</Link>
                        </li>
                    </ul>

                    <div className="ms-auto">
                        {!auth.user ? (
                            <>
                                <Link to='/login' className="nav-link learn-more-btn btn-extra-header">Login</Link>
                                <Link to='/register' className="nav-link learn-more-btn">Register</Link>
                                <Link to='/safezones' className="nav-link learn-more-btn">Safe Zones</Link>
                            </>
                        ) : (
                            <>
                                <Link to={`/dashboard${auth?.user?.role === 1 ? "/" : "/profile"}`} className="nav-link learn-more-btn">Dashboard</Link>
                                <Link to='/safezones' className="nav-link learn-more-btn">Safe Zones</Link>
                                <Link to='/login' className="nav-link learn-more-btn-logout" onClick={handleSubmit}>Logout</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar