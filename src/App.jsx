import './App.css'

function App() {

  return (
    <div className="App">
      <main className="max-w-4xl mx-auto min-h-screen py-40 grid place-items-center text-center text-defaultIndigo">
            <section>
                <h1 className="text-5xl font-bold mb-1">Quizzical</h1>
                <p className="text-xl mb-10">Let's test your knowledge</p>
                <button className="place-self-center text-2xl py-4 px-16 rounded-2xl text-white bg-defaultIndigo">Start quiz</button>
            </section>
        </main>
    </div>
  )
}

export default App
