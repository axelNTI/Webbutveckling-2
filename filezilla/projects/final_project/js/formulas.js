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
  const usedVariables = [
    distance,
    currentVelocity,
    acceleration,
    time,
    initialVelocity,
    mass,
    force,
  ].filter(Boolean);
  let formula = findFormula(usedVariables, search);
  let key = Object.keys(variables_in_formulas).find(
    (k) => variables_in_formulas[k] === formula
  );
  console.log(search)
  let finalFormula = rewriteFormula(key, search);
  console.log(finalFormula);
}

function findFormula(usedVariables, search) {
  let possible_formulas = Object.values(variables_in_formulas).filter(
    (formula) => formula.indexOf(search) != -1
  );
  console.log(possible_formulas)
  outer: for (let i of possible_formulas) {
    for (let j of i) {
      if (usedVariables.indexOf(j) == -1 && j != search) {
        continue outer;
      }
    }
    return i;
  }
  return RecursiveSearch(usedVariables, possible_formulas, search);
}

function RecursiveSearch(usedVariables, possible_formulas, search) {
  console.log(usedVariables)
  for (let i of possible_formulas) {
    for (let j of i.filter(
      (x) => usedVariables.indexOf(x) == -1 && x != search
    )) {
      return findFormula(usedVariables, j);
    }
  }
}

function rewriteFormula(formula, searchedVariable) {
  if (formula == "s = v*t") {
    if (searchedVariable == "s") {
      return ["s = v*t"];
    } else if (searchedVariable == "v") {
      return ["v = s/t"];
    } else {
      return ["t = s/v"];
    }
  } else if (formula == "v = v0 + a*t") {
    if (searchedVariable == "v") {
      return ["v = v0 + a*t"];
    } else if (searchedVariable == "v0") {
      return ["v0 = v - a*t"];
    } else if (searchedVariable == "a") {
      return ["a = (v - v0)/t"];
    } else {
      return ["t = (v - v0)/a"];
    }
  } else if (formula == "s = v0*t + (a*t**2)/2") {
    if (searchedVariable == "s") {
      return ["s = v0*t + (a*t**2)/2"];
    } else if (searchedVariable == "v0") {
      return [""];
    }
  } else if (formula == "F = m*a") {
    if (searchedVariable == "F") {
      return ["F = m*a"];
    }
  }
}
