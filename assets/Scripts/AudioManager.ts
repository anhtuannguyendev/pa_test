import { _decorator, AudioClip, AudioSource, Component, Node, Root } from 'cc';
const { ccclass, property } = _decorator;

export enum ESoundEffect {
    CLICK,
    SLIDE,
    WRONG
}

@ccclass('AudioManager')
export class AudioManager extends Component {
    
    @property(AudioSource)
    audioSource: AudioSource = null;

    @property(AudioClip)
    audioClick: AudioClip = null;

    @property(AudioClip)
    audioSlide: AudioClip = null;

    @property(AudioClip)
    audioWrong: AudioClip = null;

    private static _instance: AudioManager = null;

    protected onLoad(): void {
        AudioManager._instance = this;
    }

    public static playEffect(type: ESoundEffect): void {
        let self = AudioManager._instance;
        switch (type) {
            case ESoundEffect.CLICK:
                self.audioSource.playOneShot(self.audioClick);
                break;
            case ESoundEffect.SLIDE:
                self.audioSource.playOneShot(self.audioSlide);
                break;
            case ESoundEffect.WRONG:
                self.audioSource.playOneShot(self.audioWrong);
                break;
        }
    }
}


