const URL = "http://127.0.0.1:8000/get-entries/"
const strategyBtn  = document.querySelectorAll(".btn-choice")
const progressBar = document.querySelector('.progress')
const mainBlock = document.querySelector(".main-block")
const starterHtml = document.body.innerHTML



const loadMain = () =>{
    document.body.innerHTML = starterHtml
}


const doRequestAsync = (url, callback) =>{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

const editProgress = (progressBar, value) =>{
    if (!value){
        progressBar.removeAttribute("value")
    }else{
        progressBar.value = value
    }
}

editProgress(progressBar, null)


const createCard = () =>{
    const card = document.createElement("div")
    card.setAttribute("class", "card is-flex is-justify-content-center")
    const cardContent = document.createElement("div")
    cardContent.setAttribute("class", "card-content")
    card.appendChild(cardContent)
    cardContent.style.height = "100%"
    card.style.height = "75%"
    return card
}

const fixUnderscoredKey = (key) =>{
    let splitKey = key.split("_")
    let fullKey = ""
    for (let word of splitKey){
        if (word === splitKey[splitKey.length]){
            fullKey += word[0].toUpperCase() + word.substring(1)
        }else {
            fullKey += word[0].toUpperCase() + word.substring(1) + " "
        }
    }
    return fullKey
}

const extraDataModal = (ticker, data) =>{
    let modal = document.createElement("div")
    modal.setAttribute("class", "modal")
    let modalBackground = document.createElement("div")
    modalBackground.setAttribute("class", "modal-background")
    modal.appendChild(modalBackground)
    let modalCard = document.createElement("div")
    modalCard.setAttribute("class", "modal-card")
    modal.appendChild(modalCard)
    let modalCardHead = document.createElement("header")
    modalCardHead.setAttribute("class", "modal-card-head")
    modalCard.appendChild(modalCardHead)
    let modalCardTitle = document.createElement("p")
    modalCardTitle.setAttribute("class", "modal-card-title")
    modalCardTitle.textContent = ticker
    modalCardHead.appendChild(modalCardTitle)
    let modalCardBody = document.createElement("section")
    modalCardBody.setAttribute("class", "modal-card-body")
    modalCard.appendChild(modalCardBody)
    let modalCardBodyContent = document.createElement("div")
    modalCardBodyContent.setAttribute("class", "is-flex flex-modal-extra")
    modalCardBody.appendChild(modalCardBodyContent)
    let dataKeys = Object.keys(data)

    for (let key of dataKeys){
        let box = document.createElement("div")
        box.setAttribute("class", "card box-edit")
        let cardHeader = document.createElement("header")
        cardHeader.setAttribute("class", "card-header")
        box.appendChild(cardHeader)
        let boxElement = document.createElement("div")
        boxElement.setAttribute("class", "card-content box-content")
        box.appendChild(boxElement)


        let cardHeaderTitle = document.createElement("p")
        cardHeaderTitle.setAttribute("class", "card-header-title has-text-centered")
        cardHeader.appendChild(cardHeaderTitle)
        cardHeaderTitle.textContent = fixUnderscoredKey(key)
        let boxStatusElement = document.createElement("div")
        let boxStatusElementContent = document.createElement("span")
        boxStatusElementContent.setAttribute("class", "tag is-light")
        let boxStatusElementTag = document.createElement("span")
        boxStatusElementTag.setAttribute("class", "tag is-info is-light")
        boxStatusElementContent.textContent = data[key]['status'] ? "Long" : "Short"
        boxStatusElementTag.textContent = "Signal"
        boxStatusElement.appendChild(boxStatusElementTag)
        boxStatusElement.appendChild(boxStatusElementContent)
        boxStatusElement.setAttribute("class", "grouped-box-values")
        boxElement.appendChild(boxStatusElement)
        let innerKeys = Object.keys(data[key]['values'])
        for(let iKey of innerKeys) {

            let value = data[key]["values"][iKey]
            modalCardBodyContent.appendChild(box)
            let groupedBoxValues = document.createElement("div")
            groupedBoxValues.setAttribute("class", "grouped-box-values")
            let boxElementContentKey = document.createElement("span")
            boxElementContentKey.setAttribute("class", "tag is-info is-light")
            let boxElementContentValue = document.createElement("span")
            boxElementContentValue.setAttribute("class", "tag is-light")
            boxElementContentKey.textContent = fixUnderscoredKey(iKey)
            boxElementContentValue.textContent = value.toFixed(2)
            groupedBoxValues.appendChild(boxElementContentKey)
            groupedBoxValues.appendChild(boxElementContentValue)
            boxElement.appendChild(groupedBoxValues)
        }
    }

    let modalBtn = document.createElement("button")
    modalBtn.setAttribute("class", 'button')
    modalBtn.textContent = "Close"
    modalBtn.addEventListener("click", ()=>{
        modal.classList.remove("is-active")
    })
    let modalCardFooter = document.createElement("footer")
    modalCardFooter.setAttribute("class", "modal-card-foot")
    modalCardFooter.appendChild(modalBtn)
    modalCard.appendChild(modalCardFooter)

    return modal
}

// TODO Only works with full-data
const populateTable = (table, data) =>{

    let lastTicker
    let tableHead = document.createElement("thead")
    table.appendChild(tableHead)
    let tableHeads = Object.keys(data)
    let uppermostRow = document.createElement("tr")
    let firstTh = document.createElement("th")

    firstTh.textContent = "Label"
    uppermostRow.appendChild(firstTh)

    for(let ticker of tableHeads){
        let th = document.createElement("th")
        th.textContent = ticker
        uppermostRow.appendChild(th)
        lastTicker = ticker
    }
    tableHead.appendChild(uppermostRow)
    let tableBody = document.createElement("tbody")
    table.appendChild(tableBody)
    let innerKeys = Object.keys(data[lastTicker])
    console.log(innerKeys)
    for(let iKey of innerKeys){
        let newTableRow = document.createElement("tr")
        let newTableData = document.createElement('td')
        newTableData.textContent = fixUnderscoredKey(iKey)
        newTableRow.appendChild(newTableData)
        for (let ticker of tableHeads){
            let newTableData = document.createElement("td")
            let spanElement = document.createElement("span")
            spanElement.setAttribute("class", `${data[ticker][iKey]['status'] === true ? 'tag is-success': 'tag is-danger'}`)
            spanElement.textContent = data[ticker][iKey]['status']? "Long": "Short"
            newTableData.appendChild(spanElement)
            newTableData.classList.add("clickable")

            newTableData.addEventListener("click", () =>{
                console.log(data[ticker])
                let modal = extraDataModal(ticker, data[ticker])
                mainBlock.appendChild(modal)
                modal.classList.toggle("is-active")
            })

            newTableRow.appendChild(newTableData)
        }
        tableBody.appendChild(newTableRow)
    }
}

const loadBackButton = () =>{
    let backBtnContainer = document.createElement("div")
    backBtnContainer.setAttribute("class", "back-btn-container")

    mainBlock.appendChild(backBtnContainer)
    let backBtn = document.createElement("button")
    backBtn.setAttribute("class","button is-warning margin-sm")
    backBtn.textContent = "Back"
    backBtn.addEventListener("click", ()=>{
        // mainBlock.innerHTML = ""
        // mainBlock.innerHTML = starterHtml
        loadMain()
    })
    backBtnContainer.appendChild(backBtn)
}

const displayData = (data) =>{
    mainBlock.innerHTML = ''
    const card = createCard()
    const cardContent = card.firstChild
    const table = document.createElement("table")
    table.setAttribute("class", "table")
    populateTable(table, data.entries)
    cardContent.appendChild(table)
    mainBlock.appendChild(card)
}


const parseData = (name) =>{

    switch (name){
        case "full-market":

            let data =doRequestAsync(URL + "full-market")
            console.log(data)
            displayData(data)
            break
        case "sp500":
            "Do something else"
            break
    }
}


for(let choiceBtn of strategyBtn){
    choiceBtn.addEventListener("click", (event) =>{

        parseData(choiceBtn.name)
        mainBlock.classList.add("three-quarter-height")
        loadBackButton()
    })
}