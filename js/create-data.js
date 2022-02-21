import fetch from "node-fetch";

// Only needs node fetch when trying without webpage;'
function createPerson() {
  // Generates a username,name,mail and pwd.
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

      return person;
    });
}
function getLocation() {
  // Node fetch doesn't work on local files
  fetch("https://salomaogabriel.github.io/fakedata/data/country.json")
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    });
}
function checkName(name) {
  return name;
}

let person_ready = createPerson();
// console.log(person_ready);
getLocation();
