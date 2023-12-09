let variables_in_formulas = {
  "s = v*t": ["s", "v", "t"],
  "v = v0 + a*t": ["v", "v0", "a", "t"],
  "s = v0*t + (a*t**2)/2": ["s", "v0", "t", "a"],
  "v**2 - v0**2 = 2*a*s": ["v", "v0", "a", "s"],
  "F = m*a": ["F", "m", "a"],
};

let unit = {
  s: "m",
  v: "m/s",
  a: "m/s**2",
  t: "s",
  v0: "m/s",
  m: "kg",
  F: "N",
};

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
  a: { "m/s**2": 1 },
  t: { s: 1, min: 60, h: 3600, d: 86400 },
  v0: { "m/s": 1, "km/h": 1 / 3.6, knop: 0.5144 },
  m: { kg: 1, t: 1000, u: 1.660539e-27 },
  F: { N: 1, kp: 9.80665, dyn: 1e-5 },
};

function main() {
  let knownVariables = [
    ...document.querySelectorAll("input[type=checkbox]:checked"),
  ].map((x) => x.value);
  const search = document.querySelector("input[name=search]:checked").value;
  if (knownVariables.indexOf(search) != -1) {
    document.querySelector("output").innerHTML = `<p>Svar: ${
      parseFloat(document.querySelector(`#v_${search}`).value) *
      lookupTable[search][document.querySelector(`#e_${search}`).value]
    } ${unit[search]}</p>`;
    return;
  }
  let formula = findFormula(knownVariables, search, []);
  if (!formula) {
    document.querySelector("output").innerHTML = "<p>Ingen möjlig formel</p>";
  } else {
    let results = [];
    for (let i of formula) {
      for (let j of knownVariables) {
        i = i.replace(
          j,
          parseFloat(document.querySelector(`#v_${j}`).value) *
            lookupTable[j][document.querySelector(`#e_${j}`).value]
        );
      }
      results.push(eval(i));
    }
    document.querySelector(
      "output"
    ).innerHTML = `<p>Svar: ${results} ${unit[search]}</p>`;
  }
}

function findFormula(knownVariables, search, triedVariables) {
  let possible_formulas = Object.values(variables_in_formulas).filter(
    (formula) =>
      formula.indexOf(search) != -1 &&
      triedVariables.every((x) => formula.indexOf(x) == -1)
  );
  outer: for (let i of possible_formulas) {
    for (let j of i) {
      if (knownVariables.indexOf(j) == -1 && j != search) {
        continue outer;
      }
    }
    return rewriteFormula(i, search);
  }
  triedVariables.push(search);
  outer: for (let i of possible_formulas) {
    for (let j of i.filter(
      (x) => knownVariables.indexOf(x) == -1 && x != search
    )) {
      if (triedVariables.indexOf(j) != -1) {
        continue outer;
      }
      i = rewriteFormula(i, search);
      let new_list = [];
      let new_formula = findFormula(knownVariables, j, triedVariables);
      if (!new_formula) {
        return false;
      }
      for (let k of i) {
        for (let l of new_formula) {
          new_list.push(k.replace(j, l));
        }
      }
      return new_list;
    }
  }
  return false;
}

function rewriteFormula(formula, searchedVariable) {
  formula = Object.keys(variables_in_formulas).find(
    (k) => variables_in_formulas[k] === formula
  );
  if (formula == "s = v*t") {
    if (searchedVariable == "s") {
      return ["v*t"];
    } else if (searchedVariable == "v") {
      return ["s/t"];
    } else if (searchedVariable == "t") {
      return ["s/v"];
    }
  } else if (formula == "v = v0 + a*t") {
    if (searchedVariable == "v") {
      return ["v0 + a*t"];
    } else if (searchedVariable == "v0") {
      return ["v - a*t"];
    } else if (searchedVariable == "a") {
      return ["(v - v0)/t"];
    } else if (searchedVariable == "t") {
      return ["(v - v0)/a"];
    }
  } else if (formula == "s = v0*t + (a*t**2)/2") {
    if (searchedVariable == "s") {
      return ["v0*t + (a*t**2)/2"];
    } else if (searchedVariable == "v0") {
      return ["(s - (a*t**2)/2)/t"];
    } else if (searchedVariable == "t") {
      return ["(-v0+(v0**2-2*a*s)**0.5)/a", "(-v0-(v0**2-2*a*s)**0.5)/a"];
    } else if (searchedVariable == "a") {
      return ["2*(s-v0*t)/t**2"];
    }
  } else if (formula == "v**2 - v0**2 = 2*a*s") {
    if (searchedVariable == "v") {
      return ["(2*a*s - v0**2)**0.5"];
    } else if (searchedVariable == "v0") {
      return ["(v**2 - 2*a*s)**0.5"];
    } else if (searchedVariable == "a") {
      return ["(v**2 - v0**2)/(2*s)"];
    } else if (searchedVariable == "s") {
      return ["(v**2 - v0**2)/(2*a)"];
    }
  } else if (formula == "F = m*a") {
    if (searchedVariable == "F") {
      return ["m*a"];
    } else if (searchedVariable == "m") {
      return ["F/a"];
    } else if (searchedVariable == "a") {
      return ["F/m"];
    }
  }
  return false;
}
