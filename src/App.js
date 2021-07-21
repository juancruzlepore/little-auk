import './App.css';
import React, { Component, useState } from 'react';
import { animated, Spring } from 'react-spring';
import HTTPService from './services/HTTPSService'
import { Routine as RoutineClass, ScheduleType } from './services/RoutinesService'

const testRoutines = [
  RoutineClass(
    1,
    ScheduleType.WEEKLY,
    1,
    {
      workouts: [
        { name: 'pull up', goal: 4},
        { name: 'push up', goal: 4 },
        { name: 'dip', goal: 4 },
      ]
    })
]

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

  componentDidMount() {
    HTTPService.getRoutines();
    console.log("running?")
  }

  render() {
    return (
      <div className="select-none" style={{ width: '100%' }}>
        <h1 className="page-title text-center">ROUTINE</h1>
        <div className="flex flex-row">
          <div className="filler flex-grow" />
          <div className="flex-grow-0 workout-list w-screen max-w-xl">
            {this.state.workouts.map(w => (
              <div key={w.name} className="workout-elem-container workout-elem-base">
                <Workout name={w.name} goal={4} />
              </div>
            ))}
          </div>
          <div className="filler flex-grow" />
        </div>
      </div>
    );
  }

}

function Workout(props) {
  const [counter, setCounter] = useState(0);

  const increaseCounter = () => {
    // setCounter(Math.min(counter + 1, props.goal));
    setCounter(counter + 1);
  }

  return (
    <div onClick={() => increaseCounter()}>
      <div className='workout-elem-background workout-elem-base flex justify-center inline-block' />
      <Spring native
        from={{
          inset: "inset(0 " + Math.round(100 - ((counter - 1) * 100 / props.goal)) + "% 0 0)",
          color: counter - 1 < props.goal ? "rgb(57, 119, 160)" : "rgb(149, 241, 187)"
        }}
        to={{
          inset: "inset(0 " + Math.round(100 - (counter * 100 / props.goal)) + "% 0 0)",
          color: counter < props.goal ? "rgb(57, 119, 160)" : "rgb(149, 241, 187)"
        }}
      >
        {({ inset, color }) => {
          return (
            <animated.div className='workout-elem workout-elem-base flex justify-center inline-block' style={{
              clipPath: inset, 'backgroundColor': color
            }}></animated.div>
          );
        }}

      </Spring>
      <div className='workout-text workout-elem-base flex justify-center inline-block'>
        <p className="inline-block align-bottom mb-auto mt-auto font-semibold">
          {props.name.toUpperCase()}: {Math.min(counter, props.goal)}/{props.goal}
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
