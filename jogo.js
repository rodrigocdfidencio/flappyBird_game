const sprites = new Image();
sprites.src = './sprites.png';

const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

let frames = 0;

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY) {
        return true;
    } return false;
}

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura:33,
        altura: 24,
        x: 10,
        y: 50,
        velocidade: 0,
        gravidade: 0.25,
        pulo: 4.6,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo;
        },
        atualiza() {
            if(fazColisao(flappyBird, globais.chao)) {
                som_HIT.play();

                setTimeout(() => {
                mudaTela(telas.INICIO);
                }, 500);
                
                return;
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0 }, // asa pra cima
            { spriteX: 0, spriteY: 26 }, // asa meio
            { spriteX: 0, spriteY: 52 }, // asa pra baixo
            { spriteX: 0, spriteY: 26 }, // asa meio
        ],
        frameAtual: 0,
        atualizaFrameAtual() {
            const intervaloFrame = 10;
            const passouIntervalo = frames % intervaloFrame === 0;

            if(passouIntervalo) {
            const baseDoIncremento = 1;
            const incremento = baseDoIncremento + flappyBird.frameAtual;
            const baseRepeticao = flappyBird.movimentos.length;
            flappyBird.frameAtual = incremento % baseRepeticao; 
            }
            
        },
        desenha() {
            flappyBird.atualizaFrameAtual();

            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            
            contexto.drawImage(
                sprites,
                spriteX, spriteY,
                flappyBird.largura, flappyBird.altura,
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        }
    }
    return flappyBird;
}

function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura:224,
        altura: 112,
        x: 0,
        y: canvas.height - 122,
        atualiza() {
            const moveChao = 1;
            const repete = chao.largura / 2;
            const movimentacao = chao.x -moveChao;
            chao.x = movimentacao % repete;
        },
        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,
            );
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            );
        }
    }
    return chao;
};

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenha() {
            

            canos.pares.forEach(function(par){
                const yRandom = par.y;
                const espacoCanos = 90;
                // Cano Ceu
            const canoCeuX = par.x;
            const canoCeuY = yRandom;

            contexto.drawImage(
                sprites,
                canos.ceu.spriteX, canos.ceu.spriteY,
                canos.largura, canos.altura,
                canoCeuX, canoCeuY,
                canos.largura, canos.altura,
            )
            // Cano Chao
            const canoChaoX = par.x;
            const canoChaoY = canos.altura + espacoCanos + yRandom;

            contexto.drawImage(
                sprites,
                canos.chao.spriteX, canos.chao.spriteY,
                canos.largura, canos.altura,
                canoChaoX, canoChaoY,
                canos.largura, canos.altura,
            )

            par.canoCeu = {
                x: canoCeuX,
                y: canos.altura + canoCeuY,
            }
            par.canoChao = {
                x: canoChaoX,
                y: canoChaoY,
            }
            })
            
        },
        colisaoComFlappy(par) {
            const cabecaFlappy = globais.flappyBird.y;
            const peFlappy = globais.flappyBird.y + globais.flappyBird.altura;

            if(globais.flappyBird.x >= par.x) {
                if(cabecaFlappy <= par.canoCeu.y) {
                    return true;
                }
                if(peFlappy >= par.canoChao.y) {
                    return true;
                }
            }
            return false;
        },

        pares: [],
        atualiza() {
            const passou100frames = frames % 100 === 0;
            if(passou100frames) {
                canos.pares.push(
                    {
                        x: canvas.width,
                        y: -150 * (Math.random() + 1),
                    }, 
                )
            }
            canos.pares.forEach(function(par){
                par.x = par.x -2;

                if(canos.colisaoComFlappy(par)) {
                    mudaTela(telas.INICIO);
                }

                if(par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
            });
        }
    }
    return canos;
}


const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura:275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height);
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    }
}

const mensagemGetReady = {
    spriteX: 134,
    spriteY: 0,
    largura:174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.spriteX, mensagemGetReady.spriteY,
            mensagemGetReady.largura, mensagemGetReady.altura,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.largura, mensagemGetReady.altura,
        );
    }
}

//Telas
const globais = {};
let telaAtiva = {};

function mudaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

function criaPlacar() {
    const placar = {
        pontuacao: 0,
        desenha() {
            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'white';
            contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
            placar.pontuacao;
        },
        atualiza() {
            const intervaloFrame = 20;
            const passouIntervalo = frames % intervaloFrame === 0;
            if(passouIntervalo) {
                placar.pontuacao = placar.pontuacao + 1;
            }
            
        },
    };
    return placar;
}

const telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            mensagemGetReady.desenha();
            
        },
        click() {
            mudaTela(telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza();
            
        }
    },
    JOGO: {
        inicializa() {
            globais.placar = criaPlacar();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.canos.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            globais.placar.desenha();
        },
        click() {
            globais.flappyBird.pula();
        },
        atualiza() {
            globais.flappyBird.atualiza();
            globais.canos.atualiza();
            globais.chao.atualiza();
            globais.placar.atualiza();
        }
    },
    GAME_OVER: {
        inicializa() {
            globais.placar = criaPlacar();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.canos.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            globais.placar.desenha();
        },
        click() {
            mudaTela(telas.INICIO);
        },
        atualiza() {
            globais.flappyBird.atualiza();
            globais.canos.atualiza();
            globais.chao.atualiza();
            globais.placar.atualiza();
        }
    }
};

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    
    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaTela(telas.INICIO);
loop();
