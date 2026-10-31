import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Icon from './Icon'
import { company } from '../data/content'
import { navLinks, solutions } from '../data/content'

export function Brand({ inverse = false }) { return <Link className={`brand-lockup ${inverse ? 'brand-inverse' : ''}`} to="/" aria-label="ConnectX Technologies home"><img className="brand-logo" src="/logos/connectx-horizontal.png" alt="ConnectX Technologies"/></Link> }

export default function Header() {
  const [open, setOpen] = useState(false)
  return <><div className="topline"><div className="wrap topline-inner"><span>Connect to the world of eXcellence</span><a href={`mailto:${company.email}`}>Partner with ConnectX <Icon name="arrow-up-right" size={13} /></a></div></div>
  <header className="site-header"><div className="wrap header-inner"><Brand /><nav className={`main-nav ${open ? 'nav-open' : ''}`} aria-label="Main navigation"><NavLink onClick={() => setOpen(false)} to="/" end>Home</NavLink>{navLinks.map(item => item.label === 'Solutions' ? <div key={item.href} className="nav-dropdown"><NavLink onClick={() => setOpen(false)} to={item.href}>{item.label}<Icon name="down" size={13}/></NavLink><div className="dropdown-menu"><Link onClick={() => setOpen(false)} to="/solutions">All solutions <Icon name="arrow-up-right" size={14}/></Link>{solutions.map(solution=><Link onClick={() => setOpen(false)} key={solution.id} to={`/solutions/${solution.id}`}>{solution.short}<Icon name="arrow-up-right" size={14}/></Link>)}</div></div> : <NavLink onClick={() => setOpen(false)} key={item.href} to={item.href}>{item.label}</NavLink>)}<NavLink onClick={() => setOpen(false)} to="/contact" className="mobile-contact">Contact</NavLink><Link onClick={() => setOpen(false)} to="/contact#quote" className="mobile-contact mobile-quote">Request a quote <Icon name="arrow-up-right" size={15}/></Link></nav><div className="header-actions"><a className="header-phone" href={`mailto:${company.email}`}>Let's talk <Icon name="arrow-up-right" size={15}/></a><Link className="button button-primary button-small" to="/contact#quote">Request a quote <Icon name="arrow" size={15}/></Link><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}><Icon name={open ? 'close' : 'menu'} size={23}/></button></div></div></header></>
}
