import { INote, IRhythm, NoteType, Tempo } from './musicData';

export function determineRhythm(bars: INote[][], tempo: Tempo): IRhythm {
    const rhythm: IRhythm = {
        beatSeparation: [],
        startWithRest: bars[0][0].type === NoteType.Rest,
    };

    const tickDuration = determineTickDuration(tempo);
    let currentWait = 0;

    for (const bar of bars) {
        for (const note of bar) {
            const noteDuration = note.length * tickDuration;

            if (note.type === NoteType.Rest) {
                currentWait += noteDuration;
            }
            else {
                if (currentWait > 0) {
                    rhythm.beatSeparation.push(currentWait);
                }
                currentWait = noteDuration;
            }
        }
    }
    
    if (currentWait > 0) {
        rhythm.beatSeparation.push(currentWait);
    }

    return rhythm;
}

function determineTickDuration(tempo: Tempo) {
    const noteLength = tempo[0];
    const perMinute = tempo[1];

    const oneMinute = 60000;
    const noteDuration = oneMinute / perMinute;
    const tickDuration = noteDuration / noteLength;

    return tickDuration;
}