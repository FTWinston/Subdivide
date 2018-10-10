import { Deck } from './Deck';
import { ILevel, IMusic, MusicElement } from './musicData';

export function loadLevel(data: ILevel): IMusic {
    const barLength = getBarLength(data);
    const bars = populateBars(data.numberOfBars, barLength, data.noteSequences);

    return {
        bars,
        name: data.name,
        tempo: data.tempo,
        timeSignature: data.timeSignature,
    }
}

export function getBarLength(level: ILevel) {
    return level.timeSignature[0] * 1 / level.timeSignature[1];
}

export function getSequenceLength(sequence: MusicElement[]) {
    return sequence.reduce((total, current) => total + 1 / current.duration, 0);
}

function populateBars(numBars: number, barLength: number, sequences: MusicElement[][]) {
    const sequenceLength = getSequenceLength(sequences[0]);

    const sequenceDeck = new Deck<MusicElement[]>(sequences);
    const bars: MusicElement[][] = [];

    do {
        const bar = populateBar(barLength, sequenceLength, () => sequenceDeck.draw());
        bars.push(bar);
    } while (bars.length < numBars);

    return bars;
}

function populateBar(barLength: number, sequenceLength: number, getNextSequence: () => MusicElement[]) {
    const bar: MusicElement[] = [];

    let length = 0;
    do {
        bar.push(...getNextSequence());

        length += sequenceLength;
    } while (length < barLength);

    return bar;
}