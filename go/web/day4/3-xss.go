package main

import (
	"html/template"
	"net/http"
)

func process(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("3-xss.html")
	// t.Execute(w, r.FormValue("comment"))

	w.Header().Set("X-XSS-Protection", "0")
	t.Execute(w, template.HTML(r.FormValue("comment")))
}

func form(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("3-form.html")
	t.Execute(w, nil)
}

func main() {
	server := http.Server{
		Addr: "127.0.0.1:8888",
	}
	http.HandleFunc("/process", process)
	http.HandleFunc("/form", form)
	server.ListenAndServe()
}
