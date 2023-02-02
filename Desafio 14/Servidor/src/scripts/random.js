export const getRandomInt = (query) => {
    const numerosArray = {}
    const randomizador = () =>{
        return Math.random() * (1000 - 1) + 1;
    }
    for (let i = 0; i < (query); i++) {
        let numeroRandom = randomizador();
        if(numerosArray[numeroRandom]){
            numerosArray[numeroRandom] +=1;
        }else{
            numerosArray[numeroRandom] = 1;
        }
    }
    return numerosArray;
}

