import Head from "next/head";
import { useEffect } from "react";

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
        generateButton.addEventListener("click", () => {
            image_container.innerHTML = ""
            const min = document.querySelector("#min").value
            const max = document.querySelector("#max").value
            if(max > 600) {
                return alert("O máximo permitido é 600")
            }
            const result = generate(min, max)
            const numbers = Object.keys(result)
            const canvas = document.createElement("canvas")
            canvas.width = 850
            canvas.height = 400
            image_container.appendChild(canvas)
            let y = 25
            let x = 15
            let rows = 0
            let first_y = null
            const ctx = canvas.getContext("2d")
            ctx.fillStyle = "black"
            for (const number of numbers) {
                canvas.height =  canvas.height + 82
            }
            for (const number of numbers) {
                ctx.font = "25px Arial"
                let t = ""
                const multiplicators = Object.keys(result[number])
                for (const multiplicator of multiplicators) {
                    const m_result = result[number][multiplicator]
                    const text = `${number} x ${multiplicator} = ${m_result}`
                    t = text
                    ctx.fillText(text, x, y)
                    const m = ctx.measureText(text)
                    if(!first_y) {
                        first_y = y
                    }
                    y += 25
                }
                if(rows >= 3) {
                    rows = 0
                    x = 15
                    first_y = null
                    y += 55
                } else {
                    x += ctx.measureText(t).width + 15
                    y = first_y
                    rows += 1
                }
            }
        })
    }, [])
    return (
        <>
            <Head>
                <title>Gerador de tabuada</title>
                <meta name="description" content="Gere tabuadas prontas do 0 até o 600 em um piscar de olhos!"/>
                <meta name="robots" content="index, follow"/>
            </Head>
            <header>
                <h1>Gerador de tabuada</h1>
                <p>Preparado para gerar sua tabuada?</p>
                <div id="inputs">
                    <input type="number" defaultValue={1} id="min" />
                    <div className="placeholder">
                        Início
                    </div>
                    <input type="number" defaultValue={10} id="max" max={600}/>
                    <div className="placeholder">
                        Fim
                    </div>
                </div>
                <button id="generate">
                    Gerar tabuada
                </button>
            </header>
            <main>
                <p>Abaixo será gerado uma imagem, você pode imprimir ela.</p>
                <p>OBS: não coloque números absurdamente altos, seu computador pode chorar kk</p>
                <div id="image-container"/>
            </main>
        </>
    )
}