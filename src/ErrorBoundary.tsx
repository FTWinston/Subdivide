import * as React from 'react';

interface IState {
    error?: Error;
}

export class ErrorBoundary extends React.PureComponent<{}, IState> {
    public render() {
        if (this.state === null || this.state.error === undefined) {
            return this.props.children;
        }

        return <div className="error">Error: {this.state.error.message}</div>;
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            error,
        });
    }
}
