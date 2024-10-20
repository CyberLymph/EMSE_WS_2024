Skip to content
GitLab

Explore
Sign in
Primary navigation
Project
E
EMSE_WS_2024

Manage

Plan

Code

Build

Deploy

Operate

Monitor

Analyze
Stefan Udo Hanenberg
EMSE_WS_2024
emse_ws_2024
Uebung01
code.js
user avatar
Uebung 01
Stefan authored 6 days ago
dea8a22c
code.js
4.25 KiB
document.set_seed('42');
let varnames = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"];
function generate_random_assignment() {
    return new Assignment();
}
function generate_random_if_statement(max_depth, depth) {
    return new IfStatment(max_depth, depth+1);
}
function random_condition() {
    return varnames[document.new_random_integer(varnames.length)]
        + "=="
        + varnames[document.new_random_integer(varnames.length)];
}
function generate_random_statements(max_depth, depth) {
    if(depth >= max_depth) {
        let statement = new Statements();
        statement.statementList.push(generate_random_assignment());
        return statement;
    }
    let statements = new Statements();
    for(let counter = 0; counter <= document.new_random_integer(4); counter++) {
        if(document.new_random_integer(2) < 1) {
            statements.statementList.push(generate_random_if_statement(max_depth, depth + 1));
        } else {
            statements.statementList.push(generate_random_assignment());
        }
    }
    return statements;
}
class Statements {
      statementList = [];
      indented_string() {
          let arr = [];
          this.write_to_array(arr, 0, true);
          return arr.join("");
      }
    non_indented_string() {
        let arr = [];
        this.write_to_array(arr, 0, false);
        return arr.join("");
    }
    number_of_non_conditional_statements() {
        let counter = 0;
        for (let statement of this.statementList) {
            if(statement instanceof Assignment)
                counter++;
        }
        return counter;
    }
    write_to_array(array, indentation_level, is_indented) {
        for (let statement of this.statementList) {
            statement.write_to_array(array, indentation_level, is_indented);
            array.push("\n");
        }
    }
}
class IfStatment {
    statementList = null;

    constructor(max_depth, depth) {
        if (depth > max_depth) {
            this.statementList = generate_random_statements(1, 1);
        } else {
            this.statementList = generate_random_statements(max_depth, depth + 1);
        }
    }

    write_to_array(array, indentation_level, is_indented) {
        if(is_indented) {
            array.push(" ".repeat(indentation_level * 2) + "if(" + random_condition() + "){\n")
        } else {
            array.push("if(" + random_condition() + "){\n")
        }
        this.statementList.write_to_array(array, indentation_level + 1, is_indented);
        if(is_indented) {
            array.push(" ".repeat(indentation_level * 2) + "}")
        } else {
            array.push("}")
        }
    }
}
class Assignment {
    write_to_array(array, indentation_level, is_indented) {
        let assigment_string = varnames[document.new_random_integer(varnames.length)] + "=" + varnames[document.new_random_integer(varnames.length)];

        if(is_indented) {
            array.push(" ".repeat(indentation_level * 2) + assigment_string)
        } else {
            array.push(assigment_string);
        }
    }
}

// Das hier ist die eigentliche Experimentdefinition
document.experiment_definition(
    {
        experiment_name:"EMSE Test 01",
        seed:"42",
        introduction_pages:["Counter, how many lines are ALWAYS executed (not contained in if) .... Press [Enter]"],
        pre_run_instruction:"Really do this.... Press [Enter]",
        finish_pages:["Ok, done - download.... Press [Enter]"],

        layout:[
            {variable:"Format",treatments:["Einr", "NichtEinr"]},
        ],
        repetitions:10,                    // Anzahl der Wiederholungen pro Treatmentcombination
        accepted_responses:["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], // Tasten, die vom Experiment als Eingabe akzeptiert werden

        task_configuration:(t)=>{

            let s = generate_random_statements(5, 0);

            if (t.treatment_combination[0].value=="Einr") // fragt, ob die erste Variable (die einzige) den Wert "indented" hat
                t.code = s.indented_string();
            else
                t.code = s.non_indented_string();

            t.expected_answer = "" + s.number_of_non_conditional_statements();

            t.after_task_string = ()=>"The correct answer for the code was: " + t.expected_answer;
        }
    }
);