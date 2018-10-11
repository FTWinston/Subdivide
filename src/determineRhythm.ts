import { IMusic, IRhythm, NoteDuration, NoteType } from './musicData';

export function determineRhythm(data: IMusic): IRhythm {
    const rhythm: IRhythm = {
        beatSeparation: [],
        startWithRest: data.bars[0][0].type === NoteType.Rest,
    };

    const tickDuration = determineTickDuration(data.tempo[0], data.tempo[1]);
    let currentWait = 0;

    for (const bar of data.bars) {
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

    return rhythm;
}

function determineTickDuration(note: NoteDuration, perMinute: number) {
    const oneMinute = 60000;
    const noteDuration = oneMinute / perMinute;
    const tickDuration = noteDuration / note;
    return tickDuration;
}