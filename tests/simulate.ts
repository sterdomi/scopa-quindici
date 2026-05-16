import {Playground, PlayMode, SpecialEffects} from "../app/specialEffects";
import {Game} from "../app/game";
import {Card, CardType, CommandoCard, SoundCard} from "../app/card";
import {ScopaMedia} from "../app/scopaMedia";
import {Score} from "../app/score";
import {ScopaQuindici} from "../app/scopaQuindiciGame";
import {CardSet} from "../app/cardSet";
import {EasyScoringStrategy, MediumScoringStrategy, HardScoringStrategy, BaseScoringStrategy} from "../app/scoringStrategy";


export class ScopaMediaMock implements ScopaMedia{
    getCommandoCardByName(name: string, pos: number): CommandoCard {
        return { moving: false } as unknown as CommandoCard;
    }

    getHTMLAudioElementByName(name: string): HTMLAudioElement {
        return undefined;
    }

    getHTMLImageElementByName(name: string): HTMLImageElement {
        return undefined;
    }

    getSoundCardByName(name: string): SoundCard {
        return undefined;
    }

    innerHeight(): number {
        return 100;
    }

    innerWidth(): number {
        return 100;
    }



}

function createGame():ScopaQuindici {
    let score=new Score();
    let media=new ScopaMediaMock();
    let specialEffects=new SpecialEffects(media);
    let newGame = new ScopaQuindici(specialEffects,score,media);
    let geld1:Card=new Card("geld1",0,Playground.CASA,CardType.GELD,1,false,media);
    let geld2:Card=new Card("geld2",0,Playground.CASA,CardType.GELD,2,false,media);
    let geld3:Card=new Card("geld3",0,Playground.CASA,CardType.GELD,3,false,media);
    let geld4:Card=new Card("geld4",0,Playground.CASA,CardType.GELD,4,false,media);
    let geld5:Card=new Card("geld5",0,Playground.CASA,CardType.GELD,5,false,media);
    let geld6:Card=new Card("geld6",0,Playground.CASA,CardType.GELD,6,false,media);
    let geld7:Card=new Card("geld7",0,Playground.CASA,CardType.GELD,7,false,media);
    let geld8:Card=new Card("geld8",0,Playground.CASA,CardType.GELD,8,false,media);
    let geld9:Card=new Card("geld9",0,Playground.CASA,CardType.GELD,9,false,media);
    let geld10:Card=new Card("geld10",0,Playground.CASA,CardType.GELD,10,false,media);

    let pokal1:Card=new Card("pokal1",0,Playground.CASA,CardType.POKAL,1,false,media);
    let pokal2:Card=new Card("pokal2",0,Playground.CASA,CardType.POKAL,2,false,media);
    let pokal3:Card=new Card("pokal3",0,Playground.CASA,CardType.POKAL,3,false,media);
    let pokal4:Card=new Card("pokal4",0,Playground.CASA,CardType.POKAL,4,false,media);
    let pokal5:Card=new Card("pokal5",0,Playground.CASA,CardType.POKAL,5,false,media);
    let pokal6:Card=new Card("pokal6",0,Playground.CASA,CardType.POKAL,6,false,media);
    let pokal7:Card=new Card("pokal7",0,Playground.CASA,CardType.POKAL,7,false,media);
    let pokal8:Card=new Card("pokal8",0,Playground.CASA,CardType.POKAL,8,false,media);
    let pokal9:Card=new Card("pokal9",0,Playground.CASA,CardType.POKAL,9,false,media);
    let pokal10:Card=new Card("pokal10",0,Playground.CASA,CardType.POKAL,10,false,media);

    let stab1:Card=new Card("stab1",0,Playground.CASA,CardType.STAB,1,false,media);
    let stab2:Card=new Card("stab2",0,Playground.CASA,CardType.STAB,2,false,media);
    let stab3:Card=new Card("stab3",0,Playground.CASA,CardType.STAB,3,false,media);
    let stab4:Card=new Card("stab4",0,Playground.CASA,CardType.STAB,4,false,media);
    let stab5:Card=new Card("stab5",0,Playground.CASA,CardType.STAB,5,false,media);
    let stab6:Card=new Card("stab6",0,Playground.CASA,CardType.STAB,6,false,media);
    let stab7:Card=new Card("stab7",0,Playground.CASA,CardType.STAB,7,false,media);
    let stab8:Card=new Card("stab8",0,Playground.CASA,CardType.STAB,8,false,media);
    let stab9:Card=new Card("stab9",0,Playground.CASA,CardType.STAB,9,false,media);
    let stab10:Card=new Card("stab10",0,Playground.CASA,CardType.STAB,10,false,media);

    let schwert1:Card=new Card("schwert1",0,Playground.CASA,CardType.SCHWERT,1,false,media);
    let schwert2:Card=new Card("schwert2",0,Playground.CASA,CardType.SCHWERT,2,false,media);
    let schwert3:Card=new Card("schwert3",0,Playground.CASA,CardType.SCHWERT,3,false,media);
    let schwert4:Card=new Card("schwert4",0,Playground.CASA,CardType.SCHWERT,4,false,media);
    let schwert5:Card=new Card("schwert5",0,Playground.CASA,CardType.SCHWERT,5,false,media);
    let schwert6:Card=new Card("schwert6",0,Playground.CASA,CardType.SCHWERT,6,false,media);
    let schwert7:Card=new Card("schwert7",0,Playground.CASA,CardType.SCHWERT,7,false,media);
    let schwert8:Card=new Card("schwert8",0,Playground.CASA,CardType.SCHWERT,8,false,media);
    let schwert9:Card=new Card("schwert9",0,Playground.CASA,CardType.SCHWERT,9,false,media);
    let schwert10:Card=new Card("schwert10",0,Playground.CASA,CardType.SCHWERT,10,false,media);

    newGame.cards.push(geld1);
    newGame.cards.push(geld2);
    newGame.cards.push(geld3);
    newGame.cards.push(geld4);
    newGame.cards.push(geld5);
    newGame.cards.push(geld6);
    newGame.cards.push(geld7);
    newGame.cards.push(geld8);
    newGame.cards.push(geld9);
    newGame.cards.push(geld10);

    newGame.cards.push(pokal1);
    newGame.cards.push(pokal2);
    newGame.cards.push(pokal3);
    newGame.cards.push(pokal4);
    newGame.cards.push(pokal5);
    newGame.cards.push(pokal6);
    newGame.cards.push(pokal7);
    newGame.cards.push(pokal8);
    newGame.cards.push(pokal9);
    newGame.cards.push(pokal10);

    newGame.cards.push(stab1);
    newGame.cards.push(stab2);
    newGame.cards.push(stab3);
    newGame.cards.push(stab4);
    newGame.cards.push(stab5);
    newGame.cards.push(stab6);
    newGame.cards.push(stab7);
    newGame.cards.push(stab8);
    newGame.cards.push(stab9);
    newGame.cards.push(stab10);

    newGame.cards.push(schwert1);
    newGame.cards.push(schwert2);
    newGame.cards.push(schwert3);
    newGame.cards.push(schwert4);
    newGame.cards.push(schwert5);
    newGame.cards.push(schwert6);
    newGame.cards.push(schwert7);
    newGame.cards.push(schwert8);
    newGame.cards.push(schwert9);
    newGame.cards.push(schwert10);

    newGame.shuffle();

    newGame.cards[0].pos=0;
    newGame.cards[0].playground=Playground.PLAY;
    newGame.cards[1].pos=1;
    newGame.cards[1].playground=Playground.PLAY;
    newGame.cards[2].pos=2;
    newGame.cards[2].playground=Playground.PLAY;
    newGame.cards[3].pos=3;
    newGame.cards[3].playground=Playground.PLAY;

    newGame.cards[4].pos=0;
    newGame.cards[4].playground=Playground.PLAYER;
    newGame.cards[5].pos=1;
    newGame.cards[5].playground=Playground.PLAYER;
    newGame.cards[6].pos=2;
    newGame.cards[6].playground=Playground.PLAYER;

    newGame.cards[7].pos=0;
    newGame.cards[7].playground=Playground.COMPUTER;
    newGame.cards[8].pos=1;
    newGame.cards[8].playground=Playground.COMPUTER;
    newGame.cards[9].pos=2;
    newGame.cards[9].playground=Playground.COMPUTER;

    newGame.mode=PlayMode.ON_PLAY;
    return newGame;
}

function randomMove(game: ScopaQuindici, player: Playground): void {
    const handCards = game.getCardsByPlayground(player);
    if (handCards.length === 0) return;

    const tableCards = game.getCardsByPlayground(Playground.PLAY);
    const permutations = game.getPermutations(tableCards.length);

    const allValidMoves: CardSet[] = [];
    for (const card of handCards) {
        game.permutationsSearch(permutations, card, tableCards, allValidMoves);
    }

    let handCard: Card;
    if (allValidMoves.length > 0) {
        const chosen = allValidMoves[Math.floor(Math.random() * allValidMoves.length)];
        for (const card of chosen.setOfPermutations) {
            card.marked = true;
        }
        handCard = chosen.playerCard;
    } else {
        handCard = handCards[Math.floor(Math.random() * handCards.length)];
    }

    handCard.marked = true;
    handCard.justPlayed = true;
    handCard.playground = Playground.PLAY;
    handCard.pos = game.lastPos + 1;
    game.lastPos++;
}

function getActivePlayer(counter:number):Playground{
    if(counter%2==0) {
        return Playground.PLAYER;
    }else{
        return Playground.COMPUTER;
    }
}
function getOtherPlayer(counter:number):Playground{
    if(counter%2==0) {
        return Playground.COMPUTER;
    }else{
        return Playground.PLAYER;
    }
}
function simulate(computerStrategy: BaseScoringStrategy = new HardScoringStrategy(), playerStrategy: BaseScoringStrategy = null, label: string = "Hard") {
    let scoreComputer1=0;
    let scoreComputer2=0;
    let scopa1=0;
    let scopa2=0;
    let denari1=0;
    let denari2=0;
    let carte1=0;
    let carte2=0;
    let bello1=0;
    let bello2=0;
    let primera1=0;
    let primera2=0;

    for(let i=0;i<10000;i++) {
        let simGame = createGame();

        simGame.scoringStrategy = computerStrategy;
        simGame.activePlayer = Playground.COMPUTER;
        simGame.checkScopaAtBegin();
        while (!simGame.isEndOfSimulatedGame()) {
            simGame.activePlayer = Playground.COMPUTER;
            simGame.computerMove(Playground.COMPUTER);
            simGame.checkPlaygroundPlay(true);
            simGame.arrangeCardsOnPlaygroundPlay();
            simGame.demark();
            simGame.activePlayer = Playground.PLAYER;
            if (playerStrategy) {
                simGame.scoringStrategy = playerStrategy;
                simGame.computerMove(Playground.PLAYER);
                simGame.scoringStrategy = computerStrategy;
            } else {
                randomMove(simGame, Playground.PLAYER);
            }
            simGame.checkPlaygroundPlay(true);
            simGame.arrangeCardsOnPlaygroundPlay();
            simGame.demark();
        }
        simGame.score.calculate(simGame);
        scopa1+=simGame.score.scopaComputer;
        scopa2+=simGame.score.scopaPlayer1;
        denari1+=simGame.score.denariCountComputer;
        denari2+=simGame.score.denariCountPlayer1;
        carte1+=simGame.score.cardCountComputer;
        carte2+=simGame.score.cardCountPlayer1;
        bello1+=simGame.score.setteBello==Playground.COMPUTER?1:0;
        bello2+=simGame.score.setteBello==Playground.PLAYER?1:0;
        primera1+=simGame.score.primera==Playground.COMPUTER?1:0;
        primera2+=simGame.score.primera==Playground.PLAYER?1:0;
        scoreComputer1 += simGame.score.scoreComputer;
        scoreComputer2 += simGame.score.scorePlayer1;
    }
    console.log(`Computer [${label}]: `+scoreComputer1 + " (" + (1/(scoreComputer1+scoreComputer2)*scoreComputer1*100).toFixed(1)+"%)");
    console.log("  scopa: "+scopa1 + ", denari: "+denari1 +", carte: "+carte1 +", 7 bello: " +bello1 +", primera: "+primera1);
    console.log("Player [Random]: "+scoreComputer2+ " (" + (1/(scoreComputer1+scoreComputer2)*scoreComputer2*100).toFixed(1)+"%)");
    console.log("  scopa: "+scopa2 + ", denari: "+denari2 +", carte: "+carte2 +", 7 bello: " +bello2 +", primera: "+primera2);
}
//simulate(new HardScoringStrategy(), null,                        "Hard vs Random");
//simulate(new HardScoringStrategy(), new EasyScoringStrategy(),  "Hard vs Easy");