import { Button } from './components/Button'
import './App.css'

function App() {
  return (
    <main className="app">
      <header className="app__header">
        <p className="app__eyebrow">Innovations UI Kit</p>
        <h1>Button</h1>
        <p className="app__description">
          A primary button with three confirmed sizes from the UX handoff.
        </p>
      </header>

      <section className="app__section" aria-labelledby="button-sizes">
        <h2 id="button-sizes">Sizes</h2>
        <div className="app__examples">
          <div className="app__example">
            <Button size="sm">Small</Button>
            <span>32px</span>
          </div>
          <div className="app__example">
            <Button size="md">Medium</Button>
            <span>40px</span>
          </div>
          <div className="app__example">
            <Button size="lg">Large</Button>
            <span>48px</span>
          </div>
        </div>
      </section>

      <section className="app__section" aria-labelledby="button-disabled">
        <h2 id="button-disabled">Disabled</h2>
        <Button disabled>Save changes</Button>
      </section>
    </main>
  )
}

export default App
