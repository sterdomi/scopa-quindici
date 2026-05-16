import {Card, CardType} from "./card";
import {Playground} from "./specialEffects";

export class CardSet{
    setOfPermutations:Card[];
    playerCard:Card;
    score:number=0;

    constructor(playerCard:Card,fifteenOfPermutations:Card[]){
        this.setOfPermutations=fifteenOfPermutations;
        this.playerCard=playerCard;
    }

    getCardsByPlaygroundAndType(playground:Playground,type:CardType,cards:Card[]):Card[]{
        let ret:Card[]=[];
        for(let card of cards){
            if(card.playground==playground && card.type==type){
                ret.push(card);
            }
        }
        return ret;
    }
    getCardsByPlaygroundAndValue(playground:Playground,value:number,cards:Card[]):Card[]{
        let ret:Card[]=[];
        for(let card of cards){
            if(card.playground==playground && card.value==value){
                ret.push(card);
            }
        }
        return ret;
    }

    hasCardsByTypeAndValue(type:CardType,value:number,cards:Card[]):boolean{
        let ret:boolean=false;
        for(let card of cards){
            if(card.type==type && card.value==value){
                ret=true;
                break;
            }
        }
        return ret;
    }
}