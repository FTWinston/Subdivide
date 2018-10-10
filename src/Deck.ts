import * as shuffle from 'shuffle-array';

export class Deck<TItem> {
    private drawQueue: TItem[] = [];

    constructor(public readonly itemList: TItem[]) {}

    public draw() {
        if (this.drawQueue.length === 0) {
            this.drawQueue = shuffle(this.itemList.slice());
        }

        return this.drawQueue.pop()!;
    }

}
