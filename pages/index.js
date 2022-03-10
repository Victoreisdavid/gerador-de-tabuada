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
            let Time = Date.now()
            const min = document.querySelector("#min").value
            const max = document.querySelector("#max").value
            if (min > max) {
                return alert("O valor mínimo não pode ser maior do que o valor máximo.")
            }
            if(max > 500) {
                return alert("O máximo permitido é 500")
            }
            image_container.innerHTML = ""
            const result = generate(min, max)
            const numbers = Object.keys(result)
            const canvas = document.createElement("canvas")
            canvas.width = 1150
            canvas.height = 0
            image_container.appendChild(canvas)
            let y = 25
            let x = 95
            let rows = 0
            let first_y = null
            const ctx = canvas.getContext("2d")
            ctx.fillStyle = "black"
            let elements = 0
            let underelements = 0
            if(numbers.length <= 3) {
                canvas.height = 330
            } else {
                for (const number of numbers) {
                    if(rows > 3) {
                        rows = 0
                        elements += 1
                        //alert(number)
                    } else {
                        rows += 1
                        underelements += 1
                    }
                }
                rows = 0
                //canvas.height = 330 * elements + 30 + 30
            }
            /*if(max > 5) {
                canvas.height -= 275
            }*/
            const texts = []
            let image_size = 0
            for (const number of numbers) {
                ctx.font = "35px Fredoka"
                let t = ""
                const multiplicators = Object.keys(result[number])
                for (const multiplicator of multiplicators) {
                    const m_result = result[number][multiplicator]
                    const text = `${number} x ${multiplicator} = ${m_result}`
                    t = text
                    /*if (y > canvas.height) {
                        console.log(text, " Esse saiu pra fora")
                
                        ctx.font = "30px Fredoka"
                    }
                    ctx.fillText(text, x, y)*/
                    texts.push({
                        text: text,
                        x: x,
                        y: y
                    })
                    if(!first_y) {
                        first_y = y
                        image_size += 330 + 45
                    }
                    y += 35
                    if(image_size < y) {
                        image_size += 30
                    }
                }
                if(rows >= 3) {
                    rows = 0
                    x = 95
                    first_y = null
                    y += 55
                } else {
                    x += ctx.measureText(t).width + 15
                    y = first_y
                    rows += 1
                }
            }
            canvas.height = image_size
            ctx.font = "35px Fredoka"

            for (const txt of texts) {
                ctx.fillText(txt.text, txt.x, txt.y)
            }
            Time = Date.now() - Time
            const paragraph = document.createElement("p")
            let FormattedTime = (Time % 60000) / 1000 + " segundos"
            paragraph.innerHTML = `Tempo levado para gerar a imagem: <strong>${FormattedTime}</strong>`
            image_container.appendChild(paragraph)
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
                <br/>
                <div id="image-container"/>
            </main>
        </>
    )
}