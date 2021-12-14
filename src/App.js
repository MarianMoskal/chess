import Chessboard from "chessboardjsx";
import React, {
  useEffect,
  useState
} from "react";

const INITIAL_POSITION = {
    a3: 'wP', b3: 'wP', c3: 'wP', d3: 'wP', e3: 'wP', f3: 'wP', g3: 'wP', h3: 'wP', d1: 'wQ', e1: 'wK', a6: 'bP', b6: 'bP', c6: 'bP', d6: 'bP', e6: 'bP', f6: 'bP', g6: 'bP', h6: 'bP', d8: 'bQ', e8: 'bK'
  }


function App() {
  const [position, setPosition] = useState(INITIAL_POSITION)
  const [newPosition, setNewPosition] = useState({})
  const [gameOver, setGameOver] = useState(false)
  const [botMove, setBotMove] = useState(false)   

  useEffect(() => {
    setNewPosition(Object.fromEntries(Object.entries(position)));
  }, [position])

  console.log(newPosition);

  const V = ['1', '2', '3', '4', '5', '6', '7', '8']
  const H = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const pieces = ['wP', 'bP', 'wQ', 'bQ', 'wK', 'bK']
  const white = pieces.filter((el) => el.includes('w'));
  

  const handleMove = ({ from, to, piece }) => {
    // console.log('handle move', newPosition);
    console.log({ from, to, piece });

    const legalPieceMoves = legalMove(piece, H, V, from);
    const piecesAndPositions = [];
    Object.entries(newPosition).flatMap(el => piecesAndPositions.push(...el));

    
    if (legalPieceMoves.includes(to)) {
      for (const el of Object.entries(newPosition)) {
        const rule1 = piecesAndPositions.indexOf(to) !== -1 && piece[0] === piecesAndPositions[piecesAndPositions.indexOf(to) + 1][0]
        const rule2 = el[1].includes('P') && !piecesAndPositions.includes(to) && from[0] !== to[0]
        const rule3 = el[1].includes('P') && piecesAndPositions.includes(to) && from[0] === to[0]

        if (botMove && el[0] === from) {
          if (rule1 || rule2 || rule3) {
           return setBotMove(true)
          }
        }

        if (el[0] === from) {
          if (rule1 || rule2 || rule3) {
            return
          }
        }
      }
      
      // if (botMove && piecesAndPositions.includes(to)) {
        delete newPosition[to];
        delete newPosition[from];
        newPosition[to] = `${piece}`;
        // console.log('after', newPosition);

      // }
      // else {
      //   delete Object.assign(newPosition, { [to]: piece })[from] //?
      // }
      //  console.log('after', newPosition);
          
      if (piece[1] === 'P' && (to[1] === '1' || to[1] === '8')) {
        newPosition[to] = `${piece[0]}Q`
      }
      
      setPosition(newPosition);

      
      if (!botMove) {
        setBotMove(true)
      }
      setBotMove(false)
    }
  }


  if (botMove) {
      const botMoves = Object.entries(newPosition).filter(el => el[1].includes('b'))
      const getMove = botMoves[Math.floor(Math.random() * botMoves.length)];
      const prepareMove = legalMove(getMove[1], H, V, getMove[0]).filter(el => el.length === 2)
      const move = prepareMove[Math.floor(Math.random() * prepareMove.length)]
      handleMove({ from: getMove[0], to: move, piece: getMove[1]})
    }


  const handleDrag = ({ piece }) => {
    if (!botMove && white.includes(piece)) {
      return true
    }
  }
  
  const startNewGame = () => {
    setGameOver(false)
    window.location.reload();
  }

  return (
    <>
    <div style = {{display: "flex", justifyContent:'center'}}>
      <Chessboard
        position={position}
        draggable={!gameOver}
        allowDrag={(x) => handleDrag(x)}
        calcWidth={({ screenWidth }) => screenWidth / 2.2}
        getPosition={(x) => {
          const arr = Object.values(x);
          if (!arr.includes('wK') || !arr.includes('bK')) {
            setGameOver(true)
          }
        }}
        onDrop={
          ({ sourceSquare, targetSquare, piece }) => 
            handleMove({
              from: sourceSquare,
              to: targetSquare,
              piece: piece
            })
          }
      />
      </div>
      {gameOver
        ? <>
          <h1 style={{ color: 'red' }}> GAME OVER</h1 >
          <button type='button' onClick={startNewGame}>One more game?</button>
          </>
        : null}
    </>
  );
}

export default App;



  const legalMove = (piece, arrH, arrV, pos) => {
    if (piece === 'wP') {
      const wp_h = pos[0];
      const wp_v = pos[1];
        return [`${wp_h + arrV[arrV.indexOf(wp_v) + 1]}`,
        `${arrH[arrH.indexOf(wp_h) + 1] + arrV[arrV.indexOf(wp_v) + 1]}`,
        `${arrH[arrH.indexOf(wp_h) - 1] + arrV[arrV.indexOf(wp_v) + 1]}`
      ]
    } else if (piece === 'bP') {
      const bp_h = pos[0];
      const bp_v = pos[1];
        return [`${bp_h + arrV[arrV.indexOf(bp_v) - 1]}`,
        `${arrH[arrH.indexOf(bp_h) + 1] + arrV[arrV.indexOf(bp_v) - 1]}`,
        `${arrH[arrH.indexOf(bp_h) - 1] + arrV[arrV.indexOf(bp_v) - 1]}`
      ]
    } else if (piece === 'wK' || piece === 'bK') {
      const k_h = pos[0];
      const k_v = pos[1];
        return [
          `${k_h + arrV[arrV.indexOf(k_v) + 1]}`,
          `${k_h + arrV[arrV.indexOf(k_v) - 1]}`,
          `${arrH[arrH.indexOf(k_h) + 1] + k_v}`,
          `${arrH[arrH.indexOf(k_h) - 1] + k_v}`
        ]
    } else if (piece === 'wQ' || piece === 'bQ') {
      const q_h = pos[0];
      const q_v = pos[1];
        return [
          `${q_h + arrV[arrV.indexOf(q_v) + 1]}`,
          `${q_h + arrV[arrV.indexOf(q_v) - 1]}`,
          `${arrH[arrH.indexOf(q_h) + 1] + q_v}`,
          `${arrH[arrH.indexOf(q_h) - 1] + q_v}`,
          `${arrH[arrH.indexOf(q_h) + 1] + arrV[arrV.indexOf(q_v) + 1]}`,
          `${arrH[arrH.indexOf(q_h) + 1] + arrV[arrV.indexOf(q_v) - 1]}`,
          `${arrH[arrH.indexOf(q_h) - 1] + arrV[arrV.indexOf(q_v) + 1]}`,
          `${arrH[arrH.indexOf(q_h) - 1] + arrV[arrV.indexOf(q_v) - 1]}`
        ]
    }
  }
