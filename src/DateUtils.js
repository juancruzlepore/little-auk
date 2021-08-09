export const WeekDay = {
    MON: 0,
    TUE: 1,
    WED: 2,
    THU: 3,
    FRI: 4,
    SAT: 5,
    SUN: 6,
}

export const toWeekDay = {
    0: "MON",
    1: "TUE",
    2: "WED",
    3: "THU",
    4: "FRI",
    5: "SAT",
    6: "SUN",
}

export class DateUtils {

    // Returns today's weekday (from WeekDay enum)
    static currentWeekDay() {
        return ((new Date()).getDay() + 6) % 7
    }

    static today() { return new Date(); }

    static todayWithoutTime() {
        const today = this.today()
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }

}