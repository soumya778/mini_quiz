let currPlayer=0;
let players=[];
let currQuesIndex=0;
let questions=[];
let playerScore=[0,0];
let numQuestions=6;

async function fetchCategory(){
    
   const categryContainer=document.getElementById('categories');
   let selectedCategory=null;
   const startButton=document.getElementById('button');

   try{
    const response= await fetch('https://the-trivia-api.com/api/categories');

    if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
    }

    const data=await response.json()
    console.log(data);
    
    categryContainer.innerHTML="";

    for(let category in data){
        const categeoryElement=document.createElement("div");
        categeoryElement.textContent=category;
        categeoryElement.className="cateType";

        categeoryElement.addEventListener("click",()=>{
            const allCategories=document.querySelectorAll(".cateType");
            allCategories.forEach(el=>el.classList.remove("selected"));
            categeoryElement.classList.add("selected");
            selectedCategory=category;
        })
        
        categryContainer.appendChild(categeoryElement);
    }
    const button=document.createElement('button');
    button.textContent="Start Game";
    button.id="startGameButton";

    button.addEventListener("click",()=>{
        if(selectedCategory){
            startGame(selectedCategory)
        }
        else{
            alert("Please select a category to start the game.");
        }
    })

    startButton.appendChild(button);
   }
   catch(err){
    categryContainer.innerHTML = `Error fetching categories: ${err.message}`;
   }

   document.getElementById('sheet').style.display = 'none';
   document.getElementById('selectCategory').style.display = 'block';
}

document.getElementById('getNext').addEventListener('click',()=>{
    const ply1 = document.getElementById('player1').value.trim();
    const ply2 = document.getElementById('player2').value.trim();
    if (!ply1 || !ply2) {
        alert("Please enter names for both Player 1 and Player 2.");
        return;
    }
    players = [ply1, ply2];
    
    console.log(players);

    fetchCategory();
    })



async function startGame(selectCategory){
    console.log("Starting Game");
    
    try{
        const response=await fetch(`https://the-trivia-api.com/api/questions?categories=${selectCategory}&limit=${numQuestions}`);

        if(!response.ok){
            throw new Error(`An error occured: ${response.statusText}`)
        }
        questions=await response.json();
        console.log('Fetched Questions',questions);

         displayQues();

         document.getElementById('selectCategory').style.display = 'none';
         document.getElementById('quesContainer').style.display = 'block';
    }
    catch (err) {
        alert(`Failed to fetch questions: ${err.message}`);
    }
}

function displayQues(){
    const quesContainer=document.getElementById("quesContainer");
    const ques=questions[currQuesIndex];
     
    const plyName=document.createElement("div");
    plyName.textContent=players[currPlayer].toUpperCase()+"'s turn";
    plyName.id="displayName"

    quesContainer.innerHTML=" ";

    const quesElement=document.createElement('div');
    quesElement.className='question';
    quesElement.textContent=ques.question;
    

    const ansContainer=document.createElement("div");
    ansContainer.className='answers';

    const allAnswer=[...ques.incorrectAnswers,ques.correctAnswer];
    allAnswer.sort(()=>Math.random()-0.5);
   
    let ansSelected=false;

    allAnswer.forEach(answer=>{
        const ansElement=document.createElement('button');
        ansElement.textContent=answer;
        ansElement.className='answer';
        ansElement.addEventListener('click',()=>{
            if(ansSelected){
                return;
            }
            ansElement.classList.add('ansSelect');
            ansSelected=true;
            handleAns(answer);
            document.getElementById('nextButton').disabled=false;
        })
        ansContainer.appendChild(ansElement)
    })
    quesContainer.appendChild(plyName)
    quesContainer.appendChild(quesElement);
    quesContainer.appendChild(ansContainer);

    const nextButton=document.createElement('button');
    nextButton.textContent="Next";
    nextButton.id='nextButton';
    nextButton.disabled=true;
    nextButton.addEventListener("click",nextQuestion);
    quesContainer.appendChild(nextButton);
}

function handleAns(selectedAns){
    const ques=questions[currQuesIndex];
    const correctAns=ques.correctAnswer;
    if(selectedAns==correctAns){
        alert("Correct Answer👍🎉🎉");
        playerScore[currPlayer]++;
    }
    else{
        alert(`Wrong Answer! Correct was: ${correctAns}`);
    }
}

function nextQuestion(){
    currQuesIndex++;
    if(currQuesIndex>=numQuestions){
        showResult();
    }
    else{
        currPlayer=(currPlayer+1)%players.length;
        displayQues();
    }
}

function showResult(){

    const resultMessage = document.createElement("div");
    resultMessage.id="resContainer"
    resultMessage.textContent =
        playerScore[0] > playerScore[1]
            ? `${players[0]} wins with ${playerScore[0]} points!😎🎉🎉`
            : playerScore[0] < playerScore[1]
            ? `${players[1]} wins with ${playerScore[1]} points!😎🎉🎉`
            : "It's a tie!🙌👏";

    resultContainer.innerHTML = "";

    resultContainer.appendChild(resultMessage);

    const buttonContainer=document.createElement("div");
    buttonContainer.id = "buttonContainer"; 

    const endBttn=document.createElement("button");
    endBttn.textContent="End Game"
    endBttn.id = "gameBtn";
    endBttn.onclick=endGame;

    buttonContainer.appendChild(endBttn);

    resultContainer.appendChild(buttonContainer)


    document.getElementById('quesContainer').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'block';
}

function endGame(){
    const displayEnd=document.getElementById("theEnd")
    displayEnd.textContent="Thanks😊 for playing the Game"

    document.getElementById('resultContainer').style.display = 'none';
    document.getElementById('theEnd').style.display = 'block';
}

