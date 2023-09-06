import './ExistingGame.css';
import { useContext, useEffect } from 'react';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import { WalletContext } from '../WalletContext';
import { WordToGuess, LetterSelect, VerifyGuess } from './';

function ExistingGame() {
  const game = useLoaderData();
  const revalidator = useRevalidator();
  const { address, chainId } = useContext(WalletContext);

  function revalidateData() {
    revalidator.revalidate();
  }

  useEffect(() => {
    revalidator.revalidate();
  }, [address, chainId]);

  if (game.length === 0) {
    return (<div className="game">Game doesn't exist</div>)
  }

  const gameFinished = game.word
    .slice(0, game.length)
    .every(v => v !== 0);

  return (
    <div className="game">
      <div>
        <h3>{gameFinished ? "Game finished!" : "Guess the word below"}</h3>
        <WordToGuess game={game} />
      </div>
      <h5>{gameFinished ? "" : game.isGuesserTurn ? "It is a player's turn to select a letter" : "It is a turn for the host to verify latest guess"}</h5>
      <LetterSelect game={game} onSubmit={revalidateData} />
      {game.isHost && !game.isGuesserTurn 
        ? <VerifyGuess game={game} onProofSubmitted={revalidateData} />
        : <span></span>
      }
    </div>
  );
}

export default ExistingGame;