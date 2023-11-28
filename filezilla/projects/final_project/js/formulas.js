function main() {
  const distance = parseInt(document.querySelector("#distance").value);
  const currentVelocity = parseInt(
    document.querySelector("#currentVelocity").value
  );
  const acceleration = parseInt(document.querySelector("#acceleration").value);
  const time = parseInt(document.querySelector("#time").value);
  const initialVelocity = parseInt(
    document.querySelector("#initialVelocity").value
  );
  const mass = parseInt(document.querySelector("#mass").value);
  const force = parseInt(document.querySelector("#force").value);
  const search = document.querySelector("input[name=search]:checked").value;
  console.log(search);
}

function rewriteVariable(formula, searchedVariable) {
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
  }
}
