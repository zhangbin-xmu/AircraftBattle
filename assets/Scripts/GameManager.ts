import { _decorator, AudioClip, Button, Component, director, Node } from 'cc';
import { BombUI } from './UI/BombUI';
import { ScoreUI } from './UI/ScoreUI';
import { GameOverUI } from './UI/GameOverUI';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    private static _instance: GameManager

    public static getInstance(): GameManager {
        return this._instance
    }

    @property(BombUI)
    bombUI: BombUI = null

    @property
    bombStock: number = 0

    @property(ScoreUI)
    scoreUI: ScoreUI = null

    @property
    score: number = 0

    @property(Button)
    pauseButton: Button = null

    @property(Button)
    resumeButton: Button = null

    @property(GameOverUI)
    gameOverUI: GameOverUI = null

    @property(AudioClip)
    gameMusic: AudioClip = null

    @property
    musicVolume: number = 0.2

    @property(AudioClip)
    clickAudio: AudioClip = null

    @property
    clickVolume: number = 0.5

    @property(AudioClip)
    gameOverAudio: AudioClip = null

    @property
    gameOverVolume: number = 1

    @property(AudioClip)
    bombAudio: AudioClip = null

    @property
    bombVolume: number = 1

    protected onLoad(): void {
        GameManager._instance = this
    }

    start() {
        this.resumeButton.node.active = false
        AudioManager.inst.play(this.gameMusic, this.musicVolume)
    }

    update(deltaTime: number) {
        
    }

    onPauseButtonClick() {
        AudioManager.inst.playOneShot(this.clickAudio, this.clickVolume)
        AudioManager.inst.pause()
        director.pause()
        this.pauseButton.node.active = false
        this.resumeButton.node.active = true
        GameManager.getInstance().node.emit('GAME_PAUSE')
    }

    onResumeButtonClick() {
        AudioManager.inst.playOneShot(this.clickAudio, this.clickVolume)
        AudioManager.inst.resume()
        director.resume()
        this.resumeButton.node.active = false
        this.pauseButton.node.active = true
        GameManager.getInstance().node.emit('GAME_RESUME')
    }

    onRestartButtonClick() {
        AudioManager.inst.playOneShot(this.clickAudio, this.clickVolume)
        director.loadScene(director.getScene().name)
        this.onResumeButtonClick()
    }

    onQuitButtonClick() {
        AudioManager.inst.playOneShot(this.clickAudio, this.clickVolume)
    }

    useBomb() {
        if (this.bombStock > 0) {
            AudioManager.inst.playOneShot(this.bombAudio, this.bombVolume)
            this.changeBombStock(-1)
        }
    }

    changeBombStock(increment: number) {
        this.bombStock += increment
        this.bombUI.updateUI(this.bombStock.toString())
    }

    changeScore(increment: number) {
        this.score += increment
        this.scoreUI.updateUI(this.score.toString())
    }

    gameOver() {
        this.onPauseButtonClick()
        AudioManager.inst.playOneShot(this.gameOverAudio, this.gameOverVolume)

        let recordSocre = 0
        let item = localStorage.getItem('RECORE_SCORE')
        if (item != null) {
            recordSocre = parseInt(item)
        }
        if (recordSocre < this.score) {
            localStorage.setItem('RECORE_SCORE', this.score.toString())
        }
        this.gameOverUI.showUI(recordSocre, this.score)
    }
}


