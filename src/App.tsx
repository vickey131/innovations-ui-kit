import './App.css'
import Gallery from './Gallery'

function App() {
  return (
    <main className="app">
      <header className="app__header">
        <p className="app__eyebrow">Innovations UI Kit</p>
        <h1>Component library</h1>
        <p className="app__description">
          Browse every component, its props and states in Storybook.
        </p>
      </header>

      <p>
        <a
          className="app__link"
          href="http://localhost:6006"
          target="_blank"
          rel="noreferrer"
        >
          Open Storybook
        </a>
      </p>
      <p className="app__note">
        Run <code>npm run storybook</code> first if the link does not load.
      </p>

      <Gallery />
    </main>
  )
}

export default App
