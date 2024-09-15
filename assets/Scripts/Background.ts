import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Background')
export class Background extends Component {

    @property(Node)
    bg01: Node = null

    @property(Node)
    bg02: Node = null

    @property
    speed: number = 100

    @property
    sceneHeight: number = 852

    start() {

    }

    update(deltaTime: number) {
        let p1 = this.bg01.position
        this.bg01.setPosition(p1.x, p1.y - this.speed * deltaTime, p1.z)

        let p2 = this.bg02.position
        this.bg02.setPosition(p2.x, p2.y - this.speed * deltaTime, p2.z)

        p1 = this.bg01.position
        p2 = this.bg02.position

        if (p1.y < -this.sceneHeight) {
            this.bg01.setPosition(p2.x, p2.y + this.sceneHeight, p2.z)
        }
        if (p2.y < -this.sceneHeight) {
            this.bg02.setPosition(p1.x, p1.y + this.sceneHeight, p1.z)
        }
    }
}


