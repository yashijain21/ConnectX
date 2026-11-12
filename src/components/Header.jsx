import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Icon from './Icon'
import { company } from '../data/content'
import { navLinks, solutions } from '../data/content'
import QuoteForm from './QuoteForm'

export function Brand({ inverse = false }) { return <Link className={`brand-lockup ${inverse ? 'brand-inverse' : ''}`} to="/" aria-label="ConnectX Technologies home"><img className="brand-logo" src="/logos/connectx-horizontal.png" alt="ConnectX Technologies"/></Link> }

export default function Header() {
  const [open, setOpen] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const quoteTrigger = useRef(null)
  const quoteClose = useRef(null)
  useEffect(() => {
    if (!quoteOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    quoteClose.current?.focus()
    const onKeyDown = event => { if (event.key === 'Escape') setQuoteOpen(false) }
    window.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown); quoteTrigger.current?.focus() }
  }, [quoteOpen])
  const showQuote = () => { setOpen(false); setQuoteOpen(true) }
  return <><div className="topline"><div className="wrap topline-inner"><span>Connect to the world of eXcellence</span><a href={`mailto:${company.email}`}>Partner with ConnectX <Icon name="arrow-up-right" size={13} /></a></div></div>
  <header className="site-header"><div className="wrap header-inner"><Brand /><nav className={`main-nav ${open ? 'nav-open' : ''}`} aria-label="Main navigation">{navLinks.map(item => item.label === 'Solutions' ? <div key={item.href} className="nav-dropdown"><NavLink onClick={() => setOpen(false)} to={item.href}>{item.label}<Icon name="down" size={13}/></NavLink><div className="dropdown-menu"><Link onClick={() => setOpen(false)} to="/solutions">All solutions <Icon name="arrow-up-right" size={14}/></Link>{solutions.map(solution=><Link onClick={() => setOpen(false)} key={solution.id} to={`/solutions/${solution.id}`}>{solution.short}<Icon name="arrow-up-right" size={14}/></Link>)}</div></div> : <NavLink onClick={() => setOpen(false)} key={item.href} to={item.href}>{item.label}</NavLink>)}<NavLink onClick={() => setOpen(false)} to="/contact" className="header-connect mobile-contact">Let's connect <Icon name="arrow-up-right" size={15}/></NavLink><button type="button" onClick={showQuote} className="mobile-contact mobile-quote">Request a quote <Icon name="arrow-up-right" size={15}/></button></nav><div className="header-actions"><NavLink className="header-phone header-connect" to="/contact">Let's connect <Icon name="arrow-up-right" size={15}/></NavLink><button ref={quoteTrigger} type="button" className="button button-primary button-small" onClick={showQuote}>Request a quote <Icon name="arrow" size={15}/></button><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}><Icon name={open ? 'close' : 'menu'} size={23}/></button></div></div></header>{quoteOpen&&<div className="quote-modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)setQuoteOpen(false)}}><section className="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title"><div className="quote-modal-heading"><div><span className="eyebrow">PROJECT ENQUIRY</span><h2 id="quote-modal-title">Request a quote</h2><p>Tell us a little about your project and our team will get back to you.</p></div><button ref={quoteClose} type="button" className="quote-modal-close" onClick={()=>setQuoteOpen(false)} aria-label="Close quote form"><Icon name="close" size={21}/></button></div><QuoteForm formId="quote-modal-form"/></section></div>}</>
}
