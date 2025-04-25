const xml2js = require('xml2js');

/**
 * Parses an XML string and converts it to a JavaScript object.
 * @param {string} xmlString - The XML string to parse.
 * @returns {Promise<Object>} - A promise that resolves to the parsed object.
 */
async function parseXml(xmlString) {
  const parser = new xml2js.Parser({ explicitArray: false });
  return parser.parseStringPromise(xmlString);
}

/**
 * Creates a job object from the parsed XML object based on the provided mapping.
 * @param {Object} parsedXml - The parsed XML object.
 * @param {Object} mapping - The mapping object that defines how to extract values.
 * @returns {Object} - The job object created from the parsed XML.
 */
function createJobFromXml(parsedXml, mapping) {
  const job = {};
  for (const [jobPath, xmlPath] of Object.entries(mapping)) {
    const value = extractValueFromPath(parsedXml, xmlPath);
    setValueAtPath(job, jobPath, value);
  }
  return job;
}

/**
 * Extracts a value from an object based on a dot-separated path.
 * @param {Object} obj - The object to extract the value from.
 * @param {string} path - The dot-separated path to the value.
 * @returns {*} - The extracted value.
 */
function extractValueFromPath(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

function setValueAtPath(target, path, value) {
  const parts = path.split('.');
  let current = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) current[part] = {};
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

/**
 * Converts an XML string to a job object based on the provided mapping.
 * @param {string} xmlString - The XML string to convert.
 * @param {Object} mapping - The mapping object that defines how to extract values.
 * @returns {Promise<Object>} - A promise that resolves to the job object.
 */
async function xmlToJob(xmlString, mapping) {
  const parsedXml = await parseXml(xmlString);
  return createJobFromXml(parsedXml, mapping);
}

module.exports = {
  xmlToJob
}