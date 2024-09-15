import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {

    @property(Label)
    recordScoreLabel: Label = null

    @property(Label)
    currentScoreLabel: Label = null

    start() {
        this.node.active = false
    }

    update(deltaTime: number) {
        
    }

    showUI(recordScore: number, currentScore: number) {
        this.recordScoreLabel.string = recordScore.toString()
        this.currentScoreLabel.string = currentScore.toString()
        this.node.active = true
    }
}


