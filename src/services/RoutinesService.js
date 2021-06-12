import HTTPService from './HTTPSService'

class RoutineService {
    
    static async getRoutines() {
        const routinesEntries = await HTTPService.getRoutines();
        const routines = {};
        routinesEntries.array.forEach(element => {
            if(!element.id in routines) {
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

class Routine {
    id
    series
}
