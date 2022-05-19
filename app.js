const fs = require('fs');
const model = require('./model.js');
const prompt = require('prompt');

const studentArray = tryToLoadData()
let modifyPosition

function startMenu(){

    console.log('Sono disponibili 5 opzioni:');
    console.log('1) Visualizza studenti');
    console.log('2) Inserisci studente');
    console.log('3) Cerca studente');
    console.log('4) Elimina studente');
    console.log('5) Modifica studente');
    console.log('6) Esci');
  
    
  
    const schema = {
      properties:{
        selection: {
            description: 'seleziona una delle opzioni'
        }
      }
    }
  
    prompt.get(schema, startMenuDone);
}

function startMenuDone(err, res){
    switch (res.selection) {
      case '1':
        visulizeStudents(studentArray)
        startMenu();
        break;
      case '2':
        insertStudent()
        break;
      case '3':
        searchStudent()
        break;
      case '4':
        removeStudent()
        break;
      case '5':
        editStudent()
        break;
      case '6':
        console.log('ciao ciao')
        process.exit();
      default:
        console.log('opzione non valida');
        startMenu();
        break;
    }
  }

  function editStudent(){
    console.log("Ecco gli studenti attualmente registrati:")
    visulizeStudents(studentArray);
  
    const schema = {
      properties: {
        selectedIndex: {
          description: 'inserisci il numero dello studente da modificare'
        }
      }
    }
  
    prompt.get(schema, executeEditStudent);
  }

  function executeEditStudent(err, res){
    const selectedIndex = parseInt(res.selectedIndex);
  
    if (selectedIndex === NaN) {
      startMenu()
      return;
    }
  
    const index = selectedIndex - 1;
  
    const isInArray = index >= 0 && index < studentArray.length;
  
    if (isInArray) {

        const currentStudent = studentArray[index] 
      
        let gender;
        if(currentStudent.gender ===  model.Student.GENDER.male){
            gender = "m"
        }else  if(currentStudent.gender ===  model.Student.GENDER.female){
            gender = "f"
        }else{
            gender = "n"
        }
    

        const schema = {
            properties: {
                name:{
                    description: 'inserisci il nome',
                    default: currentStudent.name
                },
                surname:{
                    description: 'inserire il cognome',
                    default:  currentStudent.surname
                },
                gender:{
                    description: 'inserire il genere ("m" => maschile, "f" => femminile, "n" => non definito)',
                    default: gender
                },
                yob:{
                    description: 'inserire l\'anno di nascita',
                    default: currentStudent.yob
                }
            }
        }

        modifyPosition = index
    
        prompt.get(schema, modifyStudentDone);
     

    } else {
      console.log("indice non trovato");
      startMenu()
      return;
    }
  
  }


  function modifyStudentDone(err, res){
    let gender;
    if (res.gender === 'm') {
      gender = model.Student.GENDER.male;
    } else if (res.gender === 'f'){
      gender = model.Student.GENDER.female;
    } else {
      gender = model.Student.GENDER.undefined;
    }
  
    const student = new model.Student(res.name, res.surname, gender, parseInt(res.yob));

    studentArray[modifyPosition] = student
    
  
    tryToSaveData()
  
    startMenu();
  }

  function removeStudent(){
    console.log("Ecco gli studenti attualmente registrati:")
    visulizeStudents(studentArray);
  
    const schema = {
      properties: {
        selectedIndex: {
          description: 'inserisci il numero dello studente da eliminare'
        }
      }
    }
  
    prompt.get(schema, executeRemoveStudent);
  }
  
  function executeRemoveStudent(err, res){
    const humanIndex = parseInt(res.selectedIndex);
  
    if (humanIndex === NaN) {
      startMenu()
      return;
    }
  
    const index = humanIndex - 1;
  
    const isInArray = index >= 0 && index < studentArray.length;
  
    if (isInArray) {
      studentArray.splice(index, 1);
      tryToSaveData();
      startMenu();
    } else {
      console.log("indice non trovato");
      startMenu()
      return;
    }
  
  }
  
  function searchStudent() {
    const schema = {
      properties: {
        searchWord: {
          description: 'inserisci la parola da cercare'
        }
      }
    }
  
    prompt.get(schema, executeSearch);
  }
function executeSearch(err, res){

    const tempArray = [];
  
    for (const student of studentArray) {
  
      const foundInName = student.name.toLowerCase().includes(res.searchWord.toLowerCase());
      const foundInSurname = student.surname.toLowerCase().includes(res.searchWord.toLowerCase());
  
      if ( foundInName || foundInSurname) {
        tempArray.push(student);
      }
    }
  
    // const tempArray = studentArray.filter(filterFunction)
    
  
    visulizeStudents(tempArray);
    startMenu();
  }
  
  function insertStudent(){

    const schema = {
      properties: {
        name:{
          description: 'inserisci il nome'
        },
        surname:{
          description: 'inserire il cognome'
        },
        gender:{
          description: 'inserire il genere ("m" => maschile, "f" => femminile, "n" => non definito)'
        },
        yob:{
          description: 'inserire l\'anno di nascita'
        }
      }
    }
  
    prompt.get(schema, insertStudentDone);
  
  }

  function insertStudentDone(err, res){
    let gender;
    if (res.gender === 'm') {
      gender = model.Student.GENDER.male;
    } else if (res.gender === 'f'){
      gender = model.Student.GENDER.female;
    } else {
      gender = model.Student.GENDER.undefined;
    }
  
    const student = new model.Student(res.name, res.surname, gender, parseInt(res.yob));
  
    studentArray.push(student);
  
    tryToSaveData()
  
    startMenu();
  }


function tryToSaveData(){

    const jsonArray = JSON.stringify(studentArray, null ,2);

    try {
        fs.writeFileSync('./student-data.json', jsonArray);
    } catch (error) {
        console.log('errore nel salvataggio');
    }

}
  


  function tryToLoadData(){
  
    let array;
  
    try {
      const jsonArray = fs.readFileSync('./student-data.json', 'utf8');
      array = JSON.parse(jsonArray)
    } catch (err) {
      array = [];
    }
  
    const studArray = []
  
    for (const obj of array) {
      const student = model.Student.createStudentFromOBject(obj)
      studArray.push(student);
    }
  
    return studArray;
  
  }

  function visulizeStudents(arrayToVisulize){

    for (let i = 0; i < arrayToVisulize.length; i++) {
      const student = arrayToVisulize[i];
      const humanIndex = i + 1;
      console.log(humanIndex + ') ' + student.toString());
      console.log('------------------------')
    }
  
    // for (const student of arrayToVisulize) {
    //   console.log(student.toString());
    //   console.log('------------------------')
    // }
  
  
  }

  
prompt.start()
startMenu();



//const student = studenArray[index];
//if(res.name){
//   student.name = res.name;
// }
// student.surname = res.surname ? res.surname : student.surname;
// student.gender = gender;
// student.yob = res.yob || student.yob