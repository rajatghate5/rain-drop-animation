import React, { useEffect, useState, useCallback } from 'react';
import chroma from 'chroma-js';
import './App.css';

const GRID_ROWS = 15;
const GRID_COLS = 20;

const DROP_LENGTH = 4; // Length of each raindrop
const OPACITIES = [1, 0.8, 0.6, 0.4]; // Reversed opacities for the raindrop
const MIN_DROPS = 10; // Minimum number of drops to be present

const generateDrop = () => ({
  id: Math.random(),
  col: Math.floor(Math.random() * GRID_COLS),
  row: 0,
  color: chroma.random().hex(),
});

const App = () => {
  const [rainDrops, setRainDrops] = useState([]);

  const addDrop = useCallback(() => {
    setRainDrops(prevDrops => {
      const activeDrops = prevDrops.filter(drop => drop.row < GRID_ROWS + DROP_LENGTH - 1);
      if (activeDrops.length < MIN_DROPS) {
        return [...activeDrops, generateDrop()];
      }
      return activeDrops;
    });
  }, []);

  useEffect(() => {
    const addDropInterval = setInterval(addDrop, 500); // Interval for new raindrops
    return () => clearInterval(addDropInterval);
  }, [addDrop]);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setRainDrops(prevDrops => {
        const updatedDrops = prevDrops.map(drop => ({ ...drop, row: drop.row + 1 }));
        if (updatedDrops.length < MIN_DROPS) {
          updatedDrops.push(generateDrop());
        }
        return updatedDrops;
      });
    }, 200); // Speed of falling raindrops

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <div className="app">
      <div className="grid">
        {Array.from({ length: GRID_ROWS }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {Array.from({ length: GRID_COLS }).map((_, colIndex) => {
              const drop = rainDrops.find(
                drop => drop.col === colIndex && rowIndex >= drop.row && rowIndex < drop.row + DROP_LENGTH
              );
              const opacityIndex = rowIndex - (drop ? drop.row : 0);
              const opacity = drop ? OPACITIES[DROP_LENGTH - 1 - opacityIndex] : 1;

              return (
                <div
                  key={colIndex}
                  className="grid-cell"
                  style={{
                    backgroundColor: drop ? drop.color : 'transparent',
                    opacity,                    
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
