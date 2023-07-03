const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");


const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
const map = fn => arr => arr.map(fn);
const objectToEntries = obj => Object.entries(obj);
const entriesToObject = entries => Object.fromEntries(entries);
const log = o => { console.log(o); return o; };


const resolveFilePath = filepath => path.resolve(__dirname, filepath)

const readTextFile = pipe(
  resolveFilePath,
  fs.readFileSync,
  buffer => buffer.toString(),
);

const readJsonFile = pipe(
  readTextFile,
  JSON.parse
)

function readCsvFile(path) {
  return Papa.parse(readTextFile(path), {
    header: true,
    dynamicTyping: true
  }).data;
}

function writeCsvFile({path, data}) {
  return fs.writeFileSync(path, Papa.unparse(data));
}

function writeJsonFile({path, data}) {
  return fs.writeFileSync(path, JSON.stringify(data));
}



// Import env vars from .env.json

function loadEnvVars(path) {
  const envVars = readJsonFile(path);
  Object.entries(envVars).forEach(([key, value])=>{
    process.env[key] = value;
  });
}

function validateEnvVars(envVars) {
  envVars.forEach(envVar => {
    if(!process.env[envVar]) throw `Missing required env var "${envVar}"`;
  })
}

function ensureDirExists(path) {
  if(!fs.existsSync(path)) fs.mkdirSync(path)
}


const normalizeToken = str => {
  console.log(str);
  if(!str) return str;
  return str.trim().toLowerCase();
}

exports.readJsonFile = readJsonFile;
exports.loadEnvVars = loadEnvVars;
exports.validateEnvVars = validateEnvVars;
exports.readCsvFile = readCsvFile;
exports.readTextFile = readTextFile;
exports.normalizeToken = normalizeToken;
exports.writeCsvFile = writeCsvFile;
exports.writeJsonFile = writeJsonFile;
exports.ensureDirExists = ensureDirExists;

exports.pipe = pipe;
exports.map = map;
exports.objectToEntries = objectToEntries;
exports.entriesToObject = entriesToObject;
exports.log = log;
