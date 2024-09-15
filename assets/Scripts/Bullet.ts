import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    @property
    topBorder: number = 380

    @property
    speed: number = 500

    start() {

    }

    update(deltaTime: number) {
        const p = this.node.position
        this.node.setPosition(p.x, p.y + this.speed * deltaTime, p.z)

        if (p.y > this.topBorder + 50) {
            this.node.destroy()
        }
    }
}


