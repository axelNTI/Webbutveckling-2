let variables_in_formulas = {
  "s = v*t": ["s", "v", "t"],
  "v = v0 + a*t": ["v", "v0", "a", "t"],
  "s = v0*t + (a*t**2)/2": ["s", "v0", "t", "a"],
  "v**2 - v0**2 = 2*a*s": ["v", "v0", "a", "s"],
  "F = m*a": ["F", "m", "a"],
};

function main() {
  const distance = document.querySelector("#distance").value.length
    ? "s"
    : undefined;
  const currentVelocity = document.querySelector("#currentVelocity").value
    .length
    ? "v"
    : undefined;
  const acceleration = document.querySelector("#acceleration").value.length
    ? "a"
    : undefined;
  const time = document.querySelector("#time").value.length ? "t" : undefined;
  const initialVelocity = document.querySelector("#initialVelocity").value
    .length
    ? "v0"
    : undefined;
  const mass = document.querySelector("#mass").value.length ? "m" : undefined;
  const force = document.querySelector("#force").value.length ? "F" : undefined;
  const search = document.querySelector("input[name=search]:checked").value;
  const knownVariables = [
    distance,
    currentVelocity,
    acceleration,
    time,
    initialVelocity,
    mass,
    force,
  ].filter(Boolean);
  let formula = findFormula(knownVariables, search, []);
  if (!formula) {
    console.log("Ingen möjlig formel");
  } else {
    console.log(formula);
  }
}

function findFormula(knownVariables, search, triedVariables) {
  console.log("find");
  let possible_formulas = Object.values(variables_in_formulas).filter(
    (formula) =>
      formula.indexOf(search) != -1 &&
      triedVariables.every((x) => formula.indexOf(x) == -1)
  );
  console.log(possible_formulas);
  outer: for (let i of possible_formulas) {
    for (let j of i) {
      if (knownVariables.indexOf(j) == -1 && j != search) {
        continue outer;
      }
    }
    console.log(i);
    return rewriteFormula(i, search);
  }
  triedVariables.push(search);
  console.log(possible_formulas);
  outer: for (let i of possible_formulas) {
    for (let j of i.filter(
      (x) => knownVariables.indexOf(x) == -1 && x != search
    )) {
      if (triedVariables.indexOf(j) != -1) {
        continue outer;
      }
      i = rewriteFormula(i, search);
      let new_list = [];
      console.log("yep");
      let new_formula = findFormula(knownVariables, j, triedVariables);
      console.log(new_formula);
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
  console.log("rewrite");
  console.log(formula);
  console.log(searchedVariable);
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
