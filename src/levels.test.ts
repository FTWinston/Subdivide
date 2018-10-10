import { levels } from './levels';
import { getBarLength, getSequenceLength, loadLevel } from './loadLevel';

let iLevel = 1;
for (const level of levels) {
    describe(`level ${iLevel}: ${level.name}`, () => {
        test('has notes', () => {
            expect(level.noteSequences.length).toBeGreaterThan(0);
            expect(level.noteSequences[0].length).toBeGreaterThan(0);
        });

        test('sequence lengths all match', () => {
            const firstSequenceLength = getSequenceLength(level.noteSequences[0])
    
            for (const sequence of level.noteSequences) {
                const sequenceLength = getSequenceLength(sequence);
                expect(sequenceLength).toBeCloseTo(firstSequenceLength, 4);
            }
        });

        test('bar length is divisible by sequence length', () => {
            const sequenceLength = getSequenceLength(level.noteSequences[0])
            const barLength = getBarLength(level);
            
            const divided = barLength / sequenceLength;
            const rounded = Math.round(divided);
            
            expect(divided).toBeCloseTo(rounded, 4);
        });

        test('loads', () => {
            loadLevel(level);
        });
    });

    iLevel ++;
}