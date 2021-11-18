/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import './index.css';
import Score from './Score.jsx';
import Blue from './images/Blue.png';
import Green from './images/Green.png';
import Pink from './images/Pink.png';
import Red from './images/Red.png';
import Salat from './images/Salat.png';
import Turkis from './images/Turkis.png';
import Blanck from './images/Blanck.png';


const colors = [Green, Red, Turkis, Blue, Pink, Salat, Blanck];

const App = () => {

  const [scores, setScores] = useState(0);

  const [currentColorArr, setCurrentColorArr] = useState([]);

  const [draggedItem, setDraggedItem] = useState(null);

  const [replacedItem, setReplacedItem] = useState(null);

  const makeTable = () => {
    const randomColorArr = [];
    for(let i = 0; i < 36; i += 1) {
      randomColorArr.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    setCurrentColorArr(randomColorArr);
  };

  const checkForRowOfFour = () => {
    const excludes = [3, 4, 5, 9, 10, 11, 15, 16, 17, 21, 22, 23, 27,28, 29]
    for (let i = 0; i < 33; i += 1) {
      if (excludes.includes(i)) continue;
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArr[i];
      if (rowOfFour.every((i) => currentColorArr[i] === decidedColor && currentColorArr[i] !== Blanck)) {
        rowOfFour.forEach((i) => currentColorArr[i] = Blanck);
        setScores(scores + 4);
        return true;
      }
    }
  }

  const checkForColumnOfFour = () => {
    for (let i = 0; i < 18; i += 1) {
      const columnOfThree = [i, i + 6, i + 12, i + 18];
      const decidedColor = currentColorArr[i];
      if (columnOfThree.every((i) => currentColorArr[i] === decidedColor && currentColorArr[i] !== Blanck)) {
        columnOfThree.forEach((i) => currentColorArr[i] = Blanck)
        setScores(scores + 4);
        return true;
      }
    }
  }

  const checkForRowOfThree = () => {
    const excludes = [4, 5, 10, 11, 16, 17, 22, 23, 28, 29]
    for (let i = 0; i < 34; i += 1) {
      if (excludes.includes(i)) continue;
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArr[i];
      if (rowOfThree.every((i) => currentColorArr[i] === decidedColor && currentColorArr[i] !== Blanck)) {
        rowOfThree.forEach((i) => currentColorArr[i] = Blanck)
        setScores(scores + 3);
        return true;
      }
    }
  }

  const checkForColumnOfThree = () => {
    for (let i = 0; i < 24; i += 1) {
      const columnOfThree = [i, i + 6, i + 12];
      const decidedColor = currentColorArr[i];
      if (columnOfThree.every((i) => currentColorArr[i] === decidedColor && currentColorArr[i] !== Blanck)) {
        columnOfThree.forEach((i) => currentColorArr[i] = Blanck)
        setScores(scores + 3);
        return true;
      }
    }
  }

  const fallDown = () => {
    for (let i = 0; i < 30; i += 1) {
      const firstRow = [0, 1, 2, 3, 4, 5];
      const isFirstRow = firstRow.includes(i);
      if(isFirstRow && currentColorArr[i] === Blanck) {
        currentColorArr[i] = colors[Math.floor(Math.random() * colors.length)];
      }
      if (currentColorArr[i + 6] === Blanck) {
        currentColorArr[i + 6] = currentColorArr[i];
        currentColorArr[i] = Blanck;
      }
    }
  }

  useEffect(() => {
    makeTable();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      fallDown();
      setCurrentColorArr([...currentColorArr]);
    }, 100);
    return () => clearInterval(timer);
  }, [currentColorArr, checkForRowOfFour, checkForColumnOfFour, checkForRowOfThree, checkForColumnOfThree, fallDown]);

  const dragStart = (e) => {
    setDraggedItem(e.target);
  };

  const drop = (e) => {
    setReplacedItem(e.target);
  };

  const dragEnd = (e) => {
    const idDragged = parseInt(draggedItem.getAttribute('data-id'), 10);
    const idReplaced = parseInt(replacedItem.getAttribute('data-id'), 10);
    currentColorArr[idDragged] = replacedItem.getAttribute('src');
    currentColorArr[idReplaced] = draggedItem.getAttribute('src');

    const validMoves = [
      idDragged - 1,
      idDragged + 1,
      idDragged - 6,
      idDragged + 6,
    ]

    const validMove = validMoves.includes(idReplaced);

    const isAColumnOfFour = checkForColumnOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfFour = checkForRowOfFour();
    const isARowOfThree = checkForRowOfThree();

    if (idReplaced && validMove && (isAColumnOfFour || isAColumnOfThree || isARowOfFour || isARowOfThree)) {
      setDraggedItem(null);
      setReplacedItem(null);
    } else {
      currentColorArr[idReplaced] = replacedItem.getAttribute('src');
      currentColorArr[idDragged] = draggedItem.getAttribute('src');
      setCurrentColorArr([...currentColorArr])
    }
  };

  return (
    <>
    <div className='container'>
      {currentColorArr.map((color, index) => (
        <img
          src={color}
          alt={color}  
          draggable={true}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()} 
          onDragLeave={(e) => e.preventDefault()}
          onDragStart={dragStart}
          onDragEnd={dragEnd}
          onDrop={drop}
          data-id={index} 
          key={index} 
          />
      ))}
    </div>
    <Score scores={scores} />
    </>
  );
}

export default App;
