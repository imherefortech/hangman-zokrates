import './LetterSelect.css';
import { useState, useContext } from 'react';
import classNames from "classnames";
import BlockUi from '@availity/block-ui';
import gameWriter from '../blockchain/game-writer';
import { WalletContext } from '../WalletContext';

export default function LetterSelect({ game, onSubmit }) {
  const { address } = useContext(WalletContext);
  const [selectedLetter, updateSelectedLetter] = useState(0);
  const [[ loading, loadingMessage ], updateLoading] = useState([false, ""]);
  const gameFinished = game.word
    .slice(0, game.length)
    .every(v => v !== 0);

  function letterAttempted(letter) {
    return game.attempts.includes(letter);
  }

  function letterPending(letter) {
    return game.attempts[game.attempts.length - 1] === letter && !game.isGuesserTurn;
  }

  function letterCorrect(letter) {
    return game.word.includes(letter);
  }

  function letterIncorrect(letter) {
    return letterAttempted(letter) && !letterCorrect(letter) && !letterPending(letter);
  }

  function handleSelect(e) {
    const selected = Number(e.target.attributes['code'].value);
    if (letterAttempted(selected)) return;

    if (selected === selectedLetter)
      updateSelectedLetter(0);
    else
      updateSelectedLetter(selected);
  }

  async function handleSubmit() {
    updateLoading([true, "Submitting transaction"]);
    await gameWriter.suggestLetter(game.id, selectedLetter);
    updateLoading([false, ""]);
    onSubmit();
  }

  const charOffset = 97;

  return (
    <BlockUi blocking={!game.isGuesserTurn || loading || gameFinished || game.host == address} message={loadingMessage}>
      <h5 className="pick-letter">Pick a letter:</h5>
      <div className="alphabet">
        {[...Array(26)].map((_, i) =>
          <span onClick={handleSelect} key={charOffset + i} code={charOffset + i} className={classNames({
            "alphabet-letter": true,
            "alphabet-letter-selected": selectedLetter == charOffset + i,
            "alphabet-letter-pending": letterPending(charOffset + i),
            "alphabet-letter-correct": letterCorrect(charOffset + i),
            "alphabet-letter-incorrect": letterIncorrect(charOffset + i)
          })}>
            {String.fromCharCode(charOffset + i)}
          </span>
        )}
      </div>
      {selectedLetter ? <button onClick={handleSubmit}>Submit</button> : <div></div>}
    </BlockUi>
  );
}