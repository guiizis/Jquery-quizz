//global variables
const global = {
    checkedAnswer: false,
    index: 0,
    dataGlobal: [],
    numberOfQuestion: 1,
    timePoints: 15,
    timerStart: null,
    score: 0,
    correctAnswers: 0,
    chronometer: null,
    durationTime: 0,
    music: new Audio("./assets/Lost Woods 8 Bit.mp3")
}





$('document').ready(() => {
    console.log("hey there :)")

})

//on click's
$("#btn_login").on("click", () => {
    verifyUserName()
})

$("#btn_confirm").on("click", () => {
    global.index++
    verifyAnswer(global.checkedAnswer, global.index, global.dataGlobal, global.timerStart)
})

//on click's
$("#btn_newGame").on("click", () => {
    resetGame()

})




// caputrar resultado da api
const startQuiz = async () => {
    removeLogin()

    let data = await requisitionData()
     

    global.dataGlobal = data

    buildTemplateQuestions(data, global.index)

    startTimeCount()

    startMusic()

}

//verificar se o nome do usario esta vazio e dar start no quiz
const verifyUserName = () => {
    const userName = $("#txt_userName").val()
    if (userName.trim().length == 0) {
        $("#div_AlertNickName").removeClass("dsNone")
    } else {

        startQuiz()
    }
}

//remover o card de login com fades para dar uma transição mais suave
const removeLogin = () => {

    $("#cardLogin").fadeOut("slow")

    //timeout para melhorar estetica
    setTimeout(() => {

        $("#loginScreen").attr("hidden", true)
        $("#loginScreen").removeClass("d-flex")

        $("#questionScreen").fadeIn("slow")
        $("#questionScreen").removeClass("dsNone")
        $("#questionScreen").addClass("d-flex")

    }, 1500)
}



// montando lista de perguntas e adicionando listener para o click, metodo de reset para timer e etc
const buildTemplateQuestions = (data, index) => {
    const questionCard = $("#quizQuestions")
    //sem mais perguntas disponiveis, finalizar  o jogo
    if (data[index] == undefined) {
        wrongAnswer(global.correctAnswers, global.score, global.durationTime)
    }
    let currentQuestion = buildQuestion(data[index])
    let question = $("#h6_titleQuestion")
    let questionText = ""
    const placar = $("#h6_placar")


    currentQuestion.map((question, index) => {
        questionText += `
            <a class="list-group-item list-group-item-action" checkAnswer>
                ${question.answer}
                <input type="hidden" value="${question.isCorrect}" hiddenValue> 
            </a>
                  
        `
    })

    // <h6 class="categoryTitle">Dificuldade:<b> ${data[index]['difficulty']} </b> </h6>

    questionCardContent = `
    <div class="list-group" answersBox>
        <h6 class="categoryTitle text-center" >Categoria: <b>  ${data[index]['category']} </b> </h6>
        
        ${questionText} 
        <h6 class="text-center mt-2" id="h6_timePoints" name="h6_timePoints">${global.timePoints}</h6>
        <div class="progress mt-1">
            <div class="progress-bar progress-bar-striped bg-warning" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
    </div>`

    $(question).html(data[index].question)

    $(questionCard).append(questionCardContent)

    $(placar).text(`${global.numberOfQuestion}/${data.length}`)

    markAnswer()

    clearIntervals(global.timerStart)

    resetTimer()

    startCount(".progress-bar")



    global.numberOfQuestion++
}

// montar perguntas  e retornar elas embaralhadas
const buildQuestion = (question) => {

    let answers = []

    const correct = {
        isCorrect: true,
        answer: question["correct_answer"]
    }
    console.log(question["correct_answer"])

    question["incorrect_answers"].map((answer, index) => {
        answers.push({
            isCorrect: false,
            answer
        })
    })

    console.log(answers)
    answers.push(correct)

    return shuffle(answers)

}

// embaralhar o array 

function shuffle(Array) {
    var j, x, i;
    var shuffleArray = Array;
    for (i = shuffleArray.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = shuffleArray[i];
        shuffleArray[i] = shuffleArray[j];
        shuffleArray[j] = x;
    }
    return shuffleArray;
}

//marcar respostas
function markAnswer() {
    $('[checkAnswer]').on("click", function (event) {

        removeAnotherCheckedAnswer(this)

        $(this).addClass('selectedItem')

        global.checkedAnswer = $(this).find('[hiddenvalue]').val()

    })
}


//remover outras marcadas
const removeAnotherCheckedAnswer = (element) => {
    $(element).parent().find(".selectedItem").each((index, element) => {
        $(element).removeClass("selectedItem")
    })
}

const verifyAnswer = (answer, index, dataGlobal, timerStart) => {


    clearIntervals(timerStart)
    markTheAnswers()

    if (answer == 'true') {
        global.score += Number($('#h6_timePoints').text())
        global.correctAnswers++
        correctAnswerChecked(index, dataGlobal)
    } else {
        wrongAnswer(global.correctAnswers, global.score, global.durationTime)
    }
}

const startCount = (classElement) => {
    let widthOfProgress = 100

    global.timerStart = setInterval(() => {

        global.timePoints--
        widthOfProgress -= 6.66

        $(classElement).css("width", `${widthOfProgress}%`)
        attTime(global.timePoints)

        if (global.timePoints == 0) {
            wrongAnswer(global.correctAnswers, global.score, global.durationTime)
        }

    }, 1000)
}

const resetTimer = () => {

    global.timePoints = 16
}

const attTime = (time) => {
    $('#h6_timePoints').text(time)
}

const startTimeCount = () => {
    global.chronometer = setInterval(() => {
        global.durationTime++
    }, 1000)
}

const resetGame = () => {
    clearGlobalObject()
    $('#myModal').modal('toggle')
    emptyChields()
    unlockPanel()
    startQuiz()
}

const clearIntervals = (setInterval) => {
    clearInterval(setInterval)
}

const clearGlobalObject = () => {

    global.checkedAnswer = false
    global.index = 0
    global.dataGlobal = []
    global.numberOfQuestion = 1
    global.timePoints = 16
    global.timerStart = null
    global.score = 0
    global.correctAnswers = 0
    global.chronometer = null
    global.durationTime = 0

}

const saveScore = (score) => {
    let result = localStorage.getItem("scores");

    if (!result) {
        result = [];
    } else {
        result = JSON.parse(result);
    }

    result.push(score);
    localStorage.setItem("scores", JSON.stringify(result));
}

const startMusic = () => {
    global.music.volume = 0.2;
    global.music.play()
    global.music.loop = true;
}

const stopMusic = () => {
    global.music.pause();
    global.music.currentTime = 0
}