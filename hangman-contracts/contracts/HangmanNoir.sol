// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import './BaseHangman.sol';
import './verifiers/HangmanVerifierNoir.sol';

contract HangmanNoir is BaseHangman {
    
    /// @notice Zokrates proof verifier
    HangmanVerifierNoir immutable verifier;

    constructor(address _verifier) {
        verifier = HangmanVerifierNoir(_verifier);
    }

    /**
     * @notice Creates new game. Persists hash of a secret word and the length of the word.
     * @param proof Zero knowledge proof
     * @param inputs Input for the verifier where:
     *  Elements  [0-7] - sha-256 hash of the secret word. Word can be from 3 to 16 characters long.
     *  Element     [8] - '0'. Required for creating new game, explained below.
     *  Elements [9-24] - a mask representing occurance of Element 8 in the word.
     *    For "Hello" the mask will be 0000011111111111 which proofs that the word is 5 characters long
     */
    function createGame(bytes calldata proof, bytes32[] calldata inputs) external {

        if (inputs[8] != 0) revert NotAStartGameInput(uint(inputs[8]));

        uint32[8] memory wordHash;
        for (uint i = 0; i < 8; i++) {
            // Casting is safe as proof verification would fail if these are not u32 numbers
            wordHash[i] = uint32(uint(inputs[i]));
        }

        bool[16] memory wordMask;
        for (uint i = 9; i < inputs.length; i++) {
            wordMask[i-9] = inputs[i] == 0 ? false : true;
        }

        _createGame(wordHash, wordMask);

        if (!verifier.verify(proof, inputs)) revert InvalidProof();
    }

    /**
     * @notice Verifies whether the letter exists in the secret word and captures letter's positions if guessed correctly. 
     * Only executed after a guess is made. Flips the turn back to the guesser.
     * @param proof Zero knowledge proof
     * @param inputs Input for the verifier where:
     *  Elements  [0-7] - sha-256 hash of the secret word. Word can be from 3 to 16 characters long.
     *  Element     [8] - a letter that was last suggested by the guesser. 
     *  Elements [9-24] - a mask representing positions of El.8 in the word. For example, for word "Hello" and letter "l" it will be 0011000000000000
     * @param gameId Game for which verification is submitted
     */
    function verifyLetter(bytes calldata proof, bytes32[] calldata inputs, uint gameId) external _verifierTurn(gameId) {
        uint32[8] memory wordHash;
        for (uint i = 0; i < 8; i++) {
            // Casting is safe as proof verification would fail if these are not u32 numbers
            wordHash[i] = uint32(uint(inputs[i]));
        }

        bool[16] memory mask;
        for (uint i = 9; i < inputs.length; i++) {
            mask[i-9] = inputs[i] == 0 ? false : true;
        }

        uint8 letter = uint8(uint(inputs[8]));

        _verifyLetter(wordHash, letter, mask, gameId);

        if (!verifier.verify(proof, inputs)) revert InvalidProof();
    }
}
