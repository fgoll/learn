package main

import (
	"html/template"
	"math/rand"
	"net/http"
	"time"
)

func processIf(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("2-template.html")
	rand.Seed(time.Now().Unix())
	t.Execute(w, rand.Intn(10) > 5)
}

func processRange(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("2-template.html")
	daysOfWeek := []string{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"}
	t.Execute(w, daysOfWeek)
}

func processWith(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("2-template.html")
	t.Execute(w, "hello")
}

func processInclude(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("2-template.html", "1-template.html")
	t.Execute(w, "hello world")
}

func formatDate(t time.Time) string {
	layout := "2006-01-02"
	return t.Format(layout)
}

func processFunc(w http.ResponseWriter, r *http.Request) {
	funcMap := template.FuncMap{ "fdate": formatDate }
	t := template.New("2-template.html").Funcs(funcMap)
	t, _ = t.ParseFiles("2-template.html")
	t.Execute(w, time.Now())
}

func processContext(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("2-template.html")
	content := `I asked: <i>"What's up?"</i>`
	t.Execute(w, content)
}

func main() {
	server := http.Server{
		Addr: "127.0.0.1:8888",
	}
	http.HandleFunc("/if", processIf)
	http.HandleFunc("/range", processRange)
	http.HandleFunc("/with", processWith)
	http.HandleFunc("/include", processInclude)
	http.HandleFunc("/func", processFunc)
	http.HandleFunc("/context", processContext)
	server.ListenAndServe()
}
