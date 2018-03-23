let jsonInputElement = document.getElementById('json-file');
let ymlInputElement = document.getElementById('swagger-file');
let requestInputElement = document.getElementById('request-url');

const newLine = "\n";

function isDict(v) {
    return (typeof v==='object') && (v!==null) && (!(v instanceof Array)) && (!(v instanceof Date));
}

function indent(tabCount) {
  return Array(2*tabCount).join(" ");
}

function buildSwaggerHeader() {
  const mainTitle = "TODO - Switch this title to an appropriate description";
  const separator = "---";
  const tagsTitle = "tags:"
  const parameters = "parameters: todo - add parameters if necessary"
  const tag = "todo-change-this-tag"

  output = mainTitle + newLine;
  output += separator + newLine;
  output += tagsTitle + newLine;
  output += indent(1);
  output += `- ${tag}` + newLine;
  output += parameters + newLine;

  return output
}

function buildSwaggerCore(jsonValue) {
  let swaggerCore = "responses:";
  swaggerCore += newLine;
  swaggerCore += indent(1);
  swaggerCore += "200:";
  swaggerCore += newLine;
  swaggerCore += indent(2);
  swaggerCore += "description: TODO - Change this description"
  swaggerCore += newLine;
  swaggerCore += indent(2);
  swaggerCore += "schema:"
  swaggerCore += newLine;

  return swaggerCore;
}

function buildSwaggerArchitecture(currentIndent, json) {
  let swaggerArchitecture = "";

  if (Array.isArray(json)) {
    if (json.length === 0) {
      swaggerArchitecture += indent(currentIndent);
      swaggerArchitecture += "type: array";
      swaggerArchitecture += newLine;
      swaggerArchitecture += indent(currentIndent + 1);
      swaggerArchitecture += "TODO - array was empty, could not find sub-architecture";
      swaggerArchitecture += newLine;
    } else {
      const firstElement = json[0];
      swaggerArchitecture += indent(currentIndent);
      swaggerArchitecture += "type: array";
      swaggerArchitecture += newLine;
      swaggerArchitecture += indent(currentIndent);
      swaggerArchitecture += "items:";
      swaggerArchitecture += newLine;
      swaggerArchitecture += buildSwaggerArchitecture(currentIndent + 1, firstElement);
    }
  } else if (isDict(json)) {
    swaggerArchitecture += indent(currentIndent);
    swaggerArchitecture += "type: object";
    swaggerArchitecture += newLine;
    swaggerArchitecture += indent(currentIndent);
    swaggerArchitecture += "properties:";
    swaggerArchitecture += newLine;
    if (Object.keys(json).length === 0) {
      swaggerArchitecture += indent(currentIndent + 1);
      swaggerArchitecture += "TODO - dict was empty, could not find sub-architecture";
      swaggerArchitecture += newLine;
    } else {
      for (var key in json) {
        swaggerArchitecture += indent(currentIndent + 1);
        swaggerArchitecture += key + ":";
        swaggerArchitecture += newLine;
        swaggerArchitecture += buildSwaggerArchitecture(currentIndent + 2, json[key]);
      }
    }
  } else if (typeof json === "string") {
    swaggerArchitecture += indent(currentIndent);
    swaggerArchitecture += "type: string";
    swaggerArchitecture += newLine;
  } else if (typeof json === "boolean") {
    swaggerArchitecture += indent(currentIndent);
    swaggerArchitecture += "type: boolean";
    swaggerArchitecture += newLine;
  } else if (typeof json === "number") {
    swaggerArchitecture += indent(currentIndent);
    if (Number.isInteger(json)) {
      swaggerArchitecture += "type: integer";
    } else {
      swaggerArchitecture += "type: float";
    }
    swaggerArchitecture += newLine;
  } else if (json === null) {
    swaggerArchitecture += indent(currentIndent);
    swaggerArchitecture += "type: TODO - value was null, could not detect sub-architecture";
    swaggerArchitecture += newLine;
  }
  return swaggerArchitecture
}

function generateSwagger(json) {
  let swaggerOutput = buildSwaggerHeader();
  swaggerOutput += buildSwaggerCore(json);
  const currentIndent = 3;
  swaggerOutput += buildSwaggerArchitecture(currentIndent, json);
  return swaggerOutput;
}

function handleJsonSubmit(event) {
  event.preventDefault();

  const jsonInputValue = jsonInputElement.value;
  const jsonValue = JSON.parse(jsonInputValue);
  const swagger = generateSwagger(jsonValue);

  ymlInputElement.value = swagger;
}

function handleRequestSubmit(event) {
  event.preventDefault();

  const url = requestInputElement.value;
  $.get(url)
   .then(data => {
     const swagger = generateSwagger(data);
     ymlInputElement.value = swagger;
   })
   .catch(err => console.log(err));
}

document.getElementById('request-form').onsubmit = handleRequestSubmit;
// document.getElementById('json-form').onsubmit = handleJsonSubmit;
