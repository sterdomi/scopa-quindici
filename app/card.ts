
import {Playground} from "./specialEffects";
import {ScopaMedia} from "./scopaMedia";
export const PLAY_Y = 20;



export enum CardType{
    SCHWERT="SCHWERT",
    GELD="GELD",
    STAB="STAB",
    POKAL="POKAL",
    NONE="NONE"
}

export class JsonCard{
    x:number;
    y:number;
    static factor:number=1;
    name: string;
    nameMarkiert: string;
    pos:number;
    playground: Playground = Playground.PLAY;
    marked:boolean=false;
    internalMark:boolean=false;
    moving:boolean=false;
    type:CardType;
    value:number;
    constructor(name:string,pos:number,playground:Playground,type:CardType,value:number,marked:boolean){
        this.name=name;
        this.pos=pos;
        this.type=type;
        this.value=value;
        this.nameMarkiert=name+'_m';
        this.playground=playground;
        this.marked=marked;
    }
}


export class Card extends JsonCard{
    static hinten: HTMLImageElement;
    img: HTMLImageElement;
    justPlayed:boolean=false;
    highlighted:boolean=false;
    media:ScopaMedia;

    constructor(name:string,pos:number,playground:Playground,type:CardType,value:number,marked:boolean,media:ScopaMedia){
        super(name,pos,playground,type,value,marked);
        this.media=media;
        this.img=media.getHTMLImageElementByName(name);
        Card.hinten=media.getHTMLImageElementByName("hinten");
    }

    mark():void{
        if(this.marked && !this.justPlayed) {
            this.marked = false;
        }else{
            this.marked = true;
        }
    }

    isClicked(x:number,y:number):boolean{
        let xMin=this.getPosX();
        let xMax=this.getPosX()+(this.getWidth());
        let yMin=this.getPosY();
        let yMax=this.getPosY()+(this.getHeight());

        return (x>=xMin&&x<=xMax && y>yMin&&y<yMax);
    }

    getHeight(): number {
        let height=((270) / 720 * this.media.innerHeight()) * Card.factor;
        if(this.img.src.indexOf('napoletane')>=0){
            return height*0.8;
        }else {
            return height;
        }
    }
    getWidth(): number{
        return ((115)/1280*this.media.innerWidth())*Card.factor;
    }

    getPlayPosition(currentPos:number):number{
        return (currentPos * (this.getWidth() + 20) + 20);
    }

    getPosX(): number{
        let posCasa=this.media.innerWidth()/2-this.getWidth()+40;

        if(this.moving){
            return this.x;
        }else if(this.playground==Playground.PLAY) {
            if (this.pos == 0) {
                return 20;
            } else {
                let x = this.getPlayPosition(this.pos);
                return x;
            }
        }else if(this.playground==Playground.PLAYER){
            if (this.pos == 0) {
                return posCasa-(this.getWidth()+60);
            } else {
                let x = posCasa  - (this.getWidth()+ (this.pos * (this.getWidth() + 20) + 60));
                return x;
            }
        }else if(this.playground==Playground.COMPUTER){
            if (this.pos == 0) {
                return posCasa+this.getWidth()+60;
            } else {
                let x = posCasa +this.getWidth() + (this.pos * (this.getWidth() + 20) + 60);
                return x;
            }

        }
    }
    getPosY():number{
        if(this.moving){
            return this.y;
        }else if(this.playground==Playground.PLAY) {
            if(this.marked || this.highlighted){
                return PLAY_Y-10;
            }

            return PLAY_Y;
        }else{
            return this.media.innerHeight()-this.getHeight()-20;
        }
    }

    getImage(player:Playground):HTMLImageElement{
        if(player!=this.playground && this.playground!=Playground.PLAY) {
            return Card.hinten;
        }else{
            return this.img;
        }
    }
}

abstract class SizedCard extends Card {
    protected height: number;
    protected width: number;
    nickname: string;

    constructor(name: string, nickName: string, type: CardType, value: number, pos: number,
                playground: Playground, height: number, width: number, x: number, y: number, media: ScopaMedia) {
        super(name, pos, playground, type, value, false, media);
        this.height = height;
        this.width = width;
        this.nickname = nickName;
        this.x = x;
        this.y = y;
    }

    getImage(_player: Playground): HTMLImageElement {
        return this.img;
    }

    getHeight(): number {
        return (this.height / 720 * this.media.innerHeight()) * Card.factor;
    }

    getWidth(): number {
        return (this.width / 1280 * this.media.innerWidth()) * Card.factor;
    }
}


export class IntroCard extends SizedCard {
    getPosY(): number {
        return (this.media.innerHeight() / 2) * (this.y);
    }

    getPosX(): number {
        return (this.media.innerWidth() / 2) - ((this.getWidth() / 2) * (this.x));
    }
}


export class ChangeCard extends SizedCard {
    getPosY(): number {
        return this.media.innerHeight() - this.getHeight() - 10;
    }

    getPosX(): number {
        return this.media.innerWidth() - this.getWidth() - 20;
    }
}

export class HomeCard extends ChangeCard {
    getPosX(): number {
        return 20;
    }
}

export class CommandoCard extends Card{
    imgDis: HTMLImageElement;
    constructor(name:string,pos:number,playground:Playground,type:CardType,value:number,marked:boolean,media:ScopaMedia){
        super(name,pos,playground,type,value,marked,media);
        this.imgDis=<HTMLImageElement>document.getElementById(this.name+"_dis");
    }
    getHeight(): number {
        return (75/720*this.media.innerHeight())*Card.factor;
    }
    getWidth(): number{
        return (75/1280*this.media.innerWidth())*Card.factor;
    }
    getPosX(): number{
        if(this.moving){
            return this.x;
        }else {
            if(this.pos==1){
                return this.media.innerWidth() / 2 - ((this.getWidth() / 2)-this.getWidth()*0.25);
            } else{
                return this.media.innerWidth() / 2 - ((this.getWidth() / 2)+this.getWidth()*0.5);
            }
        }
    }
    getPosY(): number {
        if (this.moving) {
            return this.y;
        }
        return this.media.innerHeight() - this.getHeight() - 30;
    }

    getFooterImage(enabled: boolean): HTMLImageElement {
        if (enabled) {
            return this.img;
        } else {
            return this.imgDis;
        }
    }
}

export class SoundCard extends Card{
    getHeight(): number {
        return (40/720*this.media.innerHeight())*Card.factor;
    }
    getWidth(): number{
        return (40/1280*this.media.innerWidth())*Card.factor;
    }
    getPosX(): number{
            return this.media.innerWidth() -40;
    }
    getPosXByPlayer(player:Playground): number{
        if(player==Playground.COMPUTER) {
            return this.media.innerWidth() - 40;
        }else{
            return 40;
        }
    }
    isClickedByPlayer(x:number,y:number,player:Playground):boolean{
        let xMin=this.getPosXByPlayer(player);
        let xMax=this.getPosXByPlayer(player)+(this.getWidth());
        let yMin=this.getPosY();
        let yMax=this.getPosY()+(this.getHeight());

        return (x>=xMin&&x<=xMax && y>yMin&&y<yMax);
    }
    getPosY():number {
            return this.media.innerHeight() - this.getHeight() - 20;
    }

    getIcon(soundFlag:boolean):HTMLImageElement{
        if(soundFlag) {
            return this.img;
        }else{
            return <HTMLImageElement>document.getElementById("sound_off");;
        }
    }
}
