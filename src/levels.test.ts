import { getLevels } from './levels';
import { getBarLength, getSequenceLength, loadLevel } from './loadLevel';
import { NoteLength } from './musicData';

let iLevel = 1;
for (const level of getLevels()) {
    describe(`level ${iLevel}: ${level.name}`, () => {

        test('has notes', () => {
            expect(level.noteSequences.length).toBeGreaterThan(0);
            expect(level.noteSequences[0].length).toBeGreaterThan(0);
        });

        test('sequence lengths all match', () => {
            const firstSequenceLength = getSequenceLength(level.noteSequences[0])
    
            for (const sequence of level.noteSequences) {
                const sequenceLength = getSequenceLength(sequence);
                expect(sequenceLength).toBe(firstSequenceLength);
            }
        });

        test('note lengths all valid', () => {
            const validNoteDurations = [
                NoteLength.Semibreve,
    
                NoteLength.DottedMinim,
                NoteLength.Minim,
                NoteLength.TripletMinim,
                
                NoteLength.DottedCrotchet,
                NoteLength.Crotchet,
                NoteLength.TripletCrotchet,
                
                NoteLength.DottedQuaver,
                NoteLength.Quaver,
                NoteLength.TripletQuaver,
                
                NoteLength.DottedSemiquaver,
                NoteLength.Semiquaver,
                NoteLength.TripletSemiquaver,
            ];

            for (const sequence of level.noteSequences) {
                for (const note of sequence) {
                    expect(validNoteDurations).toContain(note.length);
                }
            }
        });

        test('triplets come in threes', () => {
            const tripletTypes = [
                NoteLength.TripletMinim,
                NoteLength.TripletCrotchet,
                NoteLength.TripletQuaver,
                NoteLength.TripletSemiquaver,
            ];
            
            for (const sequence of level.noteSequences) {
                for (let i=0; i<sequence.length; i++) {
                    const groupNoteDuration = sequence[i].length;
                    
                    const isTriplet = tripletTypes.indexOf(groupNoteDuration) !== -1;
                    if (!isTriplet) {
                        continue;
                    }

                    const lastTripletIndex = i + 2;
                    expect(lastTripletIndex).toBeLessThan(sequence.length);
                    if (lastTripletIndex >= sequence.length) {
                        continue;
                    }

                    expect(sequence[i + 1].length).toBe(groupNoteDuration);
                    expect(sequence[i + 2].length).toBe(groupNoteDuration);

                    i = lastTripletIndex;
                }
            }
        });

        test('bar length is divisible by sequence length', () => {
            const sequenceLength = getSequenceLength(level.noteSequences[0])
            const barLength = getBarLength(level);
            
            const divided = barLength / sequenceLength;
            const rounded = Math.round(divided);
            
            expect(divided).toBe(rounded);
        });

        test('loads', () => {
            loadLevel(level);
        });
    });

    iLevel ++;
}