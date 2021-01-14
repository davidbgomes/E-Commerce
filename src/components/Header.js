import React from 'react'
import { Link } from "react-router-dom"
import "../styles/Header.css"
import MenuIcon from '@material-ui/icons/Menu';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import Badge from '@material-ui/core/Badge';

function Header(props){

	return(
		<nav className="navbar navbar-expand-lg nav-style navbar-light header">

			<MenuIcon className="menuHamburger" style={{ fontSize: 35, color:"ghostwhite", marginTop:"10px"}} onClick={() => props.toggleMenu()}/>

		    <div className={props.isHamburgerOpen ? "navbar-collapse show" : "navbar-collapse collapse"} id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
					<li className="nav-link m-2 menu-item nav-active">
						<Link to="/" className="nav-link menuItem" onClick={() => props.toggleMenu()}><span>Início</span></Link>
					</li>
					<li className="nav-link m-2 menu-item nav-active">
						<Link to="/ProductList" className="nav-link menuItem" onClick={() => props.toggleMenu()}><span>Produtos</span></Link>
					</li>
					<li className="nav-link m-2 menu-item nav-active">
						<Link to="/AboutUs" className="nav-link menuItem" onClick={() => props.toggleMenu()}><span>Sobre Nós</span></Link>
					</li>
				</ul>	
		    </div>

			{props.hasProducts &&
			<Link to="/Cart" className="nav-link menuItem" onClick={() => props.isHamburgerOpen && props.toggleMenu()}>
				<div className="cartMenuDiv">
					<Badge badgeContent={props.cartAmount} color="primary"/>
					<ShoppingCartOutlinedIcon className="cartIcon"/>
				</div>
			</Link>
			}

	    </nav>
	)
}

export default Header