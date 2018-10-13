import { Rhythm } from './musicData';

export async function playRhythm(rhythm: Rhythm, beat: () => void) {
    const beats = rhythm.slice();
    let duration = beats.shift();

    if (duration !== undefined) {
        while (true) {
            await delay(duration);

            duration = beats.shift();
            if (duration === undefined) {
                break;
            }

            beat();
        }
    }
}

let timeout: NodeJS.Timer | undefined;

async function delay(ms: number) {
    return new Promise( resolve => {
        timeout = setTimeout(resolve, ms);
    } );
}

export function stopRhythm() {
    if (timeout !== undefined) {
        clearTimeout(timeout);
        timeout = undefined;
    }
}