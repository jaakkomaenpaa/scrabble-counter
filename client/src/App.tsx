import { Routes, Route } from 'react-router-dom'
import Game from './pages/GameView'
import GameSetup from './pages/GameSetup'
import Navbar from './components/Navbar'
import ErrorPage from './pages/ErrorPage'
import TileText from './components/TileText'

//
//  <TileText text='Scrabble counter' customStyles={{maxWidth: '350px', marginLeft: '1rem'}} />

const App = () => {
  return (
    <div className='app'>
      <header>
        <h1 className='headerText'>Scrabble counter</h1>
        <Navbar />
      </header>
      <main className='content'>
        <Routes>
          <Route path='/' element={<GameSetup />} />
          <Route path='/game' element={<GameSetup />} />
          <Route path='/game/:gameId' element={<Game />} />
          <Route path='/ranking' element={<div>Not implemented yet</div>} />
          <Route path='/stats' element={<div>Not implemented yet</div>} />
          <Route
            path='/stats/player/:playerId'
            element={<div>Not implemented yet</div>}
          />
          <Route
            path='/stats/team/:teamId'
            element={<div>Not implemented yet</div>}
          />
          <Route path='/settings' element={<div>Not implemented yet</div>} />
          <Route path='/error' element={<ErrorPage />} />
          <Route path='/*' element={<ErrorPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
