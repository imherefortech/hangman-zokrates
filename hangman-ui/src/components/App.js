import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NewGame, ExistingGame, Web3Connect } from './';
import gameLoader from '../data/game-loader';
import { WalletContextProvider } from '../WalletContext';
  
const router = createBrowserRouter([
  {
    path: "/",
    element: <NewGame />,
  },
  {
    path: "/game/:id",
    loader: gameLoader,
    element: <ExistingGame />
  }
]);

function App() {
  return (
    <WalletContextProvider>
      <div className="App">
        <div className="App-header">
          <Web3Connect />
        </div>
        <div className="App-container">
          <h2>
            Play "Hangman" powered by Zero Knowledge Proofs
          </h2>
          <div className="App-view">
            <RouterProvider router={router} />
          </div>
        </div>
      </div>
    </WalletContextProvider>
  );
}

export default App;
