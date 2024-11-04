// Verwende eine alternative Methode für die Zufallszahlengenerierung
let seed = 42; // Statischer Seed-Wert zur Reproduzierbarkeit
let varnames = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"];

function seeded_random() {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function generate_random_integer(max) {
    return Math.floor(seeded_random() * max);
}

function generate_random_assignment() {
    return new Assignment();
}

function generate_random_if_statement(max_depth, depth) {
    return new IfStatment(max_depth, depth + 1);
}

function random_condition() {
    return varnames[generate_random_integer(varnames.length)]
        + "=="
        + varnames[generate_random_integer(varnames.length)];
}

function generate_random_statements(max_depth, depth) {
    if (depth >= max_depth) {
        let statement = new Statements();
        statement.statementList.push(generate_random_assignment());
        return statement;
    }
    let statements = new Statements();
    for (let counter = 0; counter <= generate_random_integer(4); counter++) {
        if (generate_random_integer(2) < 1) {
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
            if (statement instanceof Assignment)
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
        if (is_indented) {
            array.push(" ".repeat(indentation_level * 2) + "if(" + random_condition() + "){\n");
        } else {
            array.push("if(" + random_condition() + "){\n");
        }
        this.statementList.write_to_array(array, indentation_level + 1, is_indented);
        if (is_indented) {
            array.push(" ".repeat(indentation_level * 2) + "}");
        } else {
            array.push("}");
        }
    }
}

class Assignment {
    write_to_array(array, indentation_level, is_indented) {
        let assignment_string = varnames[generate_random_integer(varnames.length)] + "=" + varnames[generate_random_integer(varnames.length)];

        if (is_indented) {
            array.push(" ".repeat(indentation_level * 2) + assignment_string);
        } else {
            array.push(assignment_string);
        }
    }
}

// Experimentdefinition
document.experiment_definition(
    {
        experiment_name: "Indentation Error Detection",
        seed: "42",
        introduction_pages: ["In this experiment, you will see code blocks with or without correct indentation. Your task is to determine whether the code contains an error. Press [Enter] to continue."],
        pre_run_instruction: "Look carefully at the code and decide if there is an error. Press [Enter] to start.",
        finish_pages: ["The experiment is now complete. Press [Enter] to finish."],

        layout: [
            {variable: "Format", treatments: ["MitEinr", "OhneEinr"]},
        ],
        repetitions: 10, // Anzahl der Wiederholungen pro Behandlung

        accepted_responses: ["Ja", "Nein"], // Mögliche Antworten: Ja (Fehler gefunden), Nein (Kein Fehler)

        task_configuration: (t) => {
            let s = generate_random_statements_with_errors(5, 0);

            if (t.treatment_combination[0].value == "MitEinr") {
                t.code = s.indented_string();
            } else {
                t.code = s.non_indented_string();
            }

            // Zufällig entscheiden, ob ein Fehler im Code sein soll
            if (generate_random_integer(2) < 1) {
                t.code = introduce_error_in_code(t.code);
                t.expected_answer = "Ja";
            } else {
                t.expected_answer = "Nein";
            }

            t.after_task_string = () => "The correct answer for the code was: " + t.expected_answer;
        }
    }
);

function generate_random_statements_with_errors(max_depth, depth) {
    if (depth >= max_depth) {
        return new StatementsWithError();
    }
    let statements = new StatementsWithError();
    for (let counter = 0; counter <= generate_random_integer(4); counter++) {
        if (generate_random_integer(2) < 1) {
            statements.statementList.push(generate_random_if_statement_with_errors(max_depth, depth + 1));
        } else {
            statements.statementList.push(generate_random_assignment());
        }
    }
    return statements;
}

function generate_random_if_statement_with_errors(max_depth, depth) {
    return new IfStatementWithError(max_depth, depth + 1);
}

function introduce_error_in_code(code) {
    // Zufällig eine fehlende Klammer oder eine falsche Bedingung einführen
    if (generate_random_integer(2) < 1) {
        return code.replace("}", ""); // Entfernt eine geschweifte Klammer
    } else {
        return code.replace("==", "="); // Verändert die Bedingung
    }
}

class StatementsWithError extends Statements {
    // Erweiterte Klasse von Statements, die zufällige Fehler einführt.
}

class IfStatementWithError extends IfStatment {
    // Erweiterte Klasse von IfStatement, die ebenfalls zufällige Fehler einführt.
}
