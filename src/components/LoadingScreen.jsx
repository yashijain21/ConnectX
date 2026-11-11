import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let timeout
    const frame = window.requestAnimationFrame(() => {
      timeout = window.setTimeout(() => setVisible(false), 420)
    })

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="cx-loading-screen" role="status" aria-label="Loading ConnectX">
      <div className="cx-loader-card">
        <img src="/logos/connectx-horizontal.png" alt="ConnectX Technologies" />
        <span className="cx-loader-rule" aria-hidden="true"><i /></span>
        <span className="cx-loader-caption">Connecting what matters</span>
      </div>
    </div>
  )
}
