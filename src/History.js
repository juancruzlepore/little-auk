
import React from 'react';
import { useSpring, animated } from 'react-spring';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { DateUtils, toWeekDay } from './DateUtils';

export function History({days}) {

    const weekHistory = {}
    for (let i = 0; i < 7; i++) {
        weekHistory[i] = undefined
    }

    for (let entry of days) {
        weekHistory[entry.day] = entry
    }

    return (
        <div className='one-week-history flex flex-row space-x-2 p-3 bg-gray-50'>
            {Object.entries(weekHistory).map(([day, info]) => (
                <div key={day}>
                    <SingleDayStatus day={day} done={info?.done ?? 0} goal={info?.goal ?? 1} />
                </div>
            ))}
        </div>
    )
}

function SingleDayStatus(props) {

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    // let today = new Date();
    // let todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const percentage = props.done / props.goal * 100;
    const weekDay = props.day;
    const radius = 80;

    const completeColor = "rgb(149, 241, 187, 1)"
    const incompleteProgressBarColor = "rgb(57, 119, 160, 1)"
    const incompleteCircleBackgroundColor = "rgb(211, 211, 211, 1)"

    const progressBarColor = percentage < 100 ? incompleteProgressBarColor : completeColor
    const circleBackgroundColor = percentage < 100 ? incompleteCircleBackgroundColor : completeColor

    props = useSpring({ progressBarColor: progressBarColor, circleBackgroundColor: circleBackgroundColor })

    if (progressBarColor !== String(props.progressBarColor.get())) {
        setTimeout(() => (async () => forceUpdate())().then(), 40);
    }

    return (
        <div>
            <animated.div style={{ height: radius, width: radius }}>
                <CircularProgressbarWithChildren value={percentage} text={""} styles={{
                    path: { stroke: props.progressBarColor.get() },
                }}>
                    <div className="font-bold text-gray-700 rounded-full flex items-center justify-center font-mono single-day-status" style={{
                        backgroundColor: props.circleBackgroundColor.get()
                    }}>
                        {DateUtils.currentWeekDay === weekDay ? "TODAY" : (toWeekDay[weekDay])}
                    </div>
                </CircularProgressbarWithChildren>
            </animated.div>
        </div>

    )
}