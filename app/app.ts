import {Game} from "./game";
import {Card, CardType, ChangeCard, HomeCard, IntroCard} from "./card";
import {Playground, PlayMode, SpecialEffects} from "./specialEffects";
import {ScopaMedia, ScopaMediaDomImpl} from "./scopaMedia";
import {Score} from "./score";
import {Scopa} from "./scopaGame";
import {ScopaQuindici} from "./scopaQuindiciGame";
import {EasyScoringStrategy, MediumScoringStrategy} from "./scoringStrategy";

let canvas: HTMLCanvasElement;
export let ctx: CanvasRenderingContext2D;
let cardIntro: IntroCard;
let cardIntro2: IntroCard;
let cardNapoletaneTrevisane: ChangeCard;
let cardHome: HomeCard;
let portraitImg:HTMLImageElement=<HTMLImageElement>document.getElementById("skull_cross_bones");
let game: Game = null;
let specialEffects: SpecialEffects;
let portraitMode=false;
let nickname:string;
let lastMaxHigh=0;
let lastMaxWidth=0;
let portrait=true;
let clickAllowed=true;
let score:Score;
let lastGamestart=Playground.PLAYER;
let media:ScopaMedia;

export function innerWidth():number{
    if(window.orientation !== undefined){
        return Math.round(document.documentElement.clientWidth);
    }
    else if (navigator.appVersion.indexOf("Win")!=-1){
        return Math.round(window.innerWidth-20);
    }
    return Math.round(window.innerWidth);
}

export function innerHeight():number{
    if(window.orientation !== undefined){
        return Math.round(document.documentElement.clientHeight);
    }
    else if (navigator.appVersion.indexOf("Win")!=-1){
        return Math.round(window.innerHeight-20);
    }
    return Math.round(window.innerHeight);
}


function landscapeLoop():void{

}

function gameLoop(): void {
    requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, innerWidth(), innerHeight());
    ctx.beginPath()
    ctx.save();
    if (game == null) {
        displayStartScreen(ctx);
    } else if (isGameStatusEnd()) {
        specialEffects.soundIsOn = false;
        specialEffects.playBackgroundSound();
        game.showScore(ctx, cardIntro,cardIntro2,language,nickname,counter,innerWidth());
    } else {
        specialEffects.playBackgroundSound();
        game.display(ctx);
    }
    ctx.restore();
}

function mouseDown(event: MouseEvent): void {
    if(clickAllowed) {
        switcher();
        let x: number = event.x;
        let y: number = event.y;
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
        if(isCardNapoletaneClicked(x,y)) {
            selectedCard='napoletane';
            window.location.href = "napoletane.html?game="+selectedGame+'&lang='+language+'&card='+selectedCard;
        }else if(isCardTrevisaneClicked(x,y)){
            selectedCard='trevisane';
            window.location.href = "trevisane.html?game="+selectedGame+'&lang='+language+'&card='+selectedCard;
        }else if(isCardHomeClicked(x,y)){
            window.location.href = "index.html?game="+selectedGame+'&lang='+language+'&card='+selectedCard;
         }else if (isStartNewGame(x, y)) {
            startNewGame();
        } else if (isGameStatusEnd() && cardIntro.isClicked(x, y)) {
            startNewGameOnGameEnd();
        } else if (isGameStatusEnd()) {
            // do nothing
        } else if (isGameStatusStart(x,y)) {
            startNewGame();
        } else {
            gameOnPlay(x, y,Playground.PLAYER);
        }
    }
}

function isCardNapoletaneClicked(x: number, y: number): boolean {
    return (game==null && cardNapoletaneTrevisane.isClicked(x,y) &&
        (window.location.href.indexOf("trevisane.html")>=0||window.location.href.endsWith("com/")));
}

function isCardTrevisaneClicked(x: number, y: number): boolean {
    return (game==null && cardNapoletaneTrevisane.isClicked(x,y) &&
        (window.location.href.indexOf("napoletane.html")>=0));
}
export function isCardHomeClicked(x: number, y: number): boolean {
    return (game==null && cardHome.isClicked(x,y));
}

async function gameOnPlay(x: number, y: number, playground: Playground){
    game.mode=PlayMode.ON_PLAY;
    if(Playground.PLAYER==playground) {
        game.cardClicked(x, y);
    }else{
        await game.checkScopaAtBegin();
    }
    if(game.activePlayer==Playground.COMPUTER) {
        clickAllowed=false;
        await delay(200);
        await delay(game.computerMove(Playground.COMPUTER));
        game.checkPlaygroundPlay(true);
        game.arrangeCardsOnPlaygroundPlay();
        game.demark();
        clickAllowed=true;
        if(!game.isEnd()) {
            game.activePlayer = Playground.PLAYER;
        }
        game.stateOfGame();
        game.actionAllowed=true;
    }
}
let counter=1;
let switcherRunning=false;
async function switcher(){
    if(switcherRunning){
        return;
    }
    switcherRunning=true;
    let i =0;
    while(i<6){
        await delay(500);
        if(counter==1){
            counter=2;
        }else{
            counter=1;
        }
        i++;
    }
    counter=1;
    switcherRunning=false;
}

function displayStartScreen(ctx: CanvasRenderingContext2D): void {
    specialEffects.soundIsOn = true;
    ctx.fillStyle = "white";
    ctx.font = "bold 42px serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("Scopa-Quindici.com",(innerWidth()/2),40);
    ctx.drawImage(cardIntro.getImage(Playground.CASA), cardIntro.getPosX(), cardIntro.getPosY(), cardIntro.getWidth(), cardIntro.getHeight());
    if(counter==2) {
        ctx.drawImage(cardIntro2.getImage(Playground.CASA), cardIntro2.getPosX(), cardIntro2.getPosY(), cardIntro2.getWidth(), cardIntro2.getHeight());
    }
    ctx.drawImage(cardNapoletaneTrevisane.getImage(Playground.CASA), cardNapoletaneTrevisane.getPosX(), cardNapoletaneTrevisane.getPosY(), cardNapoletaneTrevisane.getWidth(), cardNapoletaneTrevisane.getHeight());
    ctx.drawImage(cardHome.getImage(Playground.CASA), cardHome.getPosX(), cardHome.getPosY(), cardHome.getWidth(), cardHome.getHeight());
}

function sizeIt() {
    let h = innerHeight();
    let w= innerWidth();
    //ctx.clearRect(0, 0, innerWidth(), innerHeight())
    resample_single(canvas,w,h,true);
}
// Hermite resampling filter — adapted from https://github.com/viliusle/Hermite-resize (MIT License)
function resample_single(canvas: HTMLCanvasElement, width: number, height: number, resize_canvas: boolean): void {
    const width_source = canvas.width;
    const height_source = canvas.height;
    width = Math.round(width);
    height = Math.round(height);

    const ratio_w = width_source / width;
    const ratio_h = height_source / height;
    const ratio_w_half = Math.ceil(ratio_w / 2);
    const ratio_h_half = Math.ceil(ratio_h / 2);

    const ctx = canvas.getContext("2d", {willReadFrequently: true} as any) as CanvasRenderingContext2D;
    const img = ctx.getImageData(0, 0, width_source, height_source);
    const img2 = ctx.createImageData(width, height);
    const data = img.data;
    const data2 = img2.data;

    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            const x2 = (i + j * width) * 4;
            let weight = 0;
            let weights = 0;
            let weights_alpha = 0;
            let gx_r = 0;
            let gx_g = 0;
            let gx_b = 0;
            let gx_a = 0;
            const center_y = (j + 0.5) * ratio_h;
            const yy_start = Math.floor(j * ratio_h);
            const yy_stop = Math.ceil((j + 1) * ratio_h);
            for (let yy = yy_start; yy < yy_stop; yy++) {
                const dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                const center_x = (i + 0.5) * ratio_w;
                const w0 = dy * dy; //pre-calc part of w
                const xx_start = Math.floor(i * ratio_w);
                const xx_stop = Math.ceil((i + 1) * ratio_w);
                for (let xx = xx_start; xx < xx_stop; xx++) {
                    const dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    const w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        //pixel too far
                        continue;
                    }
                    //hermite filter
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    const pos_x = 4 * (xx + yy * width_source);
                    //alpha
                    gx_a += weight * data[pos_x + 3];
                    weights_alpha += weight;
                    //colors
                    if (data[pos_x + 3] < 255)
                        weight = weight * data[pos_x + 3] / 250;
                    gx_r += weight * data[pos_x];
                    gx_g += weight * data[pos_x + 1];
                    gx_b += weight * data[pos_x + 2];
                    weights += weight;
                }
            }
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;
        }
    }
    //clear and resize canvas
    if (resize_canvas === true) {
        canvas.width = width;
        canvas.height = height;
    } else {
        ctx.clearRect(0, 0, width_source, height_source);
    }

    //draw
    ctx.putImageData(img2, 0, 0);
}

function isStartNewGame(x: number, y: number): boolean {
    return cardIntro.isClicked(x, y) && game == null;
}

function makeCards(prefix: string, type: CardType): Card[] {
    return Array.from({length: 10}, (_: unknown, i: number) =>
        new Card(`${prefix}${i + 1}`, 0, Playground.CASA, type, i + 1, false, media));
}

function startNewGame(){
    specialEffects.clearBombImpact();
    let newGame=createGame();
    if(game!=null){
        newGame.activePlayer=game.activePlayer;
    }
    game=newGame;
    sizeIt();
    game.lastPos=4;
    game.stateOfGame();
    game.sizeCheck();
    if(game.activePlayer==Playground.COMPUTER){
        gameOnPlay(0,0,Playground.COMPUTER);
    }else{
        game.checkScopaAtBegin();
    }

    game.specialEffects.soundIsOn = true;
    game.specialEffects.playBackgroundSound();
}

function isGameStatusEnd():boolean{
    return game!=null && game.mode == PlayMode.END;
}

function isGameStatusStart(x:number,y:number):boolean{
    return game.mode == PlayMode.START && cardIntro.isClicked(x, y);
}

function startNewGameOnGameEnd(){
    game.activePlayer=(lastGamestart==Playground.PLAYER)?Playground.COMPUTER:Playground.PLAYER;
    lastGamestart=game.activePlayer;
    startNewGame();
    game.mode = PlayMode.ON_PLAY;
}

function createGame():Game {
    score.reset();
    let newGame = selectedGame=='escopa'?new ScopaQuindici(specialEffects,score,media):new Scopa(specialEffects,score,media);
    if(selectedDifficulty==='easy') newGame.scoringStrategy = new EasyScoringStrategy();
    else if(selectedDifficulty==='medium') newGame.scoringStrategy = new MediumScoringStrategy();
    newGame.setPlayerOneNickname(nickname);

    const allCards = [
        ...makeCards('geld', CardType.GELD),
        ...makeCards('pokal', CardType.POKAL),
        ...makeCards('stab', CardType.STAB),
        ...makeCards('schwert', CardType.SCHWERT),
    ];
    newGame.cards.push(...allCards);

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


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function reload(){
    window.location.reload(false);
}

function getParams(){
    let gameParam=getUrlParameter('game');
    if(gameParam!=''){
        selectedGame=gameParam;
    }
    let langParam=getUrlParameter('lang');
    if(langParam!=''){
        language=langParam;
    }
    let cardParam=getUrlParameter('card');
    if(cardParam!=''){
        selectedCard=cardParam;
    }
    let difficultyParam=getUrlParameter('difficulty');
    if(difficultyParam=='easy' || difficultyParam=='medium' || difficultyParam=='hard'){
        selectedDifficulty=difficultyParam;
    }
    let nicknameParam=getUrlParameter('nickname');
    if(nicknameParam.length>0 && nicknameParam.length<=9){
        nickname=nicknameParam.replace(/[^0-9_a-zA-Z ]/g, "");
    }else{
        nickname='Tu';
    }
}

export function onLoad(){
    getParams();
    switcher();
    score=new Score();
    media = new ScopaMediaDomImpl();
    specialEffects=new SpecialEffects(media);
    cardIntro= new IntroCard('intro',"", CardType.NONE, 0, 0, Playground.PLAY, 613, 756, 1, 1,media);
    cardIntro2= new IntroCard('intro2',"", CardType.NONE, 0, 0, Playground.PLAY, 613, 756, 1, 1,media);
    cardNapoletaneTrevisane = new ChangeCard('other_intro',"", CardType.NONE, 0, 0, Playground.PLAY, 100, 100, 1, 1,media);
    cardHome = new HomeCard('home',"", CardType.NONE, 0, 0, Playground.PLAY, 50, 80, 1, 1,media);
    portrait=screen.availHeight > screen.availWidth;
    window.addEventListener("orientationchange", function() {
        if(portrait){
            portrait=false;
        }else{
            portrait=true;

        }
    });
    canvas = <HTMLCanvasElement>document.getElementById('cnvs');
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.imageSmoothingQuality = "high"
    canvas.addEventListener("mousedown", mouseDown, false);
    window.addEventListener("resize", sizeIt);
    sizeIt();
    gameLoop();
}

///////////////// index /////////////////// Paging ////////////////////// INFO /////////////////////////////////////////


let languageSelector:HTMLInputElement=<HTMLInputElement>document.getElementById("selectLanguage");
let gameSelector:HTMLInputElement=<HTMLInputElement>document.getElementById("selectGame");
let cardSelector:HTMLInputElement=<HTMLInputElement>document.getElementById("selectCard");
let difficultySelector:HTMLInputElement=<HTMLInputElement>document.getElementById("selectDifficulty");
let loadGameSelector:HTMLElement=<HTMLElement>document.getElementById("loadGame");
let formSelector:HTMLFormElement=<HTMLFormElement>document.getElementById("form");

let language='';
let selectedGame='escopa';
let selectedCard='trevisane';
let selectedDifficulty='hard';

function reloadIndexPage(){
    window.location.href='index.html?game='+selectedGame+'&lang='+language+'&card='+selectedCard+'&difficulty='+selectedDifficulty;
}

function getLang(): string {
    const userLang = navigator.language.split(/-|_/)[0];
    if((userLang === 'de') || (userLang === 'en' || userLang === 'it')){
        return userLang;
    }
    return 'it';
}

export function loadGame(){
    const params='?game='+selectedGame+'&lang='+language+'&card='+selectedCard+'&difficulty='+selectedDifficulty;
    window.location.href=(selectedCard=='trevisane' ? 'trevisane.html' : 'napoletane.html') + params;
}

function getUrlParameter(name: string): string {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function onLanguageClick(value: string){
    language=value;
    reloadIndexPage();
}

export function onCardClick(value: string){
    selectedCard=value;
    reloadIndexPage();
}
export function onGameClick(value: string){
    selectedGame=value;
    reloadIndexPage();
}
export function onDifficultyClick(value: string){
    selectedDifficulty=value;
    reloadIndexPage();
}

export function onInfoButtonClick(value: string){
    window.location.href='info_'+language+'.html?game='+selectedGame+'&lang='+language+'&card='+selectedCard;
}

function translate(lang:string){
    nameStartGameButton(language);
}
function nameStartGameButton(lang:string){
    if(lang=='de'){
        loadGameSelector.textContent='Spiel laden';
    }else if(lang=='en'){
        loadGameSelector.textContent='Load game';
    }else{
        loadGameSelector.textContent='Caricare il gioco';
    }
}
export function onIndexLoad() {
    getParams();
    if(language=='') {
        language = getLang();
    }
    languageSelector.value=language;
    gameSelector.value=selectedGame;
    cardSelector.value=selectedCard;
    difficultySelector.value=selectedDifficulty;
    formSelector.action=selectedCard+'.html';
    translate(language);
}

export function onInfoLoad() {
    getParams();
    if(language=='') {
        language = getLang();
    }
    if(selectedCard=='trevisane'){
        document.getElementById('trevisane').style.display='inline-block';
        document.getElementById('napoletane').style.display='none';
    }else{
        document.getElementById('trevisane').style.display='none';
        document.getElementById('napoletane').style.display='inline-block';
    }
    //cardElement
}
export function onHomeClick(){
    window.location.href='index.html?game='+selectedGame+'&lang='+language+'&card='+selectedCard;
}
export function onTrevisaneClick(){
    selectedCard='napoletane';
    window.location.href='info_'+language+'.html?game='+selectedGame+'&lang='+language+'&card='+selectedCard+'#scopa-cards';
}
export function onNapoletaneClick(){
    selectedCard='trevisane';
    window.location.href='info_'+language+'.html?game='+selectedGame+'&lang='+language+'&card='+selectedCard+'#scopa-cards';
}
