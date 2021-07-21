import HTTPService from './HTTPSService'

class RoutineService {
    
    static async getRoutines() {
        const routinesEntries = await HTTPService.getRoutines();
        const routines = {};
        routinesEntries.array.forEach(element => {
            if(!(element.id in routines)) {
                routines[element.id] = []
            }
            routines[element.id].push({
                exerciseId: element.exerciseId,
                goal: element.goal
            });
        });
        return routines;
    }
}

export class Routine {
    id
    scheduleType
    scheduleId
    series
}

export const ScheduleType = {
	DAILY: "daily",
	WEEKLY: "weekly",
    MONTHLY: "monthly"
}

export class WeeklySchedule {
    minOccurrences
    daysOfWeekHints
}

export class MonthlySchedule {
    minOccurrences
}
