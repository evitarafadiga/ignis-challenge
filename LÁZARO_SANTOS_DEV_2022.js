const select = (query, element = document) => element.querySelector(query);

function readTeamsStates() {
    const $textArea = select("#timeestado");
    return $textArea.value;
}

function parse(text) {
    const teams = text.split("\n");

    if (teams.length % 2 == 1) {
        console.log("Erro de inserção de time!")
    }
    console.log(teams);

    const parsedTeams = teams.map(team => {
        const split = team.split(";");
        return {
            name: split[0],
            state: split[1]
        }
    });
    console.log(parsedTeams);
    return parsedTeams;
}

function defineMatches(teams) {
    const isEven = (team,index ) => index % 2 == 0;
    const isOdd = (team,index ) => index % 2 == 1;
    const even = teams.filter(isEven);
    const odd = teams.filter(isOdd);
    
    const matches = [];

    for (let index = 0; index < even.length; index++) {
        matches.push({   
            team_a: even[index],
            team_b: odd[index],
            state: even[index].state,
            turn: 1,
            gols_a: Math.floor(Math.random() * (7 - 0)),
            gols_b: Math.floor(Math.random() * (7 - 0)),
            isDoubleTurn: false
        })
    }

    odd.unshift(odd.pop());

    for (let index = 0; index < even.length; index++) {
        matches.push({   
            team_a: even[index],
            team_b: odd[index],
            state: even[index].state,
            turn: 2,
            gols_a: Math.floor(Math.random() * (7 - 0)),
            gols_b: Math.floor(Math.random() * (7 - 0)),
            isDoubleTurn: false
        })
    }
    
    return matches;
}

select("#input-btn").addEventListener("click", event => {
    const content = readTeamsStates();
    const teams = parse(content);
    const matches = defineMatches(teams);
    
    console.log(matches);
    
    const $matchtables = select("#tabelapartidas");
    
    doubleTurn(matches);

    $matchtables.innerHTML = "";
    matches.forEach((match, index) => {
        calculatePoints(match);
        $matchtables.innerHTML += matchToHtml(matches[index])
    })
});

function matchToHtml(match) {
    return `<tr>
        <td>${match.team_a.name}</td>
        <td>${match.team_b.name}</td>
        <td>${match.state}</td>
        <td>${match.turn}</td>
        <td>${match.gols_a}</td>
        <td>${match.gols_b}</td>
        <td>${match.pontos_a}</td>
        <td>${match.pontos_b}</td>
        <td>${match.isDoubleTurn}</td>
    </tr>`
}

function doubleTurn(matches) {
    const mapped = new Map();
    matches.forEach(match => {
        let value = mapped.get(match.state + match.turn);
        if(value) value.push(match);
        else mapped.set(match.state + match.turn, [match])
    })
    
    mapped.forEach(element => {
        if(element.length > 1) element.forEach(match=> match.isDoubleTurn = true)
    })
}

function calculatePoints(match) {
    
    if(match.gols_a == match.gols_b) {
        match.pontos_a = 1;
        match.pontos_b = 1;
    } else if (match.gols_a > match.gols_b) {
        match.pontos_a = 3;
        match.pontos_b = 0;
        
    } else { match.pontos_b = 3
        match.pontos_a = 0;
    }
    
}





