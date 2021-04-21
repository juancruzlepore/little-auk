import './App.css';
import React, { Component, useState } from 'react';
import { animated, Spring } from 'react-spring';

class Routine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workouts: [
        { name: 'pull up' },
        { name: 'push up' },
        { name: 'dip' },
      ]
    }
  }

  render() {
    return (
      <div className="">
        <h1 className="page-title">Routine</h1>
        <div className="workout-list">
          {this.state.workouts.map(w => (
            <div key={w.name} className="workout-elem-container workout-elem-base">
              <Workout name={w.name} goal={4} />
            </div>
          ))}

        </div>
      </div>
    );
  }

}

function Workout(props) {
  const [counter, setCounter] = useState(0);

  const increaseCounter = () => {
    setCounter(counter + 1);
  }

  return (
    <div>
      <div className='workout-elem-background workout-elem-base flex justify-center inline-block' />
      <Spring native
        from={{ inset: "inset(0 " + Math.round(100 - ((counter - 1) * 100 / props.goal)) + "% 0 0)" }}
        to={{ inset: "inset(0 " + Math.round(100 - (counter * 100 / props.goal)) + "% 0 0)" }}
      >
        {({ inset }) => {
          return (
            <animated.div className='workout-elem workout-elem-base flex justify-center inline-block' style={{
              clipPath: inset
            }}></animated.div>
          );
        }}

      </Spring>
      <div className='workout-text workout-elem-base flex justify-center inline-block'>
        <p className="inline-block align-bottom mb-auto mt-auto font-semibold" onClick={() => increaseCounter()}>
          {props.name}: {counter}/{props.goal}
        </p>
      </div>
    </div>
  )
}


function App() {
  return (
    <div className="flex justify-center">
      <Routine />
    </div>
  );
}

export default App;
