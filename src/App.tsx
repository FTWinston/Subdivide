import * as React from 'react';
import { Route, Switch } from 'react-router';
import './App.css';
import { CountInType } from './CountIn';
import { LevelDisplay } from './LevelDisplay';
import { getLevels } from './levels';
import { LevelSelect } from './LevelSelect';
import { ILevel } from './musicData';

interface IState {
    levels: ILevel[];
    countIn: CountInType;
}

export class App extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            countIn: CountInType.OneBar,
            levels: getLevels(),
        };
    }

    public render() {
        const renderLevel = (props: any) => {
            const levelNum = parseInt(props.match.params.id, 10);
            return <LevelDisplay
                level={this.state.levels[levelNum - 1]}
                countIn={this.state.countIn}
                nextLevelNum={levelNum < this.state.levels.length - 1 ? levelNum + 1 : undefined}
            />
        };

        const renderLevelSelect = () => <LevelSelect levels={this.state.levels} />

        return <Switch>
            <Route path="/level/:id" render={renderLevel} />
            <Route render={renderLevelSelect} />
        </Switch>
    }
}