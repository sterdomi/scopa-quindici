import {Playground} from "./specialEffects";
import {Card, CardType} from "./card";
import {Game} from "./game";
import {CardSet} from "./cardSet";

export class Score{
    denariCountPlayer1:number=0;
    denariCountComputer:number=0;
    cardCountPlayer1: number=0;
    cardCountComputer: number=0;
    scopaPlayer1:number=0;
    scopaComputer:number=0;
    scorePlayer1:number=0;
    scoreComputer:number=0;

    setteBello:Playground;
    cardCount: Playground;
    denari: Playground;
    primera: Playground;

    scopa(playground:Playground){
        if(Playground.PLAYER==playground){
            this.scopaPlayer1++;
        }else if(Playground.COMPUTER==playground){
            this.scopaComputer++;
        }
    }


    getValueOfPrimera(playerCards:Card[]){
        let val=0
        let cardTypes=[CardType.GELD,CardType.POKAL,CardType.SCHWERT,CardType.STAB];
        for(let cardType of cardTypes){
            let maxVal=0;
            for(let card of playerCards){
                if(card.value<8 && cardType==card.type){
                    if(card.value>maxVal){
                        maxVal=card.value;
                    }
                }
            }
            val+=maxVal;
        }
        return val;
    }


    calculate(game:Game) {
        //last cards
        let lastCards = game.getCardsByPlayground(Playground.PLAY);
        for(let card of lastCards){
            if(Playground.PLAYER==game.lastWin){
                card.playground=Playground.GESPIELT_PLAYER;
            }else{
                card.playground=Playground.GESPIELT_COMPUTER;
            }
        }
        //cardCount
        let cardsGespielPlayer = game.getCardsByPlayground(Playground.GESPIELT_PLAYER);
        let cardsGespielComputer = game.getCardsByPlayground(Playground.GESPIELT_COMPUTER);
        this.cardCountPlayer1=cardsGespielPlayer.length;
        this.cardCountComputer=cardsGespielComputer.length;
        if(this.cardCountPlayer1>this.cardCountComputer){
            this.cardCount=Playground.PLAYER;
            this.scorePlayer1++;
        }
        if(this.cardCountPlayer1<this.cardCountComputer){
            this.cardCount=Playground.COMPUTER;
            this.scoreComputer++;
        }
        //sette bello
        let playerCards = game.getCardsByPlayground(Playground.GESPIELT_PLAYER);
        let hasSetteBello=false;
        for(let card of playerCards){
            if(card.type==CardType.GELD && card.value==7){
                hasSetteBello=true;
            }
        }
        if(hasSetteBello){
            this.scorePlayer1++
            this.setteBello=Playground.PLAYER;
        }else{
            this.scoreComputer++
            this.setteBello=Playground.COMPUTER;
        }
        //primera
        let primeraPlayer1=this.getValueOfPrimera(cardsGespielPlayer);
        let primeraComputer=this.getValueOfPrimera(cardsGespielComputer);
        if(primeraPlayer1>primeraComputer){
            this.primera= Playground.PLAYER;
            this.scorePlayer1++;
        }else if(primeraComputer>primeraPlayer1){
            this.primera=Playground.COMPUTER;
            this.scoreComputer++;
        }
        //denari
        this.denariCountPlayer1=0;
        for (let card of cardsGespielPlayer) {
            if(CardType.GELD==card.type){
                this.denariCountPlayer1++;
            }
        }
        this.denariCountComputer=10-this.denariCountPlayer1;
        if(this.denariCountPlayer1>this.denariCountComputer){
            this.denari=Playground.PLAYER;
            this.scorePlayer1++;
        }else if(this.denariCountPlayer1<this.denariCountComputer){
            this.denari=Playground.COMPUTER;
            this.scoreComputer++;
        }

        //scopa
        this.scorePlayer1+=this.scopaPlayer1;
        this.scoreComputer+=this.scopaComputer;
    }

    reset() {
        this.scopaPlayer1=0;
        this.scopaComputer=0;
        this.cardCountPlayer1=0;
        this.cardCountComputer=0;
        this.denariCountPlayer1=0;
        this.denariCountComputer=0;
        if(this.scorePlayer1>=15 &&this.scorePlayer1>this.scoreComputer){
            this.scorePlayer1=0;
            this.scoreComputer=0;
        }
        if(this.scoreComputer>=15 &&this.scoreComputer>this.scorePlayer1){
            this.scorePlayer1=0;
            this.scoreComputer=0;
        }
        this.setteBello=undefined;
        this.cardCount=undefined;
        this.denari=undefined;
        this.primera=undefined;
    }


    scorePermutationsPlayer(game:Game,playground:Playground,cardSet:CardSet){
        let playGroundGespielt=game.getPlayedPlayground(playground);
        //scopa gibt einen Punkt
        if(cardSet.setOfPermutations.length==game.getCardsByPlayground(Playground.PLAY).length){
            cardSet.score=100;
        }

        //Geldstuecke bis 6 karten geben 15 punkte pro Geldstueckkarte
        let playedDenari = cardSet.getCardsByPlaygroundAndType(playGroundGespielt,CardType.GELD,game.cards).length;
        let denariPlay= cardSet.getCardsByPlaygroundAndType(Playground.PLAY,CardType.GELD,cardSet.setOfPermutations).length;
        let denariPlayer=cardSet.playerCard.type==CardType.GELD?1:0;
        if(playedDenari+denariPlayer+denariPlay>5){
            cardSet.score+=100;
        }else if(playedDenari<6){
            cardSet.score+=(denariPlay+denariPlayer)*15;
        }

        //setteBello gibt 100 Punkte
        cardSet.score+=(cardSet.hasCardsByTypeAndValue(CardType.GELD,7,cardSet.setOfPermutations))?100:0;
        cardSet.score+=(cardSet.playerCard.type==CardType.GELD&&cardSet.playerCard.value==7)?100:0;

        //anzahl karten bis 21 ergeben pro karte 5
        let cardCount = game.getCardsByPlayground(playGroundGespielt).length;
        if(cardCount<21) {
            if ((cardSet.setOfPermutations.length + 1 + cardCount) > 20) {
                cardSet.score += 100;
            } else {
                cardSet.score += (cardSet.setOfPermutations.length + 1) * 5;
            }
        }


        //primera
        let valueOfPrimera = game.score.getValueOfPrimera(game.getCardsByPlayground(playGroundGespielt));
        let primeraOfThis=game.score.getValueOfPrimera(cardSet.setOfPermutations);
        let primeraTogether=game.score.getValueOfPrimera(game.getCardsByPlayground(playGroundGespielt).concat(cardSet.setOfPermutations));
        if(valueOfPrimera<26) {
            if (primeraTogether >= 26) {
                cardSet.score += 100;
            } else {
                cardSet.score += 100 / 26 * primeraOfThis;
            }
        }

        //Was nachher noch auf dem Tisch ist (<5 und >15 geben 25 Punkte)
        if(game.getValueAfter(cardSet.setOfPermutations)<5 || game.getValueAfter(cardSet.setOfPermutations)>=15){
            cardSet.score +=  25;
        }else{//minus punkte fuer Gefahr einer Scopa
            let scopaCard=15-game.getValueAfter(cardSet.setOfPermutations);
            let probability=game.getProbabilityOfRemainingCards(scopaCard,playground);
            cardSet.score-=probability;
        }

    }
}
