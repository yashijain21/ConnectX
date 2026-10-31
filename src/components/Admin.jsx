import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

async function responseData(response) {
  try { return await response.json() }
  catch { throw new Error('The server returned an unreadable response. Please try again.') }
}

function LeadCard({ lead }) {
  const date = new Date(lead.createdAt)
  return <article className="admin-lead">
    <div className="admin-lead-heading">
      <div><span className="admin-lead-date">{Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString()}</span><h2>{lead.name}</h2></div>
      <span className="admin-lead-solution">{lead.solution}</span>
    </div>
    <div className="admin-lead-contact">
      <span><strong>Company</strong>{lead.company}</span>
      <span><strong>Email</strong><a href={`mailto:${lead.email}`}>{lead.email}</a></span>
      {lead.role && <span><strong>Role</strong>{lead.role}</span>}
      {lead.attachment && <span><strong>Attachment</strong><a href={lead.attachment.url} target="_blank" rel="noreferrer">{lead.attachment.filename} · {(lead.attachment.size / 1024 / 1024).toFixed(2)} MB</a></span>}
    </div>
    <div className="admin-lead-details"><strong>Project details</strong><p>{lead.details}</p></div>
    <div className="admin-email-status" aria-label="Email notification delivery">
      <span className={`is-${lead.notifications?.owner || 'pending'}`}>Owner email: {lead.notifications?.owner || 'pending'}</span>
      <span className={`is-${lead.notifications?.customer || 'pending'}`}>Customer email: {lead.notifications?.customer || 'pending'}</span>
    </div>
  </article>
}

export default function Admin() {
  const [view, setView] = useState('checking')
  const [leads, setLeads] = useState([])
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginBusy, setLoginBusy] = useState(false)

  async function loadLeads(requestedPage = 1) {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/leads?page=${requestedPage}`, { headers: { Accept: 'application/json' } })
      const result = await responseData(response)
      if (response.status === 401) {
        setView('login')
        return
      }
      if (!response.ok) throw new Error(result.error || 'Unable to load leads.')
      setLeads(result.leads)
      setPage(result.page)
      setPageCount(Math.ceil(result.total / result.pageSize))
      setTotal(result.total)
      setView('dashboard')
    } catch (requestError) {
      setError(requestError.message || 'Unable to load leads. Please try again.')
      if (view === 'checking') setView('login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadLeads(1) }, [])

  async function signIn(event) {
    event.preventDefault()
    const form = event.currentTarget
    setLoginBusy(true)
    setError('')
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: form.elements.email.value,
          password: form.elements.password.value,
        }),
      })
      const result = await responseData(response)
      if (!response.ok) throw new Error(result.error || 'Unable to sign in.')
      form.reset()
      await loadLeads(1)
    } catch (requestError) {
      setError(requestError.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoginBusy(false)
    }
  }

  async function signOut() {
    setError('')
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST', headers: { Accept: 'application/json' } })
      const result = await responseData(response)
      if (!response.ok) throw new Error(result.error || 'Unable to sign out.')
      setLeads([])
      setView('login')
    } catch (requestError) {
      setError(requestError.message || 'Unable to sign out. Please try again.')
    }
  }

  return <section className="admin-page">
    <div className="admin-topbar"><Link to="/" aria-label="ConnectX home"><img src="/logos/connectx-horizontal.png" alt="ConnectX Technologies"/></Link><Link to="/">Back to website</Link></div>
    {view === 'dashboard' ? <div className="admin-content">
      <div className="admin-heading">
        <div><span className="eyebrow">CONNECTX TECHNOLOGIES</span><h1>Enquiry dashboard</h1><p>Website project enquiries are visible here only after admin sign-in.</p></div>
        <div className="admin-actions"><button className="admin-refresh" type="button" onClick={() => loadLeads(page)} disabled={loading}>Refresh</button><button className="admin-signout" type="button" onClick={signOut}>Sign out</button></div>
      </div>
      {error && <p className="admin-message admin-error" role="alert">{error}</p>}
      <div className="admin-list-heading"><strong>{total} {total === 1 ? 'enquiry' : 'enquiries'}</strong>{total > 0 && <span>Showing {(page - 1) * 50 + 1}–{Math.min(page * 50, total)} of {total}</span>}</div>
      {loading && leads.length === 0 ? <p className="admin-empty">Loading enquiries…</p>
        : leads.length ? <div className="admin-leads">{leads.map(lead => <LeadCard key={lead.id} lead={lead}/>)}</div>
          : <p className="admin-empty">No enquiries yet. New website submissions will appear here.</p>}
      {pageCount > 1 && <div className="admin-pagination"><button type="button" onClick={() => loadLeads(page - 1)} disabled={loading || page <= 1}>Previous</button><span>Page {page} of {pageCount}</span><button type="button" onClick={() => loadLeads(page + 1)} disabled={loading || page >= pageCount}>Next</button></div>}
    </div> : <div className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={signIn}>
        <span className="eyebrow">RESTRICTED ACCESS</span><h1>Admin sign in</h1><p>Sign in with the admin credentials configured in the deployment environment.</p>
        {error && <p className="admin-message admin-error" role="alert">{error}</p>}
        <label htmlFor="admin-email">Admin email</label><input id="admin-email" type="email" name="email" autoComplete="username" required/>
        <label htmlFor="admin-password">Password</label><input id="admin-password" type="password" name="password" autoComplete="current-password" minLength={8} maxLength={8} pattern="[A-Za-z0-9]{8}" title="Enter the 8-character alphanumeric admin password." required/>
        <button className="button button-primary" type="submit" disabled={loginBusy}>{loginBusy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>}
  </section>
}
