$('document').ready(() => {
    getScores()
})



const getScores = () => {
    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    // ORDENA EM ORDEM CRESCENTE
    const asc = scores.sort((a, b) => b.score - a.score);

    const [first, second, third, fourth, fifth] = asc

    buildScoreTable(first, second, third, fourth, fifth);
}

const buildScoreTable = (...scores) => {
    const table = $("#tableBody")
    let rows = ''

    scores.map((player, index) => {
        if (player == undefined) return

        rows +=
            ` 
    <tr>
        <th scope="row">${index + 1}</th>
        <td>${player.name}</td>
        <td>${player.correctAnswers}</td>
        <td>${player.score}</td>
        <td>${new Date(player.timeDuration * 1000).toISOString().substr(11, 8)}</td>
    </tr>
`
    })

    table.append(rows)
}