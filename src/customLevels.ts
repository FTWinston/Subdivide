import { IMusic, INote } from './musicData';

export function loadCustomLevel(data: string): IMusic {
    const parts = data.split(';');

    const tempo = parts[0].split('|');
    const timeSig = parts[1].split('|');

    const bars = parts[2].split('|')
        .map(b => {
            const noteParts = b.split(':');

            const bar: INote[] = [];
            for (let i=0; i<noteParts.length; i+=2) {
                bar.push({
                    length: parseInt(noteParts[i], 10),
                    type: parseInt(noteParts[i+1], 10),
                });
            }

            return bar;
        });

    const level: IMusic = {
        bars,
        name: 'Custom rhythm',
        tempo: [parseInt(tempo[0], 10), parseInt(tempo[1], 10)],
        timeSignature: [parseInt(timeSig[0], 10), parseInt(timeSig[1], 10)],
    }

    return level;
}

export function saveCustomLevel(level: IMusic) {
    const tempo = `${level.tempo[0]}|${level.tempo[1]}`;
    const timeSig = `${level.timeSignature[0]}|${level.timeSignature[1]}`;
    const bars = level.bars.map(
        b => b.map(note => `${note.length}:${note.type}`)
            .join(':')
    )
    .join('|');

    return `${tempo};${timeSig};${bars}`;
}