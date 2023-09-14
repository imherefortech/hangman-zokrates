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
  }, [chainId]);

  if (!game) {
    return <div className="game">Please connect blockchain wallet to one of the supported chains</div>;
  }

  if (game.length === 0) {
    return <div className="game">Game doesn't exist</div>;
  }

  const gameFinished = game.word
    .slice(0, game.length)
    .every(v => v !== 0);

  let message;
  if (gameFinished) {
    message = '';
  } else if (game.host == address && game.isGuesserTurn) {
    message = 'This game is created by you. Wait for the players to make a guess';
  } else if (game.host == address && !game.isGuesserTurn) {
    message = 'Verify player\'s latest guess';
  } else if (game.isGuesserTurn) {
    message = "";
  } else {
    message = "Wait for the host to verify your guess";
  }

  return (
    <div className="game">
      <div>
        <h3>{gameFinished ? "Game finished!" : "Guess the secret word"}</h3>
        <WordToGuess game={game} />
      </div>
      <h5>{message}</h5>
      <LetterSelect game={game} onSubmit={revalidateData} />
      {game.host == address && !game.isGuesserTurn 
        ? <VerifyGuess game={game} onProofSubmitted={revalidateData} />
        : <span></span>
      }
    </div>
  );
}

export default ExistingGame;