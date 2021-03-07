const correctAnswerChecked = (index, dataGlobal) => {

    emptyChields()
    buildTemplateQuestions(dataGlobal, index)

}

const wrongAnswer = (numberCorrect = null, score = null, tempoDeDuracao = null) => {

    clearIntervals(global.timerStart)
    clearIntervals(global.chronometer)

    let name = $('#txt_userName').val()
    let ctAn = numberCorrect ? numberCorrect : 0
    let ctSr = score ? score : 0
    let tpDr = tempoDeDuracao ? tempoDeDuracao : 0
    blockPanel()
    $('#myModal').modal('toggle')
    $("#p_textEndGame").text(`O Jogo Acabou ${name}, Deseja um Novo Jogo  ou ver o Placar  ? `)
    $("#p_scoreEndGame").text(` Sua Pontuação:  ${ctSr}`)
    $("#p_correctAnswersEndGame").text(` Número de Perguntas que Você Acertou:  ${ctAn}`)
    $("#p_gameTimeDuration").text(` Tempo de Jogo:  ${new Date(tpDr * 1000).toISOString().substr(11, 8)}`)



    saveScore({
        name,
        correctAnswers: ctAn,
        score: ctSr,
        timeDuration: tpDr
    })

    stopMusic()

}


const markTheAnswers = () => {
    $("[answersBox] a").each(function (index, element) {
        if ($(element).find("[hiddenValue]").val() == "false") {
            $(element).css("background-color", "tomato")
        } else {
            $(element).css("background-color", "yellowgreen")
        }
    })
}

const blockPanel = () => {
    $("body").find("[contentPanel]").not(":last").each((index, element) => {
        $(element).css("pointer-events", "none")
    })

    $(".modal").css("pointer-events", "none")
}

const unlockPanel = () => {
    $("body").find("[contentPanel]").not(":last").each((index, element) => {
        $(element).css("pointer-events", "auto")
    })
}

const emptyChields = () => {
    $("#quizQuestions").children().not(":first").empty()
}