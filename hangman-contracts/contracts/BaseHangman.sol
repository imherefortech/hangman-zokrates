// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

abstract contract BaseHangman {

    /// @notice Mapping of game instances
    mapping(uint => Game) public games;
    
    /// @notice Information about the game including secret word, which turn it is, and previous user actions
    struct Game {
        /// @notice Length of a word that game host picked (max: 16)
        uint8 length;
        /// @notice Indicates whether it is a turn to guess a letter or post a proof whether the previous guess is correct
        bool guesserTurn;
        /// @notice Address that created the game
        address host;
        /// @notice sha-256 encrypted secret word that game host picked
        uint32[8] secretWordHash;
        /// @notice A list of attempts to guess letters that are in the word. Represented as codes of ASCII characters
        uint8[] attempts;
        /// @notice The resulting word as an array of ASCII characters. When first {length} characters of this array are set, the game ends
        uint8[16] word;
    }

    event GameCreated(uint indexed gameId, uint8 wordLength, address indexed host);
    event GameEnded(uint indexed gameId, uint8[16] word);

    error GameAlreadyExsits(uint gameId);
    error GameNotActive(uint gameId);
    error NotAStartGameInput(uint char);
    error InvalidProof();
    error InvalidWordMask(bool[16] input);
    error InvalidWordLength(uint8 wordLength);
    error NotGuesserTurn();
    error NotTurnToVerify();
    error LetterWasUsed(uint8 letter);
    error InvalidGuess(uint8 letter);
    error NotLatestGuess(uint8 latestGuess, uint8 verificationForGuess);
    error InvalidWordHash(uint32[8] wordHash);
    error OnlyHost(address host, address attempted);

    modifier _guesserTurn(uint gameId) {
        if (!games[gameId].guesserTurn) revert NotGuesserTurn();
        _;
    }

    modifier _verifierTurn(uint gameId) {
        if (games[gameId].guesserTurn) revert NotTurnToVerify();
        _;
    }

    modifier _letterNotUsed(uint gameId, uint8 letter) {
        Game memory game = games[gameId];
        for (uint i = 0; i < game.attempts.length; i++) {
            if (game.attempts[i] == letter) revert LetterWasUsed(letter);
        }
        _;
    }

    modifier _gameActive(uint gameId) {
        if (!isGameActive(gameId)) revert GameNotActive(gameId);
        _;
    }

    /**
     * @notice Suggests a letter to check whether it's in the word. Can only try one that wasn't checked before. Flips the turn to the verifier
     * @param gameId Game for which the guess is submitted
     * @param letter Letter as an ASCII code
     */
    function guessLetter(uint gameId, uint8 letter) external _letterNotUsed(gameId, letter) _gameActive(gameId) _guesserTurn(gameId) {
        if (letter == 0) revert InvalidGuess(letter);

        Game storage game = games[gameId];

        if (!game.guesserTurn) revert NotGuesserTurn();

        game.attempts.push(letter);
        game.guesserTurn = false;
    }

    function _createGame(uint32[8] memory wordHash, bool[16] memory wordMask) internal {
        uint gameId = uint(keccak256(abi.encodePacked(msg.sender, block.timestamp)));
        
        // Basic validation
        if (games[gameId].length > 0) revert GameAlreadyExsits(gameId);

        // Determine word length and validate mask input. Revert if it's not consecutive false's at the beginning followed by true's till the end
        uint8 wordLength;
        for (uint i = 0; i < wordMask.length; i++) {
            if (!wordMask[i] && wordLength == i) {
                wordLength++;
            } else if (!wordMask[i]) {
                revert InvalidWordMask(wordMask);
            }
        }

        if (wordLength < 3) revert InvalidWordLength(wordLength);

        games[gameId].secretWordHash = wordHash;
        games[gameId].length = wordLength;
        games[gameId].guesserTurn = true;
        games[gameId].host = msg.sender;

        emit GameCreated(gameId, wordLength, msg.sender);
    }

    function _verifyLetter(uint32[8] memory wordHash, uint8 letter, bool[16] memory mask, uint gameId) internal {
        Game storage game = games[gameId];

        // Validate input
        checkWordHashMatches(game, wordHash);
        if (letter != game.attempts[game.attempts.length - 1]) revert NotLatestGuess(game.attempts[game.attempts.length - 1], uint8(letter));

        // Store letter positions in the result if guessed correctly
        uint gameLength = game.length;
        for (uint i = 0; i < gameLength; i++) {
            if (mask[i]) {
                game.word[i] = uint8(letter);
            }
        }

        games[gameId].guesserTurn = true;

        if (!isGameActive(gameId)) {
            emit GameEnded(gameId, game.word);
        }
    }

    function checkWordHashMatches(Game memory game, uint32[8] memory wordHash) internal pure {
        for (uint i = 0; i < 8; i++) {
            if (game.secretWordHash[i] != uint32(wordHash[i])) revert InvalidWordHash(wordHash);
        }
    }

    function isGameActive(uint gameId) internal view returns (bool) {
        Game memory game = games[gameId];
        bool gameActive;
        for (uint i = 0; i < game.length; i++) {
            if (game.word[i] == 0) {
                gameActive = true;
                break;
            }
        }

        return gameActive;
    }

    function gameAttempts(uint gameId) public view returns (uint8[] memory) {
        return games[gameId].attempts;
    }

    function gameWord(uint gameId) public view returns (uint8[16] memory) {
        return games[gameId].word;
    }

    function secretWordHash(uint gameId) public view returns (uint32[8] memory) {
        return games[gameId].secretWordHash;
    }
}