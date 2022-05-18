class Student{

    static GENDER = {
      male: 'maschile',
      female: 'femminile',
      undefined: 'non definito'
    }
  
    static createStudentFromOBject(obj){
      return new Student(obj.name, obj.surname, obj.gender, obj.yob);
    }
  
    constructor(name, surname, gender, yob){
      this.name = name;
      this.surname = surname;
      this.gender = gender;
      this.yob = yob;
    }
  
    toString(){
      const studentString = 'Nome: ' + this.name + '\n' +
                            'Cognome: ' + this.surname + '\n' +
                            'Genere: ' + this.gender + '\n' +
                            'Età: ' + (new Date().getFullYear() - this.yob) + '\n';
  
      return studentString;
    }
  }
  
  exports.Student = Student;