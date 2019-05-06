class Profile {

  constructor (username, firstName, lastName, password) {
    this.username = username;
    this.name = {
			firstName: firstName,
			lastName: lastName
		};
    this.password = password;
  }
}

let player = new Profile('IV', 'ivan', 'ivanov', 123456);
console.log(player.username);
console.log(player.name);
console.log(player.password);



