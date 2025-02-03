import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function AIBoardGame() {
  // [Previous state declarations remain the same...]
  const BOARD_ROWS = 4;
  const BOARD_COLUMNS = 10;
  const TOTAL_SQUARES = BOARD_ROWS * BOARD_COLUMNS;
  
  const [players, setPlayers] = useState([
    { id: 1, position: 0, color: '#3B82F6' },
    { id: 2, position: 0, color: '#EF4444' }
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const [diceRolled, setDiceRolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [gameCards] = useState([
    // התנהגויות ראויות - קידום
    { type: 'positive', text: 'בדקת את מקור המידע', action: 'התקדם 2 צעדים', steps: 2 },
    { type: 'positive', text: 'הפעלת חשיבה ביקורתית ושאלת שאלות', action: 'התקדם 2 צעדים', steps: 2 },
    { type: 'positive', text: 'ערכת השוואה של המידע ממספר מקורות', action: 'התקדם 3 צעדים', steps: 3 },
    { type: 'positive', text: 'קיבלת החלטות רק לאחר בדיקת מידע', action: 'התקדם 2 צעדים', steps: 2 },
    { type: 'positive', text: 'מחלק את זמנך בין חברים למפגש וירטואלי', action: 'התקדם 2 צעדים', steps: 2 },
    { type: 'positive', text: 'בדקת שהפרטים שאתה מוסר לא יזהו אותך', action: 'התקדם 2 צעדים', steps: 2 },
    
    // התנהגויות לא ראויות - נסיגה
    { type: 'negative', text: 'התייחסת למידע כאל עובדה מוחלטת', action: 'חזור 2 צעדים אחורה', steps: -2 },
    { type: 'negative', text: 'נחשפת לתוכן פוגעני ולא סיפרת לאף אחד', action: 'חזור 3 צעדים אחורה', steps: -3 },
    { type: 'negative', text: 'הפצת מידע שקרי למרות שידעת שהוא לא נכון', action: 'חזור 3 צעדים אחורה', steps: -3 },
    { type: 'negative', text: 'קיבלת את דברי הבינה המלאכותית מבלי לבדוק', action: 'חזור 2 צעדים אחורה', steps: -2 },
    { type: 'negative', text: 'בילית שעות רבות במחשב על חשבון מפגש עם חברים', action: 'חזור צעד אחורה', steps: -1 },
    { type: 'negative', text: 'פרסמת את הסיסמא שלך ופרטייך האישיים', action: 'חזור 3 צעדים אחורה', steps: -3 }
  ]);

  // [Previous functions remain the same...]
  const movePlayer = (steps) => {
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      const newPosition = Math.min(
        Math.max(0, newPlayers[currentPlayerIndex].position + steps),
        TOTAL_SQUARES - 1
      );
      newPlayers[currentPlayerIndex].position = newPosition;
      
      if (newPosition === TOTAL_SQUARES - 1) {
        alert(`שחקן ${currentPlayerIndex + 1} ניצח!`);
      }
      return newPlayers;
    });
  };

  const rollDice = () => {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    movePlayer(diceRoll);
    setDiceRolled(true);
  };

  const drawCard = () => {
    if (!diceRolled) return;
    const randomCard = gameCards[Math.floor(Math.random() * gameCards.length)];
    setCurrentCard(randomCard);
  };

  const executeCardAction = () => {
    if (currentCard) {
      movePlayer(currentCard.steps);
      setCurrentCard(null);
      setDiceRolled(false);
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }
  };

  const renderGameBoard = () => {
    const board = [];
    for (let row = 0; row < BOARD_ROWS; row++) {
      const rowSquares = [];
      for (let col = 0; col < BOARD_COLUMNS; col++) {
        const index = row % 2 === 0 
          ? row * BOARD_COLUMNS + col 
          : (row + 1) * BOARD_COLUMNS - (col + 1);
        
        const playersHere = players.filter(p => p.position === index);
        
        rowSquares.push(
          <div 
            key={index} 
            className={`${isMobile ? 'w-8 h-8' : 'w-16 h-16'} border flex items-center justify-center relative ${
              index % 5 === 0 ? 'bg-green-200' : 'bg-white'
            }`}
          >
            <span className={`${isMobile ? 'text-xs' : 'text-base'}`}>
              {index}
            </span>
            {playersHere.map((player, i) => (
              <div
                key={player.id}
                className={`absolute ${isMobile ? 'w-3 h-3' : 'w-4 h-4'} rounded-full`}
                style={{
                  backgroundColor: player.color,
                  top: isMobile ? `${(i * 12) + 2}px` : `${(i * 20) + 5}px`,
                  right: isMobile ? '2px' : '5px'
                }}
              />
            ))}
          </div>
        );
      }
      board.push(
        <div key={row} className="flex">
          {rowSquares}
        </div>
      );
    }
    return board;
  };

  const renderCard = () => {
    if (!currentCard) return null;
    
    const isPositive = currentCard.type === 'positive';
    
    return (
      <div className={`mt-2 md:mt-4 p-4 md:p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 ${
        isPositive ? 'bg-gradient-to-br from-green-100 to-green-200' : 'bg-gradient-to-br from-red-100 to-red-200'
      }`}>
        <div className="flex items-center justify-center mb-2">
          {isPositive ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : (
            <AlertCircle className="w-8 h-8 text-red-600" />
          )}
        </div>
        <h3 className={`text-lg md:text-xl font-bold mb-2 ${
          isPositive ? 'text-green-800' : 'text-red-800'
        }`}>
          {currentCard.text}
        </h3>
        <p className={`text-base md:text-lg font-semibold ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {currentCard.action}
        </p>
      </div>
    );
  };

  return (
    <div className="p-2 md:p-4 bg-blue-100 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold text-center mb-2 md:mb-4">
        עצור! בינה מלאכותית
      </h1>
      <div className="text-center mb-2 md:mb-4" style={{ color: players[currentPlayerIndex].color }}>
        תור שחקן {currentPlayerIndex + 1}
      </div>
      <div className="flex justify-center mb-2 md:mb-4">
        <div className="flex flex-col">
          {renderGameBoard()}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 md:space-x-4">
        <button 
          onClick={rollDice}
          disabled={diceRolled}
          className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${
            diceRolled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors duration-200`}
        >
          הטל קובייה
        </button>
        <button 
          onClick={drawCard}
          disabled={!diceRolled || currentCard}
          className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${
            !diceRolled || currentCard ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          } text-white transition-colors duration-200`}
        >
          משוך קלף
        </button>
        {currentCard && (
          <button 
            onClick={executeCardAction}
            className="px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base bg-yellow-500 hover:bg-yellow-600 text-white transition-colors duration-200"
          >
            בצע פעולת קלף
          </button>
        )}
      </div>
      <div className="text-center mt-2 md:mt-4 text-sm md:text-base">
        {players.map(player => (
          <p key={player.id} style={{ color: player.color }}>
            שחקן {player.id}: משבצת {player.position}
          </p>
        ))}
        {renderCard()}
      </div>
    </div>
  );
}
