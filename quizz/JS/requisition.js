const requisitionData = () => {
    const url = "https://opentdb.com/api.php?amount=50"

    return fetch(url)
        .then(response => response.json())
        .then(response => {
            return filterData(response.results)

        })
        .catch(error => {
            alert("error on API")
            throw error
             
        })
}

const filterData = (response) => {

    let filter = response.filter(question => question.type != "boolean")

    return filter
}