import './VerifyGuess.css';
import { useState } from 'react';
import BlockUi from '@availity/block-ui';
import hangmanZokrates from '../blockchain/zokrates/hangman-zokrates';
import utils from '../utils';

export default function VerifyGuess({ game, onProofSubmitted }) {
  const [proof, setProof] = useState();
  const [[ loading, loadingMessage ], setLoading] = useState([false, ""]);
  const [error, setError] = useState();
  const latestGuess = game.attempts.slice(-1);

  async function handleGenerateProof(e) {
    e.preventDefault();
    setLoading([false, ""]);
    setError("");

    const formData = new FormData(e.target);
    const word = formData.get("word");
    
    const hash = utils.paddedHash(word);
    for (var i = 0; i < 8; i++) {
      if (Number(hash[i]) !== game.secretWordHash[i]) {
        setError("Secret word is not correct, hashes don't match!");
        return;
      }
    }

    const proof = await hangmanZokrates.generateLetterProof(word, latestGuess.toString(), async (status) => {
      setLoading([true, status]);
      // Otherwise the thread is blocked by proof computations and status never updates
      await new Promise(resolve => {
        setTimeout(resolve, 100);
      })
    });

    setLoading([false, ""]);
    setProof(proof);
  }

  async function handleSubmitProof(e) {
    e.preventDefault();
    
    setLoading([true, "Submitting transaction"]);
    await hangmanZokrates.verifyLetter(proof, game.id);
    setLoading([false, ""]);

    onProofSubmitted();
  }

  return(
    <BlockUi className="verify-guess" blocking={loading} message={loadingMessage}>
      <h5>The current guess is <span>{String.fromCharCode(latestGuess)}</span></h5>

      {!proof ?
      (<form className="Form" name="generate-proof" onSubmit={handleGenerateProof}>
          <label className="Form-label">
          To generate proof for the guess re-enter the secret word:
          <input className="Form-text" name="word" autoComplete="off" type="text" />
          </label>
          <button className="Form-submit Button" type="submit">Generate proof</button>
      </form>) :

      (<form name="Form submit-proof" onSubmit={handleSubmitProof}>
          <div className="Form-message">Proof generated! Now submit it to the blockchain</div>
          <button className="Form-submit Button" type="submit">Submit proof</button>
      </form>)
      }
      <span className="verify-guess-error">{error}</span>      
    </BlockUi>
  );
}