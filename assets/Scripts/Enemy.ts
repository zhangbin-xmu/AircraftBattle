import { _decorator, Animation, AudioClip, AudioSource, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, Sprite } from 'cc';
import { Bullet } from './Bullet';
import { GameManager } from './GameManager';
import { ResourceManager } from './ResourceManager';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property
    bottomBorder: number = -380

    @property
    speed: number = 300

    @property
    hp: number = 1

    @property
    score: number = 100

    @property(Animation)
    anim: Animation = null

    @property
    animDown: string = ''

    @property
    animHit: string = ''

    collider: Collider2D = null

    crashed: boolean = false

    @property(AudioClip)
    crashAudio: AudioClip = null

    @property
    crashVolume: number = 0.5

    @property(AudioSource)
    flyAudio: AudioSource = null

    @property
    flyVolume: number = 0.2

    protected onDestroy(): void {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
        ResourceManager.getInstance().consumeEnemy(this.node)
    }

    start() {
        this.collider = this.getComponent(Collider2D)
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }

        this.playAudio()
        GameManager.getInstance().node.on('GAME_PAUSE', () => { this.pauseAudio() })
        GameManager.getInstance().node.on('GAME_RESUME', () => { this.playAudio() })
    }

    update(deltaTime: number) {
        if (this.hp > 0) {
            const p = this.node.position
            this.node.setPosition(p.x, p.y - this.speed * deltaTime, p.z)
        }

        if (this.node.position.y < this.bottomBorder - 100) {
            this.node.destroy()
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.getComponent(Bullet)) {
            otherCollider.enabled = false
            otherCollider.getComponent(Sprite).enabled = false
        }

        this.changeHealthPoints(-1)
        if (this.hp > 0) {
            this.anim.play(this.animHit)
        } else {
            this.crash()
        }
    }

    crash() {
        if (this.crashed) {
            return
        }

        this.crashed = true
        AudioManager.inst.playOneShot(this.crashAudio, this.crashVolume)
        this.anim.play(this.animDown)
        if (this.collider) {
            this.collider.enabled = false
        }

        GameManager.getInstance().changeScore(this.score)
        this.scheduleOnce(() => {
            this.node.destroy()
        }, 1)
    }

    bombed() {
        if (this.hp > 0) {
            this.crash()
        }
    }

    changeHealthPoints(increment: number) {
        this.hp += increment
    }

    playAudio() {
        if (this.flyAudio) {
            this.flyAudio.play()
        }
    }

    pauseAudio() {
        if (this.flyAudio) {
            this.flyAudio.pause()
        }
    }
}


