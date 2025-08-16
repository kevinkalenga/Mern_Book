import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {useNavigate, Link} from 'react-router-dom'
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import {FashopingCart, FaUser, FachevronDown, FaBars, FaSignoutAlt, FaTimes} from 'react-icons/fa'

function Header() {
  
    const {userInfo} = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();
    const [menuOpen, setMenuOpen] = useState(false)
    const [adminOpen, setAdminOpen] = useState(false)
  
    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout())
            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
    <div>Header</div>
  )
}

export default Header
