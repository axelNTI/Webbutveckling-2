// Formler i strängformat och som enskilda storheter
let variables_in_formulas = {
  "v = v0 + a*t": ["v", "v0", "a", "t"],
  "s = v0*t + (a*t**2)/2": ["s", "v0", "t", "a"],
  "v**2 - v0**2 = 2*a*s": ["v", "v0", "a", "s"],
  "F = m*a": ["F", "m", "a"],
};

// Storheter och dess SI-enhet
let unit = {
  s: "m",
  v: "m/s",
  a: "m/s^2",
  t: "s",
  v0: "m/s",
  m: "kg",
  F: "N",
};

// Omvandling av värden till storhetens SI-enhet
let lookupTable = {
  s: {
    m: 1,
    Å: 1e-10,
    ly: 9.461e15,
    pc: 3.0857e16,
    AU: 1.496e11,
    "n.m.": 1852,
  },
  v: { "m/s": 1, "km/h": 1 / 3.6, knop: 0.5144 },
  a: { "m/s^2": 1 },
  t: { s: 1, min: 60, h: 3600, d: 86400 },
  v0: { "m/s": 1, "km/h": 1 / 3.6, knop: 0.5144 },
  m: { kg: 1, t: 1000, u: 1.660539e-27 },
  F: { N: 1, kp: 9.80665, dyn: 1e-5 },
};

//Hanterar input och output på sidan. Kallas när "Beräkna"-knappen trycks.
function main() {
  // Skapar en lista av alla kända storheter.
  let knownVariables = [
    ...document.querySelectorAll("input[type=checkbox]:checked"),
  ].map((x) => x.value);

  // Sökta storheten
  const search = document.querySelector("input[name=search]:checked").value;

  // Skriver ut den sökta storhetens värde om den är känd.
  if (knownVariables.indexOf(search) != -1) {
    let value =
      parseFloat(document.querySelector(`#v_${search}`).value) *
      lookupTable[search][document.querySelector(`#e_${search}`).value];
    if (isNaN(value)) {
      document.querySelector(
        "output"
      ).innerHTML = `<p>Minst en storhet saknade värde</p>`;
      return;
    }
    document.querySelector(
      "output"
    ).innerHTML = `<p>Svar: ${value} ${unit[search]}</p>`;
    return;
  }

  // Använder funktionen nedan för att hitta en fungerande formel 
  let formula = findFormula(knownVariables, search, []);

  // Om ingen formel fungerar
  if (!formula) {
    document.querySelector("output").innerHTML = "<p>Ingen möjlig formel</p>";
    return;
  }

  // Räknar ut formelns värde
  let results = [];
  for (let i of formula) {
    for (let j of knownVariables) {
      // Byter storheter mot deras värde i SI-enheter
      i = i.replaceAll(
        j,
        parseFloat(document.querySelector(`#v_${j}`).value) *
          lookupTable[j][document.querySelector(`#e_${j}`).value]
      );
    }
    // Räknar ut formelns värde
    results.push(eval(i));
  }

  // Om flera möjliga svar finns, skriver ut alla.
  if (Array.isArray(results)) {
    let str = "<p>";
    for (let i of results) {
      if (!isNaN(i)) {
        str += `${results} ${unit[search]}, `;
      }
    }
    if (str.length == 3) {
      document.querySelector("output").innerHTML = "<p>Ingen möjlig formel</p>";
      return;
    }
    document.querySelector("output").innerHTML = `${str} </p>`;
    return;
  }
  // Skrivs ut om ingen formel fungerar
  if (isNaN(results)) {
    document.querySelector("output").innerHTML = "<p>Ingen möjlig formel</p>";
    return;
  }

  // Skriver ut formelns värde
  document.querySelector(
    "output"
  ).innerHTML = `<p>Svar: ${results} ${unit[search]}</p>`;
}

// Rekursivt söker igenom formler och kombinerar dem för att få en formel som ger svaret
function findFormula(knownVariables, search, triedVariables) {
  // Skapar en array av alla möjliga formler med den sökta storheten och testade storheten i åtanke
  let possible_formulas = Object.values(variables_in_formulas).filter(
    (formula) =>
      formula.indexOf(search) != -1 &&
      triedVariables.every((x) => formula.indexOf(x) == -1)
  );
  // Kollar om en formel kan ge svaret utan kombinering
  outer: for (let i of possible_formulas) {
    for (let j of i) {
      if (knownVariables.indexOf(j) == -1 && j != search) {
        continue outer;
      }
    }

    // Skickar tillbaka den hittade formeln omskriven för att bryta ut den sökta storheten
    return rewriteFormula(i, search);
  }
  triedVariables.push(search);

  // Rekursivt söker igenom formler för att kombinera dem
  outer: for (let i of possible_formulas) {
    for (let j of i.filter(
      (x) => knownVariables.indexOf(x) == -1 && x != search
    )) {
      // Utesluter en formlen om en storhet redan är testad
      if (triedVariables.indexOf(j) != -1) {
        continue outer;
      }
      i = rewriteFormula(i, search);
      let new_list = [];

      // Rekursivt söker igenom formler
      let new_formula = findFormula(knownVariables, j, triedVariables);
      if (!new_formula) {
        return false;
      }

      // Byter ut alla instanser av den okända storheten med den nya formeln
      for (let k of i) {
        for (let l of new_formula) {
          new_list.push(k.replaceAll(j, l));
        }
      }
      return new_list;
    }
  }

  // Skickar tillbaka för att representera att ingen formel finns
  return false;
}

// Skriver om en formel genom att bryta ut den sökta storheten.
function rewriteFormula(formula, searchedVariable) {
  formula = Object.keys(variables_in_formulas).find(
    (k) => variables_in_formulas[k] === formula
  );
  if (formula == "v = v0 + a*t") {
    if (searchedVariable == "v") {
      return ["(v0 + a*t)"];
    } else if (searchedVariable == "v0") {
      return ["(v - a*t)"];
    } else if (searchedVariable == "a") {
      return ["((v - v0)/t)"];
    } else if (searchedVariable == "t") {
      return ["((v - v0)/a)"];
    }
  } else if (formula == "s = v0*t + (a*t**2)/2") {
    if (searchedVariable == "s") {
      return ["(v0*t + (a*t**2)/2)"];
    } else if (searchedVariable == "v0") {
      return ["((s - (a*t**2)/2)/t)"];
    } else if (searchedVariable == "t") {
      let v0 = parseFloat(document.querySelector("#v_v0").value);
      let s = parseFloat(document.querySelector("#v_s").value);
      if (v0 == 0) {
        return ["((2*s/a)**0.5)"];
      } else if (s == 0) {
        return ["(-(2*v0/a))"];
      } else {
        return ["((-v0+(v0**2-2*a*s)**0.5)/a)", "((-v0-(v0**2-2*a*s)**0.5)/a)"];
      }
    } else if (searchedVariable == "a") {
      return ["(2*(s-v0*t)/t**2)"];
    }
  } else if (formula == "v**2 - v0**2 = 2*a*s") {
    if (searchedVariable == "v") {
      return ["((2*a*s - v0**2)**0.5)"];
    } else if (searchedVariable == "v0") {
      return ["((v**2 - 2*a*s)**0.5)"];
    } else if (searchedVariable == "a") {
      return ["((v**2 - v0**2)/(2*s))"];
    } else if (searchedVariable == "s") {
      return ["((v**2 - v0**2)/(2*a))"];
    }
  } else if (formula == "F = m*a") {
    if (searchedVariable == "F") {
      return ["(m*a)"];
    } else if (searchedVariable == "m") {
      return ["(F/a)"];
    } else if (searchedVariable == "a") {
      return ["(F/m)"];
    }
  }
  return false;
}
