import { Component } from 'react'
import { Container, Alert, Button } from 'react-bootstrap'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>Something went wrong</Alert.Heading>
            <p>An error occurred while rendering the page.</p>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
            </details>
            <hr />
            <div className="d-flex justify-content-end">
              <Button
                variant="outline-danger"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.href = '/'
                }}
              >
                Go to Home
              </Button>
            </div>
          </Alert>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

