import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import BlockUi from '@availity/block-ui';
import prover from '../proof-generation';
import gameWriter from '../blockchain/game-writer';


function NewGame() {
  const [createGameProof, setCreateGameProof] = useState();
  const [[loading, loadingMessage], setLoading] = useState([false, ""]);
  const navigate = useNavigate();

  async function handleGenerateProof(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const word = formData.get("word");

    if (word.length < 3 || word.length > 16) return;
    
    const proof = await prover.generateCreateGameProof(word, async (status) => { 
      setLoading([true, status]);
      // Otherwise the thread is blocked by proof computations and status never updates
      await new Promise(resolve => {
        setTimeout(resolve, 100);
      }) 
    });
    
    setLoading([false, ""]);
    setCreateGameProof(proof);
  }

  async function handleSubmitProofToCreateGame(e) {
    e.preventDefault();
    
    setLoading([true, "Submitting transaction"]);
    const gameId = await gameWriter.createGame(createGameProof);    
    setLoading([false, ""]);

    navigate(`game/${gameId}`);
  }

  return (
    <BlockUi blocking={loading} message={loadingMessage}>
      <h5 style={{ width: "60%" }}>To create a new game pick a secret word (3-16 characters)</h5>
      {!createGameProof ?
      (<form className="Form" name="generate-proof" onSubmit={handleGenerateProof}>
          <input className="Form-text" name="word" autoComplete="off" type="text" />
          <button className="Form-submit Button" type="submit">Generate proof</button>
      </form>) :

      (<form name="submit-proof" onSubmit={handleSubmitProofToCreateGame}>
          <div className="Form-message">Proof generated! Now submit it to the blockchain to create a game</div>
          <button className="Form-submit Button" type="submit">Submit Proof</button>
      </form>)
      }
    </BlockUi>
  );
}

export default NewGame;