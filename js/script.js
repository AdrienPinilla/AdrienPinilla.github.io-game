const config = { 
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y:300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload(){

    //=========== Chargement du sol et du background ===========================
    this.load.image('tileset', 'oak_woods_v1.0/oak_woods_tileset.png');
    this.load.image('background_1', 'oak_woods_v1.0/background/background_layer_1.png');
    this.load.image('background_2', 'oak_woods_v1.0/background/background_layer_2.png');
    this.load.image('background_3', 'oak_woods_v1.0/background/background_layer_3.png');
    this.load.image('backgroundColor', 'oak_woods_v1.0/background/background_color.png')


    this.load.audio('hit', ['Sound/Hit and Punch Preview/AUDIO/WHOOSH_ARM_SWING_01.wav']);

    //=================== Chargement des sprites du personnage =======================
    this.load.spritesheet('idle', 'Martial Hero/Sprites/idle4.png',
    {frameWidth : 50, frameHeight: 70}
    );

    this.load.spritesheet('run', 'Martial Hero/Sprites/run4.png',
    {frameWidth: 50, frameHeight: 70}
    );

    this.load.spritesheet('fall', 'Martial Hero/Sprites/fall4.png',
    {frameWidth: 50, frameHeight: 70}
    );

    this.load.spritesheet('jump', 'Martial Hero/Sprites/jump4.png',
    {frameWidth: 50, frameHeight: 70}
    );

    this.load.spritesheet('attack', 'Martial Hero/Sprites/attack_2.png',
    {frameWidth: 130, frameHeight: 70}
    );

    //======================= Chargement du tileset =================================
    this.load.tilemapTiledJSON('tilemap', 'oak_woods_v1.0/map.json');
}

let player;
// let attack_sound;
let cursors;

function create(){

    //==================== Création du background ===========================
    let x =0;
    this.add.image(0, 0, 'backgroundColor').setOrigin(0,0);
    for (let i = 0; i < 4; i++) {
        this.add.image(x,0, 'background_1').setOrigin(0,0);
        this.add.image(x,0, 'background_2').setOrigin(0,0);
        this.add.image(x,0, 'background_3').setOrigin(0,0);
        x +=320;
    }

   

    //==================== Création des plateformes =========================
    
    const map = this.make.tilemap({key: 'tilemap'});

    const tileset = map.addTilesetImage('Oak_Forest', 'tileset', 24, 24);

    //map.createLayer('backgroud1', tileset);
    let platforms = map.createLayer('ground', tileset);

    //platforms = this.physics.add.staticGroup();
    
    //================== Ajout de la colision sur les plateforme ================
    platforms.setCollisionByProperty({ estSolide: true });

    //================== Création du personnage =============================
    player = this.physics.add.sprite(50, 0, 'idle');

    player.setBounce(0);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms); // => ajout de callision entre le joueur et les plateformes


    //======================= Création des sons =============================

    this.attack_sound = this.sound.add('hit', {
        volume: 1,
        loop: false
    });

    //========================= Créations des animation du personnage ======================
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('run', {start: 0, end: 7}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('idle', {start: 0, end: 7}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'fall',
        frames: this.anims.generateFrameNumbers('fall', {start: 0, end: 1}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('jump', {start: 0, end: 1}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('attack', {start: 3, end: 5}),
        frameRate: 10,
    });

    //========================= Configuration du clavier =====================
    cursors = this.input.keyboard.createCursorKeys();

    const camera = this.cameras.main;
    camera.setZoom(1.5);

}

function update(){
    
    if(cursors.right.isDown && !cursors.space.isDown){
        if(!cursors.up.isDown){
            player.anims.play('run', true);
        }
        player.setVelocityX(160);
        
        player.flipX = false;
    }else if (cursors.left.isDown && !cursors.space.isDown) {
        player.setVelocityX(-160);
        if(!cursors.up.isDown){
            player.anims.play('run', true);
        }
        player.flipX = true;
    }
    else if (player.body.blocked.down && !cursors.space.isDown){
        player.setVelocityX(0);
        player.anims.play('idle', true);
    }

    
    if(!player.body.blocked.down && !cursors.up.isDown && !cursors.space.isDown){
        player.anims.play('fall', true);
    }

    if(cursors.up.isDown && (player.body.blocked.down || player.body.blocked.left || player.body.blocked.right) && !cursors.space.isDown){
        player.setVelocityY(-200);
        player.anims.play('jump', true);
    }

    if(Phaser.Input.Keyboard.JustDown(cursors.space)){
        player.setVelocityX(0);
        this.sound.play('hit');
        player.anims.play('attack', true);

    }


    this.physics.world.setBounds(0, 0, 1104, 720);
//  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 1104, 720);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(player);  
}