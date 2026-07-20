import { Component } from 'react';

// 子コンポーネントで例外が発生してもアプリ全体が真っ白になるのを防ぐ。
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('アプリの描画中にエラーが発生しました:', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div className="app-error" role="alert">
          <h1>問題が発生しました</h1>
          <p>アプリの表示中にエラーが発生しました。ページを再読み込みしてお試しください。</p>
          <pre>{String(this.state.error?.message || this.state.error)}</pre>
          <button type="button" onClick={() => window.location.reload()}>再読み込み</button>
        </div>
      );
    }
    return this.props.children;
  }
}
