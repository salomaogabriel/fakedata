import fetch from "node-fetch";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");

// Only needs node fetch when trying without webpage;'
function createPerson() {
  // Generates a username,name,mail and pwd.
  return new Promise((resolve) => {
    fetch("https://api.namefake.com")
      .then((res) => res.json())

      .then((res) => {
        let email = res.email_u + "@" + res.email_d;
        let name = checkName(res.name);
        let person = {
          name: name,
          username: res.username,
          pwd: res.password,
          email: email,
        };
        resolve(person);
      });
  });
}
function getLocation() {
  // // Node fetch doesn't work on local files
  // fetch("https://salomaogabriel.github.io/fakedata/data/country.json")
  //   .then((res) => res.json())
  //   .then((res) => {
  //     console.log(res);
  //   });
  // For some strange reason I can't fetch the location data via node, so until
  // I create the webpage and the API, it'll return just This.
  return new Promise((resolve) => {
    resolve({ country: "Brazil", state: "Bahia" });
  });
}
function checkName(name) {
  return name.replace(/[^a-z-A-Z ]/g, "").replace(/ +/, " ");
}
function generateRandomString(length) {
  return new Promise((resolve) => {
    var include_chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^/&*_+-";
    var charLength = include_chars.length;
    let randomString = "";
    for (var i = 0; i < length; i++) {
      randomString += include_chars[getRandomInteger(0, charLength - 1)];
    }
    resolve(randomString);
  });
}
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomBool() {
  return Math.random() >= 0.5 ? true : false;
}
function createUserDataType(name, types) {
  return { name: name, types: types, length: types.length };
}
function selectRandomUserType(userType) {
  let random = getRandomInteger(0, userType.length);

  return { name: userType.name, type: userType.types[random] };
}

async function createData() {
  let userTypeArray = ["One", "two", "three"];
  let userType = createUserDataType("test", userTypeArray);
  let lenghtOfRandomString = 10;
  let min = 0;
  let max = 100;
  let person_ready = createPerson();
  let location = getLocation();
  let random_string = generateRandomString(lenghtOfRandomString);
  return {
    person: await person_ready,
    location: await location,
    random_string: await random_string,
    int: getRandomInteger(min, max),
    float: getRandomFloat(min, max),
    bool: getRandomBool(),
    userType: selectRandomUserType(userType),
  };
}
function generateData(format, total_length, cur_length, person, location) {
  return new Promise((resolve) => {
    if (format.is_autoincrement) resolve(cur_length);
    if (format.data_type == "int") {
      resolve(getInt(format));
    }
    if (format.data_type == "name") {
      resolve(person.name);
    }
    if (format.data_type == "email") {
      resolve(person.email);
    }
    if (format.data_type == "username") {
      resolve(person.username);
    }
    if (format.data_type == "pwd") {
      resolve(person.pwd);
    }
    if (format.data_type == "country") {
      resolve(location.country);
    }
    if (format.data_type == "state") {
      resolve(location.state);
    }
    if (format.data_type == "string") {
      resolve(generateRandomString(format.max));
    }
    if (format.data_type == "customized") {
    }
    resolve("An error Occured");
  });
}
function getInt(format) {
  let min = format.min;
  let max = format.max;
  if (format.is_random) return getRandomInteger(min, max);
  if (!format.is_random) return format.preset;
}
async function createRequestedData(format, options) {
  let data = [];
  for (var i = 0; i < options.rows; i++) {
    let person = [];
    let location = [];
    if (options.needs_to_create_person) {
      person = createPerson();
    }
    if (options.needs_to_get_location) {
      location = getLocation();
    }
    let row = await GenerateOneRow(format, person, location, options, i);
    data.push(row);
  }
  return data;
}
async function GenerateOneRow(format, person, location, options, i) {
  let row = {};
  for (let format_index = 0; format_index < format.length; format_index++) {
    if (format[format_index].data_type != "array") {
      row[format[format_index].name] = await generateData(
        format[format_index],
        options.rows,
        i,
        await person,
        await location
      );
    } else {
      row[format[format_index].name] = await GenerateOneRow(
        format[format_index].array,
        person,
        location,
        options,
        i
      );
    }
  }
  return row;
}

let options = {
  rows: 1,
  test_all_bool: false,
  needs_to_create_person: false,
  needs_to_get_location: false,
};
let format = [
  {
    name: "id",
    data_type: "int",
    is_autoincrement: true,
    is_random: false,
    is_customized: false,
    customized_data_type: {},
    array: [],
    array_length: 0,
    min: 0,
    max: 100,
    preset: 0,
  },
  {
    name: "string",
    data_type: "string",
    is_autoincrement: false,
    is_random: true,
    is_customized: false,
    customized_data_type: {},
    array: [],
    array_length: 0,
    min: 0,
    max: 10,
    preset: 0,
  },
  {
    name: "email",
    data_type: "array",
    is_autoincrement: false,
    is_random: true,
    is_customized: false,
    customized_data_type: {},
    array: [
      {
        name: "id",
        data_type: "int",
        is_autoincrement: true,
        is_random: false,
        is_customized: false,
        customized_data_type: {},
        array: [],
        array_length: 0,

        min: 0,
        max: 100,
        preset: 0,
      },
      {
        name: "id_two",
        data_type: "int",
        is_autoincrement: true,
        is_random: false,
        is_customized: false,
        customized_data_type: {},
        array: [],
        array_length: 0,

        min: 0,
        max: 100,
        preset: 0,
      },
    ],
    array_length: 1,
    min: 0,
    max: 40,
    preset: 0,
  },
];
createRequestedData(format, options).then((data) => {
  console.log(data);
  fs.writeFile("test.txt", JSON.stringify(data), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
});

// createData().then((data) => {
//   console.log(data.userType.type);
// });
// { email: [ { id: 0 } ] }
