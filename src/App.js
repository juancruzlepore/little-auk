import './App.css';
import React, { useState } from 'react';
import { animated, Spring } from 'react-spring';
import HTTPService from './services/HTTPSService'
import { Routine as RoutineClass, ScheduleType, WeeklySchedule } from './services/RoutinesService'
import 'react-circular-progressbar/dist/styles.css';
import { History } from './History'
import { DateUtils, WeekDay } from './DateUtils'
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

const testRoutines = [
  {
    name: "Workout",
    schedule: {
      scheduleType: ScheduleType.WEEKLY,
      dayHints: [WeekDay.MON, WeekDay.WED, WeekDay.FRI]
    },
    days: [
      {
        name: "Mixed",
        goal: 3,
        workouts: [
          { name: 'pull up', goal: 4 },
          { name: 'push up', goal: 4 },
          { name: 'dip', goal: 4 },
        ]
      },
      {
        name: "Abs",
        goal: 2,
        workouts: [
          { name: 'sit up', goal: 4 },
          { name: 'legs lift', goal: 4 },
        ]
      }
    ],
    history: [
      {
        day: WeekDay.MON,
        workoutsName: "Mixed",
        workouts: [
          { name: 'pull up', goal: 4, done: 0 },
          { name: 'push up', goal: 4, done: 1 },
          { name: 'dip', goal: 4, done: 1 },
        ],
      },
      {
        day: WeekDay.WED,
        workoutsName: "Mixed",
        workouts: [
          { name: 'pull up', goal: 4, done: 4 },
          { name: 'push up', goal: 4, done: 4 },
          { name: 'dip', goal: 4, done: 4 },
        ],
      },
      {
        day: WeekDay.FRI,
        workoutsName: "Abs",
        workouts: [
          { name: 'sit up', goal: 4, done: 3 },
          { name: 'legs lift', goal: 4, done: 2 },
        ],
      },
    ]
  }
]


function App() {
  return (
    <div className="flex justify-center">
      {testRoutines.map(routine =>
        <Routine key={routine.name} routine={routine} />
      )}
    </div>
  );
}

function Routine({ routine }) {

  const [history, setHistory] = useState(routine.history)

  const selectedRoutineDay = routine.days[0]
  const curWeekDay = DateUtils.currentWeekDay()
  const todayProgress = history.filter(d => d.day === curWeekDay)

  const todayProgressForCurrentRoutineDay = todayProgress.find(d => d.workoutsName === selectedRoutineDay.name)?.workouts

  const progress = {}

  for (const e of selectedRoutineDay.workouts) {
    progress[e.name] = { goal: e.goal, done: 0 }
  }
  if (todayProgressForCurrentRoutineDay) {
    for (const e of todayProgressForCurrentRoutineDay) {
      progress[e.name] = { goal: e.goal, done: e.done }
    }
  }


  const updateHistory = (name, done) => {
    let curProgress = todayProgressForCurrentRoutineDay
    const goal = selectedRoutineDay.workouts.find(e => e.name === name).goal
    const workoutsName = selectedRoutineDay.name
    const newEntry = { name: name, goal: goal, done: done }
    const updateProgress = (progress) => {
      const index = progress.findIndex(e => e.name === name)
      if (index !== -1) {
        progress[index] = newEntry
      } else {
        progress.push(newEntry)
      }
      return progress
    }
    if (curProgress) {
      const newProgress = updateProgress(curProgress)
      const historyIndex = history.findIndex(e => e.workoutsName === workoutsName && e.day === curWeekDay)
      history[historyIndex].workouts = newProgress
    } else {
      const emptyProgress = selectedRoutineDay.workouts.map(e => ({ ...e, done: 0 }))
      const newProgress = updateProgress(emptyProgress)
      history.push({
        day: curWeekDay,
        workoutsName: workoutsName,
        workouts: newProgress,
      })
    }
    setHistory([...history])
  }

  return (
    <div>
      <div className="select-none" style={{ width: '100%' }}>
        <h1 className="page-title text-center">{routine.name.toUpperCase()}</h1>
        <RoutineDaySelector name={selectedRoutineDay.name}/>
        <RoutineDay progress={progress} updateHistory={updateHistory}></RoutineDay>
      </div>
      <History days={
        Object.values(history).map(d => ({
          day: d.day,
          name: d.workoutsName,
          goal: Object.values(d.workouts).map(w => w.goal).reduce((accu, cur) => accu + cur),
          done: Object.values(d.workouts).map(w => w.done).reduce((accu, cur) => accu + cur)
        }))
      } />
    </div>
  )
}

function RoutineDaySelector({name}) {
  
  return (
    <div>
      <BsArrowLeftShort className="fill-current text-green-600"/>
      <h2 className="page-title text-center">{name.toUpperCase()}</h2>
      <BsArrowRightShort/>
    </div>
  )
}

function RoutineDay({ progress, updateHistory }) {

  const [workouts, setProgress] = useState(progress);

  let updateWorkout = (name, done) => {
    workouts[name].done = done
    setProgress({ ...workouts });
    updateHistory(name, done)
  }

  return (

    <div className="flex flex-row">
      <div className="filler flex-grow" />
      <div className="flex-grow-0 workout-list w-screen max-w-xl">
        {Object.entries(workouts).map(([name, p]) => (
          <div key={name} className="workout-elem-container workout-elem-base">
            <Workout name={name} goal={p.goal} progress={p.done} updateWorkout={updateWorkout} />
          </div>
        ))}
      </div>
      <div className="filler flex-grow" />
    </div>
  );

}

function Workout({ name, goal, progress, updateWorkout }) {
  const [counter, setCounter] = useState(progress);

  const increaseCounter = () => {
    const newCounter = Math.min(counter + 1, goal)
    setCounter(newCounter);
    updateWorkout(name, newCounter);
  }

  return (
    <div onClick={() => increaseCounter()}>
      <div className='workout-elem-background workout-elem-base flex justify-center inline-block' />
      <Spring native
        from={{
          inset: "inset(0 " + Math.round(100 - ((counter - 1) * 100 / goal)) + "% 0 0)",
          color: counter - 1 < goal ? "rgb(57, 119, 160)" : "rgb(149, 241, 187)"
        }}
        to={{
          inset: "inset(0 " + Math.round(100 - (counter * 100 / goal)) + "% 0 0)",
          color: counter < goal ? "rgb(57, 119, 160)" : "rgb(149, 241, 187)"
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
          {name.toUpperCase()}: {Math.min(counter, goal)}/{goal}
        </p>
      </div>
    </div>
  )
}

export default App;
