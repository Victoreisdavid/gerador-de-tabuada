import Head from "next/head";
import { useEffect } from "react";

/**
 * Gera uma tabuada
 * @param {Number} start Início da tabuada 
 * @param {Number} end Fim da tabuada
 * @returns {Object} Objeto da tabuada
 */
function generate(start, end) {
    const output = {}
    let currentNumber = Number(start)
    const limit = 10
    for (let n = currentNumber; n <= end; n++) {
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
        const delay = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    return resolve()
                }, 50)
            })
        }
        generateButton.addEventListener("click", async () => {
            let Time = Date.now()
            const min = Number(document.querySelector("#minimum")?.value) || 1
            const max = Number(document.querySelector("#maximum")?.value) || 10
            const fontSize = Number(document.querySelector("#font-size")?.value) || 20
            const fontColor = document.querySelector("#font-color")?.value || "#22223b"
            if(max > 500) {
                return alert("O valor máximo permitido é 500, acima disso a imagem pode bugar.")
            }
            if(max < min) {
                return alert("O valor mínimo é maior que o máximo")
            }
            image_container.innerHTML = "<div id=\"loading\"/>"
            await delay() // Para evitar que o navegador trave
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            ctx.font = `${fontSize}px Fredoka`
            const texts = []
            const operations = generate(min, max)
            const keys = Object.keys(operations)

            /* Variáveis usadas na hora de posicionar o texto */
            let x = 0
            let y = 0
            let firstY = null

            let rows = 0
            let canvasHeight = 0
            let canvasWidth = 0

            /* Colocando os resultados na variável texts */
            for(const key of keys) {
                const results = operations[key]
                const resultsKeys = Object.keys(results)
                if(!firstY) {
                    firstY = y
                }
                let t = null
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
                    if(x + fontSize >= canvasWidth) {
                        canvasWidth += (ctx.measureText(t).width + fontSize) * 2
                    }
                } else {
                    rows = 0
                    x = 0
                    y += fontSize
                    firstY = null
                }
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
                <meta name="description" content="Gere tabuadas prontas do 0 até o 500 em um piscar de olhos!"/>
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
                </div>
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