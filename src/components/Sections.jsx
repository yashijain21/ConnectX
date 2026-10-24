import { Link } from 'react-router-dom'
import Icon from './Icon'
import { solutions, industries, brandGroups, standards } from '../data/content'

export function SectionHeading({ label, title, text, light=false, centered=false }) { return <div className={`section-heading ${light?'heading-light':''} ${centered?'heading-centered':''}`}><div><span className="eyebrow">{label}</span><h2>{title}</h2></div>{text&&<p>{text}</p>}</div> }

export function SolutionGrid({ items=solutions, compact=false }) { return <div className={`solution-grid ${compact?'solution-grid-compact':''}`}>{items.map((s,i)=><Link className="solution-card" to={`/solutions/${s.id}`} key={s.id}><div className="solution-card-visual" style={{'--card-image':`url(https://images.unsplash.com/${s.image}?auto=format&fit=crop&w=800&q=82)`}}><span className="solution-number">{s.number}</span><span className="solution-icon"><Icon name={s.icon} size={22}/></span><span className="solution-arrow"><Icon name="arrow-up-right" size={19}/></span></div><div className="solution-card-copy"><span className="eyebrow">{s.eyebrow}</span><h3>{s.title}</h3><p>{s.text}</p><span className="text-link">Explore solution <Icon name="arrow" size={16}/></span></div></Link>)}</div> }

export function IndustryGrid({ compact=false }) { return <div className={`industry-grid ${compact?'industry-grid-compact':''}`}>{industries.map((item,i)=><Link className="industry-card" key={item.name} to="/contact#quote" aria-label={`Discuss a ${item.name} project with ConnectX`}><span className="industry-num">0{i+1}</span><span className="industry-icon"><Icon name={item.icon}/></span><h3>{item.name}</h3><p>{item.text}</p><span className="industry-card-arrow" aria-hidden="true"><Icon name="arrow-up-right" size={18}/></span></Link>)}</div> }

export function BrandStrip() { return <div className="brand-strip-outer"><div className="brand-strip">{brandGroups.map(group=><div key={group.name} className="brand-badge"><span className="brand-placeholder-mark"><Icon name={group.icon} size={19}/></span><span>{group.name}<small>LOGO PENDING APPROVAL</small></span></div>)}</div></div> }

export function StandardsStrip() { return <div className="standards-strip"><span className="eyebrow">STANDARDS REFERENCED IN THE BRIEF</span><div>{standards.map(item=><span key={item}>{item}</span>)}</div><p>Product applicability and any ConnectX certification claims require verification.</p></div> }

export function FeatureRow({ icon, title, text }) { return <div className="feature-row"><span className="feature-icon"><Icon name={icon}/></span><div><h3>{title}</h3><p>{text}</p></div></div> }
