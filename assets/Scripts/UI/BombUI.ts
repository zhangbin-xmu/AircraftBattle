import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BombUI')
export class BombUI extends Component {

    @property(Label)
    stockLabel: Label = null

    start() {
       
    }

    update(deltaTime: number) {
        
    }

    updateUI(stockLabel: string) {
        this.stockLabel.string = stockLabel
    }
}


