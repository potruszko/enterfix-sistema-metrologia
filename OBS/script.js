/**
 * ENTERFIX Broadcast Overlay Control System v2.0
 * Sistema Profissional com Controle de Cenas e Timing Automático
 */

// Namespace principal
window.enterfix = {
    // Estado global dos componentes
    state: {
        currentScene: 'scene-1',
        lowerThird: { visible: false, animating: false, timer: null },
        specs: { visible: false, animating: false, timer: null },
        ticker: { visible: false, animating: false, timer: null },
        logo: { visible: false, animating: false },
        autoHideDelay: 12000 // 12 segundos padrão
    },

    // Configurações das cenas
    scenes: {
        'scene-1': { // Abertura & Encerramento
            name: 'Abertura & Encerramento',
            autoShow: ['logo', 'lowerThird'],
            defaultLowerThird: { name: 'Paulo Otavio Truszko', title: 'CEO Enterfix' }
        },
        'scene-2': { // Apresentação (Slides)
            name: 'Apresentação',
            autoShow: ['logo', 'ticker'],
            defaultTicker: 'ENTERFIX - 15 Anos Revolucionando a Metrologia Industrial • Precisão que Transforma Resultados'
        },
        'scene-3': { // Cabine de Comando
            name: 'Cabine de Comando',
            autoShow: ['logo'],
            splitFrame: true
        },
        'scene-4': { // Foco no Software
            name: 'Foco no Software',
            autoShow: ['specs'],
            defaultSpecs: ['Precisão: ±3µm + L/200', 'Resolução: 0.5µm', 'Velocidade: 150mm/s', 'Repetibilidade: 0.2µm']
        },
        'scene-5': { // A Máquina
            name: 'A Máquina',
            autoShow: ['logo', 'lowerThird'],
            defaultLowerThird: { name: 'PEAK 400', title: 'Solução Manaus' }
        },
        'scene-6': { // O Detalhe
            name: 'O Detalhe',
            autoShow: ['logo'],
            minimal: true
        }
    },

    // Sistema de Controle de Cenas
    sceneManager: {
        /**
         * Muda para uma cena específica
         * @param {string} sceneId - ID da cena (scene-1, scene-2, etc.)
         * @param {Object} options - Opções customizadas
         */
        async switchTo(sceneId, options = {}) {
            console.log(`🎥 Mudando para: ${enterfix.scenes[sceneId]?.name || sceneId}`);
            
            // Esconde todos os elementos atuais
            await this.hideAll();
            
            // Atualiza classe do body
            document.body.className = sceneId;
            enterfix.state.currentScene = sceneId;
            
            // Aguarda um pouco para smooth transition
            await enterfix.utils.wait(500);
            
            // Mostra elementos da nova cena
            const scene = enterfix.scenes[sceneId];
            if (scene) {
                for (const component of scene.autoShow || []) {
                    await this.showComponent(component, scene, options);
                    await enterfix.utils.wait(200);
                }
            }
        },
        
        async showComponent(component, scene, options) {
            switch(component) {
                case 'logo':
                    await enterfix.logo.show();
                    break;
                case 'lowerThird':
                    const ltData = options.lowerThird || scene.defaultLowerThird;
                    if (ltData) {
                        await enterfix.lowerThird.show(ltData.name, ltData.title, options.autoHide !== false);
                    }
                    break;
                case 'specs':
                    const specs = options.specs || scene.defaultSpecs;
                    if (specs) {
                        await enterfix.specs.show(specs, options.autoHide !== false);
                    }
                    break;
                case 'ticker':
                    const ticker = options.ticker || scene.defaultTicker;
                    if (ticker) {
                        await enterfix.ticker.show(ticker, options.autoHide !== false);
                    }
                    break;
            }
        },
        
        async hideAll() {
            await Promise.all([
                enterfix.lowerThird.hide(),
                enterfix.specs.hide(), 
                enterfix.ticker.hide()
            ]);
        }
    },
    utils: {
        /**
         * Aguarda um tempo específico
         * @param {number} ms - Milissegundos para aguardar
         */
        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        /**
         * Aplica uma classe com delay para animações staggered
         * @param {NodeList} elements - Elementos para animar
         * @param {string} className - Classe a ser aplicada
         * @param {number} delay - Delay entre elementos (ms)
         */
        async staggerClass(elements, className, delay = 100) {
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.add(className);
                if (i < elements.length - 1) {
                    await this.wait(delay);
                }
            }
        }
    },

    // Controle do Lower Third (Identificação)
    lowerThird: {
        element: null,

        init() {
            this.element = document.getElementById('lower-third');
            return this;
        },

        /**
         * Mostra o lower third com nome e cargo
         * @param {string} name - Nome da pessoa
         * @param {string} title - Cargo/função
         * @param {boolean} autoHide - Se deve esconder automaticamente
         */
        async show(name, title, autoHide = true) {
            if (enterfix.state.lowerThird.animating) return;
            
            // Limpa timer anterior se existir
            if (enterfix.state.lowerThird.timer) {
                clearTimeout(enterfix.state.lowerThird.timer);
            }
            
            enterfix.state.lowerThird.animating = true;

            // Atualiza conteúdo
            document.getElementById('lt-name').textContent = name;
            document.getElementById('lt-title').textContent = title;

            // Remove animações anteriores dos textos
            const texts = this.element.querySelectorAll('.primary-text, .secondary-text');
            texts.forEach(text => text.style.animation = 'none');

            // Força reflow para reiniciar animações
            this.element.offsetHeight;

            // Mostra container
            this.element.classList.add('show');

            // Reaplica animações dos textos
            await enterfix.utils.wait(300);
            texts[0].style.animation = 'slideInText 0.6s cubic-bezier(0.4, 0, 0.2, 1) both';
            texts[1].style.animation = 'slideInText 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both';

            enterfix.state.lowerThird.visible = true;
            enterfix.state.lowerThird.animating = false;
            
            // Auto-hide se solicitado
            if (autoHide) {
                enterfix.state.lowerThird.timer = setTimeout(() => {
                    this.hide();
                }, enterfix.state.autoHideDelay);
            }
        },

        /**
         * Esconde o lower third
         */
        async hide() {
            if (enterfix.state.lowerThird.animating || !enterfix.state.lowerThird.visible) return;
            
            enterfix.state.lowerThird.animating = true;

            this.element.classList.remove('show');
            
            await enterfix.utils.wait(800);
            enterfix.state.lowerThird.visible = false;
            enterfix.state.lowerThird.animating = false;
        }
    },

    // Controle do Info Panel (Especificações)
    specs: {
        element: null,
        header: null,
        list: null,

        init() {
            this.element = document.getElementById('info-panel');
            this.header = this.element.querySelector('.panel-header');
            this.list = this.element.querySelector('.specs-list');
            return this;
        },

        /**
         * Mostra o painel de especificações
         * @param {Array} specs - Array de strings com as especificações
         * @param {boolean} autoHide - Se deve esconder automaticamente
         */
        async show(specs, autoHide = true) {
            if (enterfix.state.specs.animating) return;
            
            // Limpa timer anterior se existir
            if (enterfix.state.specs.timer) {
                clearTimeout(enterfix.state.specs.timer);
            }
            
            enterfix.state.specs.animating = true;

            // Limpa conteúdo anterior
            this.list.innerHTML = '';

            // Cria itens das specs
            specs.forEach(spec => {
                const item = document.createElement('div');
                item.className = 'spec-item';
                
                // Procura por padrão "Label: Valor" para destacar valor
                const parts = spec.split(':');
                if (parts.length === 2) {
                    item.innerHTML = `${parts[0].trim()}: <span class="spec-value">${parts[1].trim()}</span>`;
                } else {
                    item.textContent = spec;
                }
                
                this.list.appendChild(item);
            });

            // Anima entrada do header
            this.header.classList.add('show');

            // Anima itens com stagger
            await enterfix.utils.wait(200);
            const items = this.list.querySelectorAll('.spec-item');
            await enterfix.utils.staggerClass(items, 'show', 150);

            enterfix.state.specs.visible = true;
            enterfix.state.specs.animating = false;
            
            // Auto-hide se solicitado
            if (autoHide) {
                enterfix.state.specs.timer = setTimeout(() => {
                    this.hide();
                }, enterfix.state.autoHideDelay);
            }
        },

        /**
         * Esconde o painel de especificações
         */
        async hide() {
            if (enterfix.state.specs.animating || !enterfix.state.specs.visible) return;
            
            enterfix.state.specs.animating = true;

            // Remove classes em ordem reversa
            const items = Array.from(this.list.querySelectorAll('.spec-item')).reverse();
            for (const item of items) {
                item.classList.remove('show');
                await enterfix.utils.wait(100);
            }

            await enterfix.utils.wait(200);
            this.header.classList.remove('show');

            await enterfix.utils.wait(600);
            enterfix.state.specs.visible = false;
            enterfix.state.specs.animating = false;
        }
    },

    // Controle do Ticker
    ticker: {
        element: null,
        textElement: null,

        init() {
            this.element = document.getElementById('ticker');
            this.textElement = document.getElementById('ticker-text');
            return this;
        },

        /**
         * Mostra o ticker com texto
         * @param {string} text - Texto a ser exibido
         * @param {boolean} autoHide - Se deve esconder automaticamente
         */
        async show(text, autoHide = true) {
            if (enterfix.state.ticker.animating) return;
            
            // Limpa timer anterior se existir
            if (enterfix.state.ticker.timer) {
                clearTimeout(enterfix.state.ticker.timer);
            }
            
            enterfix.state.ticker.animating = true;

            // Atualiza texto
            this.textElement.textContent = text;

            // Reset da animação
            this.textElement.style.animation = 'none';
            this.textElement.offsetHeight;

            // Mostra container
            this.element.classList.add('show');

            await enterfix.utils.wait(600);
            enterfix.state.ticker.visible = true;
            enterfix.state.ticker.animating = false;
            
            // Auto-hide se solicitado
            if (autoHide) {
                enterfix.state.ticker.timer = setTimeout(() => {
                    this.hide();
                }, enterfix.state.autoHideDelay + 5000); // Ticker fica mais tempo
            }
        },

        /**
         * Esconde o ticker
         */
        async hide() {
            if (enterfix.state.ticker.animating || !enterfix.state.ticker.visible) return;
            
            enterfix.state.ticker.animating = true;

            this.element.classList.remove('show');
            
            await enterfix.utils.wait(600);
            enterfix.state.ticker.visible = false;
            enterfix.state.ticker.animating = false;
        }
    },

    // Controle do Logo Bug
    logo: {
        element: null,

        init() {
            this.element = document.getElementById('logo-bug');
            return this;
        },

        /**
         * Mostra o logo
         */
        async show() {
            if (enterfix.state.logo.animating) return;
            
            enterfix.state.logo.animating = true;
            this.element.classList.add('show');
            
            await enterfix.utils.wait(600);
            enterfix.state.logo.visible = true;
            enterfix.state.logo.animating = false;
        },

        /**
         * Esconde o logo
         */
        async hide() {
            if (enterfix.state.logo.animating || !enterfix.state.logo.visible) return;
            
            enterfix.state.logo.animating = true;
            this.element.classList.remove('show');
            
            await enterfix.utils.wait(600);
            enterfix.state.logo.visible = false;
            enterfix.state.logo.animating = false;
        },

        /**
         * Alterna visibilidade do logo
         */
        toggle() {
            if (enterfix.state.logo.visible) {
                this.hide();
            } else {
                this.show();
            }
        }
    },

    // Inicialização geral
    init() {
        console.log('🚀 ENTERFIX Overlay System v2.0 - Inicializando...');
        
        // Inicializa todos os componentes
        this.lowerThird.init();
        this.specs.init();
        this.ticker.init();
        this.logo.init();

        // Inicia na cena 1 por padrão
        setTimeout(() => {
            this.sceneManager.switchTo('scene-1');
        }, 1000);

        console.log('✅ ENTERFIX Overlay System - Pronto!');
        console.log('🎥 Cenas disponíveis:', Object.keys(this.scenes));
        console.log('📚 Use: enterfix.scene(numero) para trocar cenas');
        
        return this;
    },
    
    // Atalhos para cenas
    scene: (number) => {
        const sceneId = `scene-${number}`;
        if (enterfix.scenes[sceneId]) {
            return enterfix.sceneManager.switchTo(sceneId);
        } else {
            console.error(`Cena ${number} não existe. Disponíveis: 1-6`);
        }
    }
};

// Auto-inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    enterfix.init();
});

// Expor API globalmente para controle externo
window.enterfixAPI = {
    // Métodos de cena (principais)
    scene1: () => enterfix.scene(1), // Abertura
    scene2: () => enterfix.scene(2), // Slides
    scene3: () => enterfix.scene(3), // Split
    scene4: () => enterfix.scene(4), // Software
    scene5: () => enterfix.scene(5), // Máquina
    scene6: () => enterfix.scene(6), // Detalhe
    
    // Controles manuais (para casos especiais)
    showLowerThird: (name, title, autoHide = true) => enterfix.lowerThird.show(name, title, autoHide),
    hideLowerThird: () => enterfix.lowerThird.hide(),
    showSpecs: (specs, autoHide = true) => enterfix.specs.show(specs, autoHide),
    hideSpecs: () => enterfix.specs.hide(),
    showTicker: (text, autoHide = true) => enterfix.ticker.show(text, autoHide),
    hideTicker: () => enterfix.ticker.hide(),
    showLogo: () => enterfix.logo.show(),
    hideLogo: () => enterfix.logo.hide(),
    
    // Utilitários
    hideAll: () => enterfix.sceneManager.hideAll(),
    getState: () => enterfix.state,
    setAutoHideDelay: (ms) => { enterfix.state.autoHideDelay = ms; }
};

// Funções de demonstração SIMPLIFICADAS
window.demo = {
    // Teste rápido de todas as cenas
    async allScenes() {
        console.log('🎥 Demonstrando todas as cenas...');
        for (let i = 1; i <= 6; i++) {
            console.log(`Cena ${i}: ${enterfix.scenes[`scene-${i}`].name}`);
            await enterfix.scene(i);
            await enterfix.utils.wait(8000); // 8s por cena
        }
        console.log('✅ Demonstração completa!');
    },
    
    // Fluxo de apresentação típica
    async presentation() {
        await enterfix.scene(1); // Abertura
        await enterfix.utils.wait(10000);
        await enterfix.scene(2); // Slides
        await enterfix.utils.wait(15000);
        await enterfix.scene(4); // Software
        await enterfix.utils.wait(12000);
        await enterfix.scene(5); // Máquina
        await enterfix.utils.wait(8000);
        await enterfix.scene(6); // Detalhe
        await enterfix.utils.wait(5000);
        await enterfix.scene(1); // Fechamento
    }
};

console.log('🎥 === ENTERFIX BROADCAST SYSTEM v2.0 ===');
console.log('🎬 Controle Principal:');
console.log('   enterfix.scene(1-6) - Mudar cenas');
console.log('   demo.allScenes() - Testar todas');
console.log('   demo.presentation() - Fluxo completo');
console.log('');
console.log('🎬 Cenas Mapeadas:');
Object.entries(enterfix.scenes).forEach(([id, scene]) => {
    const num = id.replace('scene-', '');
    console.log(`   Cena ${num}: ${scene.name}`);
});