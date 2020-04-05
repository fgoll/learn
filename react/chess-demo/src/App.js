import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

let chessMap = {
  '1': 'x',
  '-1': 'o'
}

function Cell(props) {
  return (
    <div className='cell' onClick={props.onClick}>
      {chessMap[props.val]}
    </div>
  )
}


function Chessboard() {
  const [chesses, setChesses] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ])

  const [n, setN] = useState(0)

  const [finished, setFinish] = useState(false)

  function judge(chesses, row, col) {
    let rowSum = 0, colSum = 0
    for (let i = 0; i < 3; i ++) {
      rowSum += chesses[row][i]
      colSum += chesses[i][col]
    }
    
    if (rowSum === 3 || colSum === 3) {
      console.log(chesses[row][col],'赢了') 
      setFinish(true)
      return
    }
    if(row === col) {
      let sum = 0
      for (let i = 0; i < 3; i ++) {
        sum += chesses[i][i]
      }
      if (sum === 3) {
        console.log(chesses[row][col],'赢了') 
        setFinish(true)
        return
      }
    }

    if (row + col === 2) {
      let sum = 0
      for (let i = 0; i < 3; i ++) {
        sum += chesses[2-i][i]
      }
      if (sum === 3) {
        console.log(chesses[row][col],'赢了') 
        setFinish(true)
        return
      }
    }

  }

  function onClickCell(row, col) {
    setN(n+1)
    let copy = [...chesses]
    copy[row][col] = n % 2 ? -1 : 1
    setChesses(copy)
    judge(copy, row, col)

  }
  return (
    <div>
      <div className='chessboard'>
        {chesses.map((items, row) => {
          return (
            <div className='row'>
              {items.map((item, col) => {
                return <Cell val={item} onClick={() => onClickCell(row, col)}/>
              })}
            </div>    
            
          )
        })}
      </div>
      {finished && (<div className='over'>游戏结束</div>)}
    </div>
    
  )
}

function App() {
  return (
    <div className="App">
      <Chessboard />
    
    </div>
  );
}

export default App;
