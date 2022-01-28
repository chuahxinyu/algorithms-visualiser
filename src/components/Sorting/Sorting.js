import { breakpoints, cols, layouts, sortingColoursMap } from '../../constants';
import React, { useState, useEffect } from 'react';
import Card from '../Card';
import { Responsive, WidthProvider } from "react-grid-layout";
import SortingVisual from './SortingVisual';
import InsertionSort from './Algorithms/InsertionSort'
import Quicksort from './Algorithms/Quicksort';
import SelectionSort from './Algorithms/SelectionSort'

const ResponsiveGridLayout = WidthProvider(Responsive);

function useSlider (min, max, defaultValue, step, value, setValue) {
  function handleChange(e) {
    setValue(e.target.value);
  }

  const props = {
    type: 'range',
    min,
    max,
    step: step,
    value: value,
    onChange: handleChange
  };

  return props;
}

export default function Sorting() {
  // States
  const [alg, setAlg] = useState("Insertion Sort")
  const [len, setLen] = useState(10)
  const [bars, setBars] = useState([])
  const [speed, setSpeed] = useState(50)
  const [compare, setCompare] = useState([])
  const [swap, setSwap] = useState([])
  const [sortedIndexes, setSortedIndex] = useState([])
  const [animPlaying, setAnimPlaying] = useState(false)

  /* Generates new shuffled array and resets compare, swap and sortedIndexes 
      arrays.
  */
  function generateShuffledArray(length) {
    setCompare([])
    setSwap([])
    setSortedIndex([])

    // Creates array [1 ... len]
    // let randomArray = Array(length).fill(null).map((_, i) => i+1);
    // [0, 1, 2, 3, 4, 5]
    let randomArray = Array(length).fill(1);
    console.log(`  1 array: ${randomArray}`)
    for (let k = 0; k < length; k++) {
      randomArray[k] = k+1;
    //   console.log(`    len: ${len} | k: ${k}| ${randomArray}`)
    }
    console.log(`  ${randomArray}`)

    // Shuffle the array
    randomArray.sort(() => Math.random() - 0.5);

    console.log(`  randomArray: ${randomArray} | len: ${length}`)
    return randomArray
  }

  // SECTION Animating and Steps
  /* When 'Start Sorting' is clicked, calls appropriate sorting function,
      which returns an animation order array, `order`, containing:
          - j and k: 
          - bars: array of bar values
          - index: 
  */
  function handleSubmit(event) {
    const sleep = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    const animateAccOrder = async (steps) => {
      console.log(`ANIMATE ORDER STEPS: ${JSON.stringify(steps)}`)
      setAnimPlaying(true)
      for (let i = 0; i < steps.length; i++) {
        const [j, k, bars, index] = steps[i]
        setCompare([j, k])
        setSwap([])

        // add sorted index to srted index array
        if (index !== null) {
          setSortedIndex((prevState) => [...prevState, index])
        }

        // draw the bars
        if (bars) {
          setBars(bars)
          // animate swapping
          if (j !== null || k !== null) {
              setSwap([j, k])
          }
        }
        await sleep(speed)
      }
      setAnimPlaying(false)
    }

    event.preventDefault()
    // using .slice() to pass in a copy of `bars`
    if (alg === "Insertion Sort") {
      animateAccOrder(InsertionSort(bars.slice()))
      
    } else if (alg === "Selection Sort") {
      animateAccOrder(SelectionSort(bars.slice()))
    } else if (alg === "Quicksort") {
      animateAccOrder(Quicksort(bars.slice()))
    }
  }

  function prevStep() {

  }

  function nextStep() {

  }

  /* Generate random array every time the length or algorithm is changed
  */
  useEffect(() => {
    console.log(`useEffect`)
    setBars([...generateShuffledArray(len)])
  }, [len, alg])

  return (
    <div>
      <div className='title'>SORTING</div>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        draggableHandle='.card-drag-handle'
      >
        <div key='input'>
          <Card colour='orange' header='input'/>
        </div>
        <div key='cases'>
          <Card colour='red' header='cases'/>
        </div>
        <div key='controls'>
          <Card
            colour='pink'
            header='controls'
            child={
              <div className='controls-container'>
                <button onClick={prevStep}>prev</button>
                {}
                <button onClick={nextStep}>next</button>
                <button onClick={handleSubmit}>play</button>
                <button onClick={() => setBars([...generateShuffledArray(len)])}>generate</button>
                <input
                  type='range'
                  min={3}
                  max={40}
                  step={1}
                  value={len}
                  onChange={e => setLen(e.target.value)}
                ></input>
                <select onChange={e => setAlg(e.target.value)}>
                  <option value='Insertion Sort'>Insertion Sort</option>
                  <option value='Quicksort'>Quicksort</option>
                  <option value='Selection Sort'>Selection Sort</option>
                </select>
              </div>
            }
          />
        </div>
        <div key='visualisation' data-name='visualisation' id='visualisation'>
          <Card
            colour='purple'
            header='visualisation' 
            child={ 
            <SortingVisual
              bars={bars}
              compare={compare}
              swap={swap}
              sorted={sortedIndexes}
              coloursMap={sortingColoursMap}
            />
          }/>
        </div>
        <div key='explanation'>
          <Card colour='mint' header='explanation'/>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}