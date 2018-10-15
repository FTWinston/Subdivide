import * as React from 'react';
import './App.css';
import { CountInType } from './CountIn';
import { LevelDisplay } from './LevelDisplay';
import { getLevels } from './levels';
import { LevelSelect } from './LevelSelect';
import { ILevel } from './musicData';

interface IState {
    levels: ILevel[];
    currentLevel?: ILevel;
}

class App extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            levels: getLevels(),
        };
    }

    public render() {
        if (this.state.currentLevel === undefined) {
            const selectLevel = (level: ILevel) => this.setState({
                currentLevel: level,
            });

            return <LevelSelect levels={this.state.levels} onSelect={selectLevel} />
        }

        const clearSelection = () => this.setState({
            currentLevel: undefined,
        });

        const selectedIndex = this.state.levels.indexOf(this.state.currentLevel);
        const selectNext = selectedIndex < this.state.levels.length - 1
            ? () => this.setState({ currentLevel: this.state.levels[selectedIndex + 1] })
            : undefined;

        return <LevelDisplay
            level={this.state.currentLevel}
            cancel={clearSelection}
            countIn={CountInType.OneBar}
            next={selectNext}
        />
    }
}

export default App;
