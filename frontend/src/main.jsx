import React, { Component } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#071A16', color: '#fff', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#6FCF45', fontSize: '24px', marginBottom: '16px' }}>Application Error Caught</h1>
          <pre style={{ background: '#0B241E', padding: '20px', borderRadius: '8px', color: '#ff6b6b', whiteSpace: 'pre-wrap', border: '1px solid rgba(255,255,255,0.1)' }}>
            {this.state.error?.toString()}
          </pre>
          <pre style={{ marginTop: '20px', fontSize: '12px', color: '#A8B5AF', whiteSpace: 'pre-wrap' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
