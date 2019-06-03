package main

import (
	"html/template"
	"net/http"
)

func process(w http.ResponseWriter, r *http.Request) {
	// #1. 进行语法分析
		//	相当于创建了一个新模板, 并用给定的模板文件的名字当做新模板的名字
		//	t := template.New("1-template.html") 
		//	t, _ = t.ParseFiles("1-template.html")
	t, _ := template.ParseFiles("1-template.html")
	// #2. 将数据应用到模板里
	t.Execute(w, "Hello world")

	// #3
	// t, _ := template.ParseFiles("t1.html", "t2.html")
	// t.Execute(w, "hello") 只有t1.html模板会被执行
	// 如果要执行模板t2.html则需要:
	// t.ExecuteTempate(w, "t2.html", "hello")
}

func main() {
	server := http.Server{
		Addr: "127.0.0.1:8888",
	}
	http.HandleFunc("/process", process)
	server.ListenAndServe()
}
