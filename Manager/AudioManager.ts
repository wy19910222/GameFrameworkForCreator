/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

import {ManagerRoot} from "../Root/ManagerRoot";
import {BaseManager} from "./BaseManager";
import {CoroutineManager} from "./CoroutineManager";

@jsClass
export class AudioManager extends BaseManager {
	public static get instance(): AudioManager {
		return ManagerRoot.instance.get(this);
	}

	private readonly AUDIO_BASE_URL = "audio/";

	private _soundEnabled = true;
	private _dubEnabled = true;
	private _musicEnabled = true;
	private _musicPaused: boolean;
	private _musicName: string;
	private _musicId: number;

	protected onLoad(): void {
		cc.game.on(cc.game.EVENT_SHOW, this.onAudioResume, this);
	}
	private onAudioResume(): void {
		CoroutineManager.instance.frameOnce(1, () => this._resume(), this);
	}

	public get soundVolume(): number {
		return cc.audioEngine.getEffectsVolume();
	}
	public set soundVolume(value: number) {
		cc.audioEngine.setEffectsVolume(value);
	}

	public get soundEnabled(): boolean {
		return this._soundEnabled;
	}
	public set soundEnabled(value: boolean) {
		this._soundEnabled = value;
		fgui.GRoot.inst.muted = !value;
	}

	public get dubEnabled(): boolean {
		return this._dubEnabled;
	}
	public set dubEnabled(value: boolean) {
		this._dubEnabled = value;
	}

	public get musicVolume(): number {
		return cc.audioEngine.getMusicVolume();
	}
	public set musicVolume(value: number) {
		cc.audioEngine.setMusicVolume(value);
	}

	public get musicEnabled(): boolean {
		return this._musicEnabled;
	}
	public set musicEnabled(value: boolean) {
		this._musicEnabled = value;
		value ? this._resume() : this._pause();
	}

	public playDub(soundName: string, callback?: (progress: number) => void): void {
		this._dubEnabled && this.playEffect(soundName, callback);
	}

	public playDubRemote(url: string, callback?: (progress: number) => void): void {
		this._dubEnabled && this.playEffectRemote(url, callback);
	}

	public playSound(soundName: string, callback?: (progress: number) => void): void {
		this._soundEnabled && this.playEffect(soundName, callback);
	}

	public playSoundRemote(url: string, callback?: (progress: number) => void): void {
		this._soundEnabled && this.playEffectRemote(url, callback);
	}

	private playEffect(soundName: string, callback: (progress: number) => void): void {
		if (!soundName) {
			console.error("Play sound error: soundName is null!");
			return;
		}
		console.log("Load sound: " + soundName);
		let url = this.AUDIO_BASE_URL + soundName;
		let soundClip: cc.AudioClip = cc.resources.get(url, cc.AudioClip);
		if (soundClip) {
			console.log("Play sound: " + soundName);
			this._playEffect(soundClip, callback);
		} else {
			cc.resources.load(url, cc.AudioClip, (error, clip: cc.AudioClip) => {
				if (!error) {
					console.log("Play sound: " + soundName);
					this._playEffect(soundClip, callback);
				} else {
					console.error("Load sound error: " + soundName, error);
				}
			});
		}
	}
	private playEffectRemote(url: string, callback: (progress: number) => void): void {
		if (!url) {
			console.error("Play sound error: soundName is null!");			
			return;
		}
		console.log("Load sound: " + url);
		cc.assetManager.loadRemote(url, {ext: ".mp3"}, (error, clip: cc.AudioClip) => {
			if (!error) {
				console.log("Play sound: " + url);
				this._playEffect(clip, callback);
			} else {
				console.error("Load sound error: " + url, error);
			}
		});
	}
	private _playEffect(clip: cc.AudioClip, callback: (progress: number) => void): void {
		callback && callback(0);
		let audioId = cc.audioEngine.playEffect(clip, false);
		callback && cc.audioEngine.setFinishCallback(audioId, () => callback(1));
	}

	public playMusic(soundName: string, force?: boolean): void {
		if (force || soundName !== this._musicName) {
			this.stopMusic();
			this._musicName = soundName;
			this._musicEnabled && !this._musicPaused && this._playMusic();
		}
	}

	private _playMusic(): void {
		console.log("Load music: " + this._musicName);
		let url = this.AUDIO_BASE_URL + this._musicName;
		let musicClip: cc.AudioClip = cc.resources.get(url, cc.AudioClip);
		if (musicClip) {
			console.log("Play music: " + this._musicName);
			this._musicId = cc.audioEngine.playMusic(musicClip, true);
		} else {
			let musicName = this._musicName;
			cc.resources.load(url, cc.AudioClip, (error, clip: cc.AudioClip) => {
				if (!error) {
					if (this._musicName === musicName) {
						console.log("Play music: " + musicName);
						this._musicId = cc.audioEngine.playMusic(clip, true);
					}
				} else {
					console.error("Load music error: " + musicName, error);
				}
			});
		}
	}

	public pauseMusic(): void {
		this._musicPaused = true;
		this._pause();
	}

	private _pause(): void {
		cc.audioEngine.pauseMusic();
	}

	public resumeMusic(): void {
		this._musicPaused = false;
		this._resume();
	}

	private _resume(): void {
		if (this.musicEnabled && !this._musicPaused) {
			if (this._musicId) {
				cc.audioEngine.resumeMusic();
			} else if (this._musicName) {
				this._playMusic();
			}
		}
	}

	public stopMusic(): void {
		console.log("Stop music: " + this._musicName);
		cc.audioEngine.stopMusic();
		this._musicId = 0;
		this._musicName = null;
		this._musicPaused = false;
	}
}
