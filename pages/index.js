import Head from "next/head";
import { useEffect } from "react";
import canvasSize from "canvas-size";

const delay = async (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            return resolve()
        }, time)
    })
}

/**
 * Gera uma tabuada
 * @param {Number} start Início da tabuada 
 * @param {Number} end Fim da tabuada
 * @returns {Object} Objeto da tabuada
 */
async function generate(start, end) {
    const output = {}
    let currentNumber = Number(start)
    const limit = 10
    for (let n = currentNumber; n <= end; n++) {
        if(n % 100 == 0) {
            await delay(1)
        }
        output[currentNumber] = {}
        for (let num = 0; num <= limit; num++) {
            output[currentNumber][num] = currentNumber * num
        }
        currentNumber += 1
    }
    return output
}

export default function Main() {
    useEffect(() => {
        const image_container = document.querySelector("#image-container")
        const generateButton = document.querySelector("#generate")
        /**
         * Testa o tamanho do canvas para ver se não atingiu o limite.
         * @param {Boolean} avoidCrashes Define se a opção de evitar crashes está ativada.
         * @param {Number} canvasWidth Largura do canvas
         * @param {Number} canvasHeight Altura do canvas
         * @returns {Boolean} Se o canvas é válido ou não
         */
        function Test(avoidCrashes, canvasWidth, canvasHeight) {
            if(avoidCrashes) {
                /* Verificando se o tamanho não passa do limite imposto pelo navegador */
                const isValid = canvasSize.test({
                    width: canvasWidth,
                    height: canvasHeight
                })
                return isValid
            } else {
                return true
            }
        }
        generateButton.addEventListener("click", async () => {
            let Time = Date.now()
            const min = Number(document.querySelector("#minimum")?.value) || 1
            const max = Number(document.querySelector("#maximum")?.value) || 10
            const fontSize = Number(document.querySelector("#font-size")?.value) || 20
            const fontColor = document.querySelector("#font-color")?.value || "#22223b"
            const avoidCrashes = document.querySelector("#avoid-crash").checked
            if(max < min) {
                return alert("O valor mínimo é maior que o máximo")
            }
            image_container.innerHTML = "<div id=\"loading\"/>"
            await delay(50) // Para evitar que o navegador trave
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            ctx.font = `${fontSize}px Fredoka`
            const texts = []
            const operations = await generate(min, max)
            const keys = Object.keys(operations)

            /* Variáveis usadas na hora de posicionar o texto */
            let x = 0
            let y = 0
            let firstY = null

            let rows = 0
            let canvasHeight = 0
            let canvasWidth = 0

            /* Colocando os resultados na variável texts */
            let t = null
            let iterations = 0;
            let stopped = false
            for(const key of keys) {
                if(iterations % 100 == 0) {
                    await delay(10) // Evitando que o navegador trave
                    if(!Test(avoidCrashes, canvasWidth || 1, canvasHeight || 1)) {
                        image_container.innerHTML = "<p style=\"text-align: center; color: red\">Possível crash evitado!<br/> Sua imagem ultrapassou os limite antes do processamento terminar, para evitar que seu navegador trave, o processamento foi interrompido.<br/>Você pode desmarcar a checkbox \"Evitar que o navegador trave?\" para que seu navegador não seja protegido. Mas lembre-se que isso pode bugar seu navegador e levar ele a crashar.</p>"
                        stopped = true
                        break;
                    }
                }
                iterations += 1
                const results = operations[key]
                const resultsKeys = Object.keys(results)
                if(!firstY) {
                    firstY = y
                }
                for(const resultKey of resultsKeys) {
                    const result = operations[key][resultKey]
                    const txt = `${key} x ${resultKey} = ${result}`
                    t = txt
                    y += fontSize + 20
                    canvasHeight = y + 25
                    texts.push({
                        txt: txt,
                        x: x,
                        y: y
                    })
                }
                if(rows < 3) {
                    rows += 1
                    y = firstY
                    x += ctx.measureText(t).width + fontSize
                    if(x + fontSize * 1.7 >= canvasWidth) {
                        canvasWidth += (ctx.measureText(t).width + fontSize) * 1.8
                    }
                } else {
                    rows = 0
                    x = 0
                    y += fontSize
                    firstY = null
                }
            }
            if(stopped) return;

            if(!Test(avoidCrashes, canvasWidth, canvasHeight)) {
                image_container.innerHTML = "<p style=\"text-align: center; color: red\">Seu navegador foi protegido de um possível crash! <br/> A imagem ficou simplesmente gigante. Diminua o tamanho da fonte ou os números da tabuada e tente novamente. <br /> Você pode desmarcar a checkbox \"Evitar que o navegador trave?\" para que seu navegador não seja protegido. Mas lembre-se que isso pode bugar seu navegador e levar ele a crashar.</p>"
                return;
            }

            const outerElement = texts.filter(txt => txt.x + fontSize * 1.7 >= canvasWidth)
            const largest = [...texts].sort((a, b) => b.x - a.x)[0].x

            if(outerElement) {
                canvasWidth += largest / 6
            }

            /* Definindo altura e largura */
            canvas.height = canvasHeight
            canvas.width = canvasWidth

            /* Escrevendo na imagem */
            ctx.font = `${fontSize}px Fredoka`
            ctx.fillStyle = fontColor
            for(const txt of texts) {
                ctx.fillText(txt.txt, txt.x, txt.y)
            }
            Time = Date.now() - Time
            const p = document.createElement("p")
            let FormattedTime = (Time % 60000) / 1000 + " segundos"
            p.textContent = `Tempo levado para processar a imagem: ${FormattedTime}`
            image_container.innerHTML = ""
            image_container.appendChild(canvas)
            image_container.appendChild(p)

        })
    }, [])
    return (
        <>
            <Head>
                <title>Gerador de tabuada</title>
                <meta name="description" content="Gere tabuadas prontas em um piscar de olhos!"/>
                <meta name="robots" content="index, follow"/>
            </Head>
            <header>
                <h1>Gerador de tabuada</h1>
                <p>Personalize sua tabuada abaixo</p>
                <div id="inputs">
                    <input type="number" defaultValue={20} id="font-size" />
                    <div className="placeholder">
                        Tamanho da fonte
                    </div>
                    <input type="text" defaultValue="#22223b" id="font-color" />
                    <div className="placeholder">
                        Cor da fonte
                    </div>
                    <input type="number" defaultValue={1} id="minimum" />
                    <div className="placeholder">
                        Início
                    </div>
                    <input type="number" defaultValue={10} id="maximum" />
                    <div className="placeholder">
                        Final
                    </div>
                    <div id="checkbox-container" title="Impede a geração de imagens gigantes que podem crashar seu navegador">
                        <input type="checkbox" defaultChecked={true} id="avoid-crash" name="avoid-crash"/>
                        <label htmlFor="avoid-crash">
                            Evitar que o navegador trave?
                        </label>
                    </div>
                </div>
                <br />
                <button id="generate">
                    Gerar tabuada
                </button>
            </header>
            <main>
                <p>Você pode imprimir a imagem gerada abaixo</p>
                <br/>
                <div id="image-container"/>
            </main>
        </>
    )
}