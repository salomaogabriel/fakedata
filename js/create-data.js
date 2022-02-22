import fetch from "node-fetch";

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
function generateData(format, total_length, cur_length) {
  return new Promise((resolve) => {
    if (format.is_autoincrement) resolve(cur_length);
    if (format.data_type == "int") {
      resolve(getInt(format));
    }
    if (format.data_type == "name") {
      createPerson().then((res) => resolve(res.name));
    }
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
    let row = [];
    for (let format_index = 0; format_index < format.length; format_index++) {
      let column = {
        [format[format_index].name]: await generateData(
          format[format_index],
          options.rows,
          i
        ),
      };
      row.push(column);
    }
    data.push(row);
  }
  return data;
}

let options = { rows: 10, test_all_bool: false };
let format = [
  {
    name: "id",
    data_type: "int",
    is_autoincrement: true,
    is_random: false,
    is_customized: false,
    customized_data_type: {},
    min: 0,
    max: 100,
    preset: 0,
  },
  {
    name: "name",
    data_type: "name",
    is_autoincrement: false,
    is_random: true,
    is_customized: false,
    customized_data_type: {},
    min: 0,
    max: 40,
    preset: 0,
  },
];
createRequestedData(format, options).then((data) => {
  console.log(data);
});
// createData().then((data) => {
//   console.log(data.userType.type);
// });
