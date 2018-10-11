import { Deck } from './Deck';
import { ILevel, IMusic, INote } from './musicData';

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
    return level.timeSignature[0] * level.timeSignature[1];
}

export function getSequenceLength(sequence: INote[]) {
    return sequence.reduce((total, current) => total + current.length, 0);
}

function populateBars(numBars: number, barLength: number, sequences: INote[][]) {
    const sequenceLength = getSequenceLength(sequences[0]);

    const sequenceDeck = new Deck<INote[]>(sequences);
    const bars: INote[][] = [];

    do {
        const bar = populateBar(barLength, sequenceLength, () => sequenceDeck.draw());
        bars.push(bar);
    } while (bars.length < numBars);

    return bars;
}

function populateBar(barLength: number, sequenceLength: number, getNextSequence: () => INote[]) {
    const bar: INote[] = [];

    let length = 0;
    do {
        bar.push(...getNextSequence());

        length += sequenceLength;
    } while (length < barLength);

    return bar;
}