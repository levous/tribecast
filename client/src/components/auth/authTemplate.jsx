function withAuthTemplate(WrappedComponent) {
  return class AuthTemplate extends React.Component {
    render() {
      return (
          <WrappedComponent {...this.props}>
      )
    }
  }
