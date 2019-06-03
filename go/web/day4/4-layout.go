package main

import (
	"html/template"
	"math/rand"
	"net/http"
	"time"
)

func process(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("4-layout.html")
	t.ExecuteTemplate(w, "layout", "")
}

func process2(w http.ResponseWriter, r *http.Request) {
	rand.Seed(time.Now().Unix())
	var t *template.Template
	if rand.Intn(10) > 5 {
		t, _ = template.ParseFiles("4-layout.html", "4-red.html")
	}else {
		t, _ = template.ParseFiles("4-layout.html", "4-blue.html")
	}
	t.ExecuteTemplate(w, "layout", "")	
}

func process3(w http.ResponseWriter, r *http.Request) {
	rand.Seed(time.Now().Unix())
	var t *template.Template
	if rand.Intn(10) > 5 {
		t, _ = template.ParseFiles("4-layout.html", "4-red.html")
	}else {
		t, _ = template.ParseFiles("4-layout.html")
	}
	t.ExecuteTemplate(w, "layout", "")	
}

func main() {
	server := http.Server{
		Addr: "127.0.0.1:8888",
	}

	http.HandleFunc("/process", process)
	http.HandleFunc("/process2", process2)
	http.HandleFunc("/process3", process3)
	server.ListenAndServe()
}
