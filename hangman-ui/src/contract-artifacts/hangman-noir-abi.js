const hangmanNoirContract = {
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_verifier",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "GameAlreadyExsits",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "GameNotActive",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "letter",
          "type": "uint8"
        }
      ],
      "name": "InvalidGuess",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidProof",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint32[8]",
          "name": "wordHash",
          "type": "uint32[8]"
        }
      ],
      "name": "InvalidWordHash",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "wordLength",
          "type": "uint8"
        }
      ],
      "name": "InvalidWordLength",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "bool[16]",
          "name": "input",
          "type": "bool[16]"
        }
      ],
      "name": "InvalidWordMask",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "letter",
          "type": "uint8"
        }
      ],
      "name": "LetterWasUsed",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "char",
          "type": "uint256"
        }
      ],
      "name": "NotAStartGameInput",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotGuesserTurn",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "latestGuess",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "verificationForGuess",
          "type": "uint8"
        }
      ],
      "name": "NotLatestGuess",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotTurnToVerify",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "host",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "attempted",
          "type": "address"
        }
      ],
      "name": "OnlyHost",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "wordLength",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "host",
          "type": "address"
        }
      ],
      "name": "GameCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint8[16]",
          "name": "word",
          "type": "uint8[16]"
        }
      ],
      "name": "GameEnded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "proof",
          "type": "bytes"
        },
        {
          "internalType": "bytes32[]",
          "name": "inputs",
          "type": "bytes32[]"
        }
      ],
      "name": "createGame",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "gameAttempts",
      "outputs": [
        {
          "internalType": "uint8[]",
          "name": "",
          "type": "uint8[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "gameWord",
      "outputs": [
        {
          "internalType": "uint8[16]",
          "name": "",
          "type": "uint8[16]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "games",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "length",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "guesserTurn",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "host",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "letter",
          "type": "uint8"
        }
      ],
      "name": "guessLetter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "secretWordHash",
      "outputs": [
        {
          "internalType": "uint32[8]",
          "name": "",
          "type": "uint32[8]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "proof",
          "type": "bytes"
        },
        {
          "internalType": "bytes32[]",
          "name": "inputs",
          "type": "bytes32[]"
        },
        {
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "verifyLetter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
}

export default hangmanNoirContract;