
document.querySelector("html").dataset.theme = "dark"


var app = new Vue({
  el: '#app',
  data: {
    pals: {},
    result: {
      foundTarget: true
    },
    target: "",
    available: [],
    iterations: 3
  },
  created() {
    this.fetchpals()
  },
  methods: {
    changeTheme: function () {
      if (document.querySelector("html").dataset.theme == "dark") {
        document.querySelector("html").dataset.theme = "light"
      } else {
        document.querySelector("html").dataset.theme = "dark"
      }
    },
    fetchpals: function(){
        fetch("./data/pals.json")
        .then(r => r.json())
        .then(d => {
            this.pals = d
            this.target = Object.keys(d)[2]
            this.available = ["Relaxaurus", "Woolipop", "Mozzarina"]
            this.checkLocalStorage()
        })
    },
    setFilter: function(k){
        if(this.available.includes(k)){
            this.available = this.available.filter(e => e != k)
        }else{
            this.available.push(k)
        }

        localStorage.setItem("opeweb_breeder", JSON.stringify(this.available))
    },
    checkLocalStorage: function(){
      try {
        let ls = localStorage.getItem("opeweb_breeder")
        if(ls != null){
          this.available = JSON.parse(ls)
        }
      } catch (error) {
        console.error(error.toString())
      }
    },
    start: function(){
        let r = deepBreed(this.target, this.available.map(e=> e.split(" ").join("-")), this.iterations)
        console.log(r)
        this.result = r
        let e = document.querySelector(".mermaid")
        e.removeAttribute("data-processed")
        e.innerHTML = r.mermaidText
        mermaid.run({
            querySelector: '.mermaid',
        });
    }
  }
})
