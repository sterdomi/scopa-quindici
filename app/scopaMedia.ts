import {CardType, CommandoCard, SoundCard} from "./card";
import {Playground} from "./specialEffects";

export interface ScopaMedia{
    getHTMLImageElementByName(name:string):HTMLImageElement;
    getHTMLAudioElementByName(name:string):HTMLAudioElement;
    getCommandoCardByName(name:string,pos:number):CommandoCard;
    getSoundCardByName(name:string):SoundCard;
    innerWidth():number;
    innerHeight():number;
}

export class ScopaMediaDomImpl implements ScopaMedia{

    public getHTMLImageElementByName(name:string):HTMLImageElement{
        return <HTMLImageElement>document.getElementById(name);
    }

    public getHTMLAudioElementByName(name:string):HTMLAudioElement{
        return <HTMLAudioElement>document.getElementById(name);
    }

    public getCommandoCardByName(name: string,pos:number): CommandoCard {
        return new CommandoCard(name,pos,Playground.CASA,CardType.NONE, 0,false,this);
    }

    public getSoundCardByName(name: string): SoundCard {
        return new SoundCard(name,0,Playground.CASA,CardType.NONE, 0,false,this);
    }
    public innerWidth():number{
        if (navigator.appVersion.indexOf("Win")!=-1){
            return window.innerWidth-20;
        }
        return window.innerWidth;
    }

    public innerHeight():number{
        if (navigator.appVersion.indexOf("Win")!=-1){
            return window.innerHeight-20;
        }
        return window.innerHeight;
    }
}