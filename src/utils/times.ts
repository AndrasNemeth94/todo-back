import moment from 'moment';
import { unitOfTime } from 'moment';
import momenttimezone from 'moment-timezone';
import { TimezonesEUR } from '../models/enums/timezonesEUR.enum';

export function getCurrentDate() {
    const currentTime = moment().format('LTS');
    const date = moment().format('l');
    return date + " time: " + currentTime;
}

export async function momentTimeDiff(startTime: string, endTime: string, timezone: TimezonesEUR, timeIn?: unitOfTime.Diff): Promise<number> {
    if(timeIn === null) {
        timeIn = 'milliseconds'
    }
    console.log('Times utils momentTimeDiff, startTime: ', startTime, ', endTime: ', endTime, ', timezone: ', TimezonesEUR[timezone]);
    const current = momenttimezone.tz(timezone).format('MMMM Do YYYY, h:mm:ss');
    const currentToMoment = moment(current, 'MMMM Do YYYY, h:mm:ss');

    // const future = "September 27th 2022, 12:38:47 pm";
    const futureMoment = moment(endTime, 'MMMM Do YYYY, h:mm:ss');

    console.log('MOMENT TEST currentToMoment: ', currentToMoment, ', converted: ', futureMoment);
    const diff = futureMoment.diff(currentToMoment, timeIn);

    console.log('Diff: ', diff);
    return diff;
}