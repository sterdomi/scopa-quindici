import {Score} from "../app/score";
import {Playground, SpecialEffects} from "../app/specialEffects";
import {Card, CardType} from "../app/card";
import {ScopaMedia} from "../app/scopaMedia";
import {ScopaMediaMock} from "./simulate";
import {createGame} from "./scopa.test";

test('valueOfPrimeraMax', () => {
    const score:Score = new Score();
    const media:ScopaMedia=new ScopaMediaMock();
    let geld7:Card=new Card("geld7",0,Playground.CASA,CardType.GELD,7,false,media);
    let pokal7:Card=new Card("pokal7",0,Playground.CASA,CardType.POKAL,7,false,media);
    let stab7:Card=new Card("stab7",0,Playground.CASA,CardType.STAB,7,false,media);
    let schwert7:Card=new Card("schwert7",0,Playground.CASA,CardType.SCHWERT,7,false,media);
    let valueOfPrimera = score.getValueOfPrimera([geld7,pokal7,stab7,schwert7]);
    expect(valueOfPrimera).toBe(28);
});

test('valueOfPrimeraMin', () => {
    const score:Score = new Score();
    const media:ScopaMedia=new ScopaMediaMock();
    let geld1:Card=new Card("geld1",0,Playground.CASA,CardType.GELD,1,false,media);
    let pokal1:Card=new Card("pokal1",0,Playground.CASA,CardType.POKAL,1,false,media);
    let stab1:Card=new Card("stab1",0,Playground.CASA,CardType.STAB,1,false,media);
    let schwert1:Card=new Card("schwert1",0,Playground.CASA,CardType.SCHWERT,1,false,media);
    let valueOfPrimera = score.getValueOfPrimera([geld1,pokal1,stab1,schwert1]);
    expect(valueOfPrimera).toBe(4);
});

test('scopa', () => {
    const score:Score = new Score();
    score.scopa(Playground.PLAYER);
    score.scopa(Playground.PLAYER);
    score.scopa(Playground.COMPUTER);
    score.scopa(Playground.COMPUTER);
    score.scopa(Playground.COMPUTER);
    expect(score.scopaPlayer1).toBe(2);
    expect(score.scopaComputer).toBe(3);
});

test('calculate', () => {
   const game=createGame();
    const score:Score = new Score();
    score.scopa(Playground.PLAYER);
    score.scopa(Playground.COMPUTER);
    score.scopa(Playground.COMPUTER);
    score.calculate(game);
    expect(score.scorePlayer1).toBe(5);
    expect(score.scoreComputer).toBe(2);
    expect(score.denari).toBe(Playground.PLAYER);
    expect(score.setteBello).toBe(Playground.PLAYER);
    expect(score.cardCountComputer).toBe(19);
    expect(score.cardCountPlayer1).toBe(21);
    game.cards[26].playground=Playground.GESPIELT_COMPUTER;
    score.reset();
    expect(score.scorePlayer1).toBe(5);
    expect(score.scoreComputer).toBe(2);
    expect(score.denari).toBe(undefined);
    expect(score.setteBello).toBe(undefined);
    expect(score.cardCountComputer).toBe(0);
    expect(score.cardCountPlayer1).toBe(0)
    score.calculate(game);
    expect(score.scorePlayer1).toBe(7);
    expect(score.scoreComputer).toBe(2);
    expect(score.denari).toBe(Playground.PLAYER);
    expect(score.setteBello).toBe(Playground.PLAYER);
    expect(score.cardCountComputer).toBe(20);
    expect(score.cardCountPlayer1).toBe(20);

});

test('reset', () => {
   const game=createGame();
    const score:Score = new Score();
    score.scopa(Playground.PLAYER);
    score.scopa(Playground.COMPUTER);
    score.scopa(Playground.COMPUTER);
    score.calculate(game);
    expect(score.scorePlayer1).toBe(5);
    expect(score.scoreComputer).toBe(2);
    expect(score.denari).toBe(Playground.PLAYER);
    expect(score.setteBello).toBe(Playground.PLAYER);
    expect(score.cardCountComputer).toBe(19);
    expect(score.cardCountPlayer1).toBe(21);
});