import {Game} from "../app/game";
import {Score} from "../app/score";
import {ScopaMediaMock} from "./simulate";
import {Playground, SpecialEffects} from "../app/specialEffects";
import {Card, CardType} from "../app/card";
import {Scopa} from "../app/scopaGame";
import {CardSet} from "../app/cardSet";

let media=new ScopaMediaMock();
let geld1;
let geld2;
let geld3;
let geld4;
let geld5;
let geld6;
let geld7;
let geld8;
let geld9;
let geld10;

let pokal1;
let pokal2;
let pokal3;
let pokal4;
let pokal5;
let pokal6;
let pokal7;
let pokal8;
let pokal9;
let pokal10;

let stab1;
let stab2;
let stab3;
let stab4;
let stab5;
let stab6;
let stab7;
let stab8;
let stab9;
let stab10;

let schwert1;
let schwert2;
let schwert3;
let schwert4;
let schwert5;
let schwert6;
let schwert7;
let schwert8;
let schwert9;
let schwert10;

export function createGame():Game {
    let score=new Score();

    let specialEffects=new SpecialEffects(media);
    let newGame = new Scopa(specialEffects,score,media);

    geld1=new Card("geld1",0,Playground.GESPIELT_PLAYER,CardType.GELD,1,false,media);
    geld2=new Card("geld2",0,Playground.GESPIELT_PLAYER,CardType.GELD,2,false,media);
    geld3=new Card("geld3",0,Playground.GESPIELT_PLAYER,CardType.GELD,3,false,media);
    geld4=new Card("geld4",0,Playground.GESPIELT_PLAYER,CardType.GELD,4,false,media);
    geld5=new Card("geld5",0,Playground.GESPIELT_PLAYER,CardType.GELD,5,false,media);
    geld6=new Card("geld6",0,Playground.GESPIELT_PLAYER,CardType.GELD,6,false,media);
    geld7=new Card("geld7",0,Playground.GESPIELT_PLAYER,CardType.GELD,7,false,media);
    geld8=new Card("geld8",0,Playground.GESPIELT_PLAYER,CardType.GELD,8,false,media);
    geld9=new Card("geld9",0,Playground.GESPIELT_PLAYER,CardType.GELD,9,false,media);
    geld10=new Card("geld10",0,Playground.GESPIELT_PLAYER,CardType.GELD,10,false,media);

    pokal1=new Card("pokal1",0,Playground.GESPIELT_PLAYER,CardType.POKAL,1,false,media);
    pokal2=new Card("pokal2",0,Playground.GESPIELT_PLAYER,CardType.POKAL,2,false,media);
    pokal3=new Card("pokal3",0,Playground.GESPIELT_PLAYER,CardType.POKAL,3,false,media);
    pokal4=new Card("pokal4",0,Playground.GESPIELT_PLAYER,CardType.POKAL,4,false,media);
    pokal5=new Card("pokal5",0,Playground.GESPIELT_PLAYER,CardType.POKAL,5,false,media);
    pokal6=new Card("pokal6",0,Playground.GESPIELT_PLAYER,CardType.POKAL,6,false,media);
    pokal7=new Card("pokal7",0,Playground.GESPIELT_PLAYER,CardType.POKAL,7,false,media);
    pokal8=new Card("pokal8",0,Playground.GESPIELT_PLAYER,CardType.POKAL,8,false,media);
    pokal9=new Card("pokal9",0,Playground.GESPIELT_PLAYER,CardType.POKAL,9,false,media);
    pokal10=new Card("pokal10",0,Playground.GESPIELT_PLAYER,CardType.POKAL,10,false,media);

    stab1=new Card("stab1",0,Playground.GESPIELT_COMPUTER,CardType.STAB,1,false,media);
    stab2=new Card("stab2",0,Playground.GESPIELT_COMPUTER,CardType.STAB,2,false,media);
    stab3=new Card("stab3",0,Playground.GESPIELT_COMPUTER,CardType.STAB,3,false,media);
    stab4=new Card("stab4",0,Playground.GESPIELT_COMPUTER,CardType.STAB,4,false,media);
    stab5=new Card("stab5",0,Playground.GESPIELT_COMPUTER,CardType.STAB,5,false,media);
    stab6=new Card("stab6",0,Playground.GESPIELT_COMPUTER,CardType.STAB,6,false,media);
    stab7=new Card("stab7",0,Playground.GESPIELT_PLAYER,CardType.STAB,7,false,media);
    stab8=new Card("stab8",0,Playground.GESPIELT_COMPUTER,CardType.STAB,8,false,media);
    stab9=new Card("stab9",0,Playground.GESPIELT_COMPUTER,CardType.STAB,9,false,media);
    stab10=new Card("stab10",0,Playground.GESPIELT_COMPUTER,CardType.STAB,10,false,media);

    schwert1=new Card("schwert1",0,Playground.GESPIELT_COMPUTER,CardType.SCHWERT,1,false,media);
    schwert2=new Card("schwert2",0,Playground.GESPIELT_COMPUTER,CardType.SCHWERT,2,false,media);
    schwert3=new Card("schwert3",0,Playground.GESPIELT_COMPUTER,CardType.SCHWERT,3,false,media);
    schwert4=new Card("schwert4",0,Playground.GESPIELT_COMPUTER,CardType.SCHWERT,4,false,media);
    schwert5=new Card("schwert5",0,Playground.GESPIELT_COMPUTER,CardType.SCHWERT,5,false,media);
    schwert6=new Card("schwert6",0,Playground.GESPIELT_COMPUTER,CardType.SCHWERT,6,false,media);
    schwert7=new Card("schwert7",0,Playground.GESPIELT_COMPUTER,CardType.SCHWERT,7,false,media);
    schwert8=new Card("schwert8",0,Playground.GESPIELT_COMPUTER,CardType.SCHWERT,8,false,media);
    schwert9=new Card("schwert9",0,Playground.GESPIELT_COMPUTER,CardType.SCHWERT,9,false,media)
    schwert10=new Card("schwert10",0,Playground.GESPIELT_COMPUTER,CardType.SCHWERT,10,false,media);

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


    return newGame;
}


test('isEndFalse', () => {
    const game = createGame();
    game.activePlayer=Playground.PLAYER;
    game.cards.forEach(card=>card.playground=Playground.GESPIELT_PLAYER);
    schwert7.justPlayed=true;
    schwert7.playground=Playground.PLAY;
    geld3.playground=Playground.PLAY;
    geld4.playground=Playground.PLAY;
    let end=game.isEnd();
    expect(end).toEqual(false);
});
test('isEndTrue', () => {
    const game = createGame();
    game.activePlayer=Playground.PLAYER;
    game.cards.forEach(card=>card.playground=Playground.GESPIELT_PLAYER);
    schwert7.justPlayed=true;
    schwert7.playground=Playground.PLAY;
    geld3.playground=Playground.PLAY;
    let end=game.isEnd();
    expect(end).toEqual(true);
});

test('permutationsSearch', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.GESPIELT_PLAYER);
    schwert7.justPlayed=true;
    schwert7.playground=Playground.PLAY;

    geld3.playground=Playground.PLAY;
    geld1.playground=Playground.PLAY;
    schwert3.playground=Playground.PLAY;
    let permutations:boolean[][]=game.getPermutations(3);
    let setOfPermutations:CardSet[]=[];
    game.permutationsSearch(permutations, schwert7, [geld3,geld1,schwert3], setOfPermutations);
    expect(setOfPermutations[0].setOfPermutations).toStrictEqual([geld3,geld1,schwert3])
});

test('isPlayerSwitchTrue', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);

    schwert6.justPlayed=true;
    schwert6.marked=true;
    schwert6.playground=Playground.PLAY;

    geld8.playground=Playground.PLAY;
    geld8.marked=false;
    geld3.playground=Playground.PLAY;
    geld3.marked=false;

    let switchGame = game.isPlayerSwitch();
    expect(switchGame).toBe(true);
});

test('isPlayerSwitchTrue2', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);

    schwert9.justPlayed=true;
    schwert9.marked=true;
    schwert9.playground=Playground.PLAY;

    schwert8.playground=Playground.PLAY;
    schwert8.marked=true;
    schwert10.playground=Playground.PLAY;
    schwert10.marked=false;
    schwert1.playground=Playground.PLAY;
    schwert1.marked=true;

    let switchGame = game.isPlayerSwitch();
    expect(switchGame).toBe(true);
});
test('isPlayerSwitchFalse', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);

    schwert7.justPlayed=true;
    schwert7.marked=true;
    schwert7.playground=Playground.PLAY;

    geld3.playground=Playground.PLAY;
    geld3.marked=false;
    geld1.playground=Playground.PLAY;
    geld1.marked=true;
    schwert3.playground=Playground.PLAY;
    schwert3.marked=true;

    let switchGame = game.isPlayerSwitch();
    expect(switchGame).toBe(false);
});
test('isPlayerSwitchWrongCardsFalse', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);

    schwert7.justPlayed=true;
    schwert7.marked=true;
    schwert7.playground=Playground.PLAY;
    pokal7.playground=Playground.PLAY;
    pokal7.marked=false;
    geld3.playground=Playground.PLAY;
    geld3.marked=true;
    geld1.playground=Playground.PLAY;
    geld1.marked=true;
    schwert3.playground=Playground.PLAY;
    schwert3.marked=true;

    let switchGame = game.isPlayerSwitch();
    expect(switchGame).toBe(false);
});
test('getWahrscheinlichkeitDerVerbleibendenKarten_100', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.GESPIELT_PLAYER);
    schwert7.playground=Playground.COMPUTER;
    pokal7.playground=Playground.COMPUTER;
    geld8.playground=Playground.PLAY;
    let wahrscheinlichkeit = game.getProbabilityOfRemainingCards(7,Playground.PLAYER);
    expect(wahrscheinlichkeit).toBe(100);
});
test('getWahrscheinlichkeitDerVerbleibendenKarten_10', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    pokal7.playground=Playground.COMPUTER;
    geld8.playground=Playground.PLAY;
    let wahrscheinlichkeit = game.getProbabilityOfRemainingCards(7,Playground.PLAYER);
    expect(wahrscheinlichkeit).toBe(10);
});

test('getWahrscheinlichkeitDerVerbleibendenKarten_0', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.GESPIELT_PLAYER);
    geld8.playground=Playground.PLAY;
    let wahrscheinlichkeit = game.getProbabilityOfRemainingCards(7,Playground.PLAYER);
    expect(wahrscheinlichkeit).toBe(0);
});

test('scorePermutations_267', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    geld7.playground=Playground.PLAY;
    let cardSet = new CardSet(geld8,[geld7]);
    game.scorePermutations(Playground.PLAYER, cardSet);
    expect(cardSet.score).toBe(267);
});

test('scoreSetteBello1', () => {
    const game = createGame();
    let cardSet = new CardSet(geld8,[geld7]);
    game.scoreSetteBello(cardSet);
    expect(cardSet.score).toBe(100);
});
test('scoreSetteBello2', () => {
    const game = createGame();
    let cardSet = new CardSet(geld7,[geld4,stab4]);
    game.scoreSetteBello(cardSet);
    expect(cardSet.score).toBe(100);
});
test('scoreSetteBello0', () => {
    const game = createGame();
    let cardSet = new CardSet(stab7,[geld4,stab4]);
    game.scoreSetteBello(cardSet);
    expect(cardSet.score).toBe(0);
});
test('scoreScopa100', () => {
    const game = createGame();
    geld4.playground=Playground.PLAY;
    stab4.playground=Playground.PLAY;
    let cardSet = new CardSet(geld7,[geld4,stab4]);
    game.scoreScopa(cardSet);
    expect(cardSet.score).toBe(100);
});
test('scoreScopa0', () => {
    const game = createGame();
    geld4.playground=Playground.PLAY;
    stab4.playground=Playground.PLAY;
    stab10.playground=Playground.PLAY;

    let cardSet = new CardSet(geld7,[geld4,stab4]);
    game.scoreScopa(cardSet);
    expect(cardSet.score).toBe(0);
});

test('scoreDenariGespieltIstBereitsGroesser5', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    geld1.playground=Playground.GESPIELT_PLAYER;
    geld2.playground=Playground.GESPIELT_PLAYER;
    geld3.playground=Playground.GESPIELT_PLAYER;
    geld4.playground=Playground.GESPIELT_PLAYER;
    geld5.playground=Playground.GESPIELT_PLAYER;
    geld6.playground=Playground.GESPIELT_PLAYER;
    let cardSet = new CardSet(geld7,[geld4,stab4]);
    game.scoreDenari(Playground.GESPIELT_PLAYER,cardSet);
    expect(cardSet.score).toBe(-5);
});
test('scoreDenariGespieltWirdGroesser5', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    geld1.playground=Playground.GESPIELT_PLAYER;
    geld10.playground=Playground.GESPIELT_PLAYER;
    geld9.playground=Playground.GESPIELT_PLAYER;
    geld2.playground=Playground.PLAY;
    geld3.playground=Playground.PLAY;
    stab3.playground=Playground.PLAY;
    let cardSet = new CardSet(geld7,[geld3,stab3,geld2]);
    game.scoreDenari(Playground.GESPIELT_PLAYER,cardSet);
    expect(cardSet.score).toBe(100);
});
test('scoreDenariGespieltWirdGroesser', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    geld1.playground=Playground.GESPIELT_PLAYER;
    geld10.playground=Playground.GESPIELT_PLAYER;
    geld2.playground=Playground.PLAY;
    geld3.playground=Playground.PLAY;
    stab3.playground=Playground.PLAY;
    let cardSet = new CardSet(geld7,[geld3,stab3,geld2]);
    game.scoreDenari(Playground.GESPIELT_PLAYER,cardSet);
    expect(cardSet.score).toBe(45);
});
test('scoreAnzahlKartenNoScore', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.GESPIELT_PLAYER);
    let cardSet = new CardSet(geld7,[geld3,stab3,geld2]);
    game.scoreAnzahlKarten(Playground.GESPIELT_PLAYER,cardSet);
    expect(cardSet.score).toBe(0);
});
test('scoreAnzahlKartenScorePerCard', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    let cardSet = new CardSet(geld7,[geld3,stab3,geld2]);
    game.scoreAnzahlKarten(Playground.GESPIELT_PLAYER,cardSet);
    expect(cardSet.score).toBe(20);
});
test('scoreAnzahlKartenZero', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    let cardSet = new CardSet(geld7,[]);
    game.scoreAnzahlKarten(Playground.GESPIELT_PLAYER,cardSet);
    expect(cardSet.score).toBe(5);
});
test('scoreAnzahlKarten100', () => {
    const game = createGame();
    game.cards.forEach(card=>card.value<=5?card.playground=Playground.GESPIELT_PLAYER:card.playground=Playground.CASA);
    pokal3.playground=Playground.CASA;
    let cardSet = new CardSet(geld7,[geld8]);
    game.scoreAnzahlKarten(Playground.GESPIELT_PLAYER,cardSet);
    expect(cardSet.score).toBe(100);
});
test('scorePrimeria100', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    pokal7.playground=Playground.GESPIELT_PLAYER;
    geld7.playground=Playground.GESPIELT_PLAYER;
    stab7.playground=Playground.GESPIELT_PLAYER;
    let cardSet = new CardSet(schwert7,[geld8]);
    game.scorePrimeria(Playground.GESPIELT_PLAYER,cardSet);
    expect(cardSet.score).toBe(100);
});
test('scorePrimeria0', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    pokal7.playground=Playground.GESPIELT_PLAYER;
    geld7.playground=Playground.GESPIELT_PLAYER;
    stab7.playground=Playground.GESPIELT_PLAYER;
    schwert7.playground=Playground.GESPIELT_PLAYER;
    let cardSet = new CardSet(schwert5,[geld10]);
    game.scorePrimeria(Playground.GESPIELT_PLAYER,cardSet);
    expect(cardSet.score).toBe(0);
});
test('scorePrimeriaEachCard1Of26', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);

    let cardSet = new CardSet(schwert7,[geld8]);
    game.scorePrimeria(Playground.GESPIELT_PLAYER,cardSet);
    expect(cardSet.score).toBe(Math.round(100/26*7));
});
test('getCardsByInternalMark', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    geld7.internalMark=true;
    let cardSet:CardSet=game.getCardsByInternalMark(game.cards,geld1);
    expect(cardSet.setOfPermutations).toStrictEqual([geld7]);
});

test('getAllCardsBut', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    geld7.internalMark=true;
    let result:Card[]=game.getAllCardsBut([geld1,geld2,geld3],geld1);
    expect(result).toStrictEqual([geld2,geld3]);
});
test('hasSameCardOnTableFalse', () => {
    const game:Scopa = <Scopa>createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    geld1.marked=false;
    geld2.marked=true;
    geld3.marked=false;
    let isMarked=game.hasSameCardOnTable(2,[geld1,geld2,geld3]);
    expect(isMarked).toBeFalsy();
});
test('hasSameCardOnTableTrue', () => {
    const game:Scopa = <Scopa>createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    geld1.marked=false;
    geld2.marked=true;
    geld3.marked=false;
    let isMarked=game.hasSameCardOnTable(1,[geld1,geld2,geld3]);
    expect(isMarked).toBeTruthy();
});
test('hasSameCardOnTableOnTrueButFalse', () => {
    const game:Scopa = <Scopa>createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    geld1.marked=false;
    stab1.marked=true;
    geld2.marked=false;
    geld3.marked=false;
    let isMarked=game.hasSameCardOnTable(1,[geld1,stab1,geld2,geld3]);
    expect(isMarked).toBeFalsy();
});
test('getCardsByPlayground', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    let cards=game.getCardsByPlayground(Playground.CASA);
    expect(cards).toStrictEqual(game.cards);
});
test('getCandidatesOnTable', () => {
    const game= createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    geld2.playground=Playground.PLAY;
    geld7.playground=Playground.PLAY;
    schwert7.playground=Playground.PLAY;
    let cards=game.getCandidatesOnTable(schwert7);
    expect(cards).toStrictEqual([geld2,geld7]);
});
test('getValueOfCards', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    geld2.playground=Playground.PLAY;
    geld7.playground=Playground.PLAY;
    schwert7.playground=Playground.PLAY;
    let value=game.getValueOfCards([geld2,geld7,schwert7]);
    expect(value).toStrictEqual(16);
});
test('getValueOfCardsOnPlaygroundPlay', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    geld2.playground=Playground.PLAY;
    geld2.marked=true;
    geld7.playground=Playground.PLAY;
    geld7.marked=true;
    schwert7.playground=Playground.PLAY;
    schwert7.marked=false;
    let value=game.getValueOfCardsOnPlaygroundPlay();
    expect(value).toBe(9);
});
test('getValueAfter0', () => {
    const game = createGame();
    game.cards.forEach(card=>card.playground=Playground.CASA);
    geld2.playground=Playground.PLAY;
    geld7.playground=Playground.PLAY;
    schwert7.playground=Playground.PLAY;
    let value=game.getValueAfter([geld7,schwert7,geld2]);
    expect(value).toBe(0);
});
