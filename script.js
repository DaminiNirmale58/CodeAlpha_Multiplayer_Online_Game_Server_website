document.getElementById("loading").style.display = "none";
document.getElementById("bigcont").style.display = "none";
document.getElementById("userCont").style.display = "none";
document.getElementById("oppNameCont").style.display = "none";
document.getElementById("valueCont").style.display = "none";
document.getElementById("whosTurn").style.display = "none";

const socket = io();

let name;

document.getElementById("find").addEventListener("click", function () {
    name = document.getElementById("name").value;
    document.getElementById("user").innerText = name;

    if (!name) {
        alert("Please enter a name");
    } else {
        socket.emit("find", { name: name });

        document.getElementById("loading").style.display = "block";
        document.getElementById("find").disabled = true;
    }
});

socket.on("find", (e) => {
    let allPlayersArray = e.allPlayers;
    console.log("html", allPlayersArray);

    if (name) {
        document.getElementById("userCont").style.display = "block";
        document.getElementById("oppNameCont").style.display = "block";
        document.getElementById("valueCont").style.display = "block";
        document.getElementById("loading").style.display = "none";
        document.getElementById("name").style.display = "none";
        document.getElementById("find").style.display = "none";
        document.getElementById("enterName").style.display = "none";
        document.getElementById("bigcont").style.display = "block";
        document.getElementById("whosTurn").style.display = "block";
        document.getElementById("whosTurn").innerText = "X's Turn";
    }

    let oppName, value;
    const foundObject = allPlayersArray.find(obj =>
        obj.p1.p1name === name || obj.p2.p2name === name
    );

    oppName = foundObject.p1.p1name === name ? foundObject.p2.p2name : foundObject.p1.p1name;
    value = foundObject.p1.p1name === name ? foundObject.p1.p1value : foundObject.p2.p2value;

    document.getElementById("oppName").innerText = oppName;
    document.getElementById("value").innerText = value;
});

document.querySelectorAll(".btn").forEach(e => {
    e.addEventListener("click", function () {
        let value = document.getElementById("value").innerText;
        e.innerText = value;

        socket.emit("playing", { value: value, id: e.id, name: name });
    });
});

socket.on("playing", (e) => {
    const foundObject = e.allPlayers.find(obj =>
        obj.p1.p1name === name || obj.p2.p2name === name
    );

    let p1id = foundObject.p1.p1move;
    let p2id = foundObject.p2.p2move;

    document.getElementById("whosTurn").innerText = (foundObject.sum % 2 === 0) ? "O's Turn" : "X's Turn";

    if (p1id) {
        const p1Element = document.getElementById(p1id);
        p1Element.innerText = "X";
        p1Element.disabled = true;
        p1Element.style.color = "black";
    }

    if (p2id) {
        const p2Element = document.getElementById(p2id);
        p2Element.innerText = "O";
        p2Element.disabled = true;
        p2Element.style.color = "black";
    }

    check(name, foundObject.sum);
});

function check(name, sum) {


    document.getElementById("btn1").innerText == '' ? b1 = "a" : b1 = document.getElementById("btn1").innerText;
    document.getElementById("btn2").innerText == '' ? b2 = "b" : b2 = document.getElementById("btn2").innerText;
    document.getElementById("btn3").innerText == '' ? b3 = "c" : b3 = document.getElementById("btn3").innerText;
    document.getElementById("btn4").innerText == '' ? b4 = "d" : b4 = document.getElementById("btn4").innerText;
    document.getElementById("btn5").innerText == '' ? b5 = "e" : b5 = document.getElementById("btn5").innerText;
    document.getElementById("btn6").innerText == '' ? b6 = "f" : b6 = document.getElementById("btn6").innerText;
    document.getElementById("btn7").innerText == '' ? b7 = "g" : b7 = document.getElementById("btn7").innerText;
    document.getElementById("btn8").innerText == '' ? b8 = "h" : b8 = document.getElementById("btn8").innerText;
    document.getElementById("btn9").innerText == '' ? b9 = "i" : b9 = document.getElementById("btn9").innerText;


    if ((b1 == b2 && b2 == b3) || (b4 == b5 && b5 == b6) || 
        (b7 == b8 && b8 == b9) || (b1 == b4 && b4 == b7) || 
        (b2 == b5 && b5 == b8) || (b3 == b6 && b6 == b9) || 
        (b1 == b5 && b5 == b9) || (b3 == b5 && b5 == b7)) {

        socket.emit("gameOver", { name: name });

        setTimeout(() => {

            sum % 2 == 0 ? alert("X WON !!") : alert("O WON !!")

            setTimeout(() => {
                location.reload()

            }, 2000);

        }, 100);

    }

    else if (sum == 10) {
        socket.emit("gameOver", { name: name })

        setTimeout(() => {

            alert("DRAW!!")

            setTimeout(() => {
                location.reload()

            }, 2000);

        }, 100);
    }
}

