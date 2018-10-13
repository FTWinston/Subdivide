import { INote, NoteType, Rhythm, Tempo } from './musicData';

export function determineRhythm(bars: INote[][], tempo: Tempo, initialDelayMs: number = 0): Rhythm {
    const rhythm: Rhythm = [];

    const tickDuration = determineTickDuration(tempo);
    let currentWait = initialDelayMs;

    for (const bar of bars) {
        for (const note of bar) {
            const noteDuration = note.length * tickDuration;

            if (note.type === NoteType.Rest) {
                currentWait += noteDuration;
            }
            else {
                rhythm.push(currentWait);
                currentWait = noteDuration;
            }
        }
    }
    
    if (currentWait > 0) {
        rhythm.push(currentWait);
    }

    return rhythm;
}

export function determineTickDuration(tempo: Tempo) {
    const noteLength = tempo[0];
    const perMinute = tempo[1];

    const oneMinute = 60000;
    const noteDuration = oneMinute / perMinute;
    const tickDuration = noteDuration / noteLength;

    return tickDuration;
}