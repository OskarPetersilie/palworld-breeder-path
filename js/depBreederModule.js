function getBaby(parent1, parent2, available){
    let unique = checkIfUnique(parent1, parent2)
    if(unique){
        return [unique[0], getMermaidNotation(parent1, parent2, unique[0], available) ]
    }
    let babyPower = Math.floor((getPower(parent1) + getPower(parent2) + 1)/2)
    let babyName = findBabyByPower(babyPower)

    if(babyName != ""){
        return [babyName, getMermaidNotation(parent1, parent2, babyName, available) ]
    }else{
        return []
    }
}

function getPower(palName){
    return pals[palName]
}

function checkIfUnique(parent1, parent2){
    return Object.entries(uniqueCombos).find(e => e[1] == `${parent1}+${parent2}` || e[1] == `${parent2}+${parent1}`)
}

function findBabyByPower(babyPower){
    let possibleBabys = Object.entries(pals).map(([k,v]) => {
        return [k, v, Math.abs(v-babyPower)]
    }).filter(e => e[2] >= 0).sort((a,b) => a[2] - b[2]).filter((e, i, arr) => e[2] == arr[0][2])

    // if tie (difference in egg power to possible pal is the same)
    // example combination would be "Bristla" and "Blazehowl" summing up to 2030 => 1015
    // diff to Robinquill 1020 and Felbat 1010 is both 5 
    // then the index of the intern game maps first is choosen
    if(possibleBabys.length >= 2){
        possibleBabys = possibleBabys.map(e => {
            e.push(palOrder[e[0]])
            return e
        })
        possibleBabys.sort((a,b) => a[3] - b[3])
    }
    possibleBabys = possibleBabys.filter(e => !Object.keys(uniqueCombos).includes(e[0]))
    if(possibleBabys.length >= 1){

        return possibleBabys[0][0]
    }
    return ""
}

function getMermaidNotation(p1, p2, c, available){
    let class1 = ""
    let class2 = ""
    if(available.includes(p1)){
        class1 = ":::source"
    }
    if(available.includes(p2)){
        class2 = ":::source"
    }
    return `${p1}${class1}-->${c};\r\n\t${p2}${class2}-->${c};\r\n\t`
}

function extractBreedPath(breeds, available, target, maxIteration){
    let o = breeds.filter(e => e.includes(">" + target + ";"))
    let satisfiedReqs = []
    let requires = o.map(e => e.split("-->")[0])
    for(let i = 0; i <= maxIteration; i++){
        requires.forEach(r => {
            o = [...o, ...breeds.filter(e => e.includes(">" + r +";"))]
        })
        satisfiedReqs = [...satisfiedReqs, ...requires]
        requires = o.map(e => e.split("\r\n\t").map(e2 => e2.split("-->")[0])).flat().filter(e => e != "")
        requires = requires.filter(e => !available.includes(e) && !satisfiedReqs.includes(e))
    }
    return o
}

function deepBreed(target, available, maxIteration){
    let storage = JSON.parse(JSON.stringify(available))
    let breeds = []

    for(let i = 0; i <= maxIteration; i++){
        storage.forEach((e, i, arr) => {
            storage.filter(f => f != e).forEach(e2 => {
                let baby = getBaby(e, e2, available)
                if(baby.length >= 2){
                    if(!storage.includes(baby[0])){
                        breeds.push(baby[1])
                        storage.push(baby[0])
                    }
                }
            })
        })
    }
    
    let finalBreeds = []
    if(storage.includes(target)){
        finalBreeds = extractBreedPath(breeds, available, target, maxIteration)
    }

    return {
        status: 200,
        foundTarget: storage.includes(target),
        mermaidText: "graph TD;\r\n\t" + finalBreeds.join("") + "classDef source stroke:#2f2,stroke-width:4px\r\n\tstyle " + target + " stroke:#80f,stroke-width:4px\r\n\t"
    }
}
