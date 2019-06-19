export default class Loader {

  constructor(name) {
    this.name = name;
  }

  print() {
    console.log(this.name)
    document.getElementById('loader').innerHTML = this.name;
  }
}